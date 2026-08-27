// app/api/pobierz/route.ts — bezpieczne pobieranie pliku po opłaceniu.
// Weryfikuje podpisany, wygasający token, po czym streamuje PDF z PRYWATNEGO
// magazynu (Vercel Blob). Odczyt wymaga tokenu (BLOB_READ_WRITE_TOKEN), więc
// nawet gdyby URL pliku wyciekł, jest bezużyteczny bez tokenu serwera.
import crypto from "node:crypto";
import { get } from "@vercel/blob";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { verifyDownload } from "@/lib/download-token";
import { getEntry, getFileUrl } from "@/lib/server-catalog";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOWNLOAD_LIMIT = 2;
const COUNTER_TTL_S = 7 * 24 * 60 * 60; // 7 dni

// Zwraca true, jeśli wolno pobrać. Liczy użycia tego linku w Redisie; po
// przekroczeniu limitu blokuje. Gdy Redis niedostępny — przepuszcza (limit to
// bezpiecznik, nie zabezpieczenie krytyczne; nie blokujemy płacącego klienta).
async function withinLimit(token: string): Promise<boolean> {
  try {
    const redis = await getRedis();
    if (!redis) return true;
    const key =
      "dl:" + crypto.createHash("sha256").update(token).digest("hex");
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, COUNTER_TTL_S);
    return count <= DOWNLOAD_LIMIT;
  } catch (err) {
    console.error("Redis licznik error (przepuszczam pobranie):", err);
    return true;
  }
}

// Stemplujemy każdą stronę dyskretnym podpisem z e-mailem kupującego —
// przeciek staje się imienny i namierzalny. Gdyby stemplowanie zawiodło,
// oddajemy oryginał (nie blokujemy płacącego klienta z powodu znaku wodnego).
async function watermarkPdf(
  bytes: Uint8Array,
  email: string,
): Promise<Uint8Array> {
  if (!email) return bytes;
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const label = `Kopia dla: ${email} · Lumera`;
  const size = 8;
  for (const page of pdf.getPages()) {
    page.drawText(label, {
      x: 24,
      y: 14,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.6,
    });
  }
  return pdf.save();
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t");
  if (!token) {
    return new Response("Brak tokenu pobierania.", { status: 400 });
  }

  const payload = verifyDownload(token);
  if (!payload) {
    return new Response(
      "Link wygasł lub jest nieprawidłowy. Skontaktuj się z nami, a wyślemy nowy.",
      { status: 403 },
    );
  }

  const entry = getEntry(payload.id);
  const fileUrl = getFileUrl(payload.id);
  if (!entry || !fileUrl) {
    return new Response("Plik jest chwilowo niedostępny.", { status: 404 });
  }

  if (!(await withinLimit(token))) {
    return new Response(
      "Ten link osiągnął limit pobrań. W razie wątpliwości kontakt: kontakt@lumera-clinic.pl",
      { status: 429 },
    );
  }

  let result;
  try {
    result = await get(fileUrl, { access: "private" });
  } catch (err) {
    console.error("Blob get error:", err);
    return new Response("Nie udało się pobrać pliku. Spróbuj ponownie.", {
      status: 502,
    });
  }
  if (result?.statusCode !== 200) {
    return new Response("Plik jest chwilowo niedostępny.", { status: 404 });
  }

  const original = new Uint8Array(
    await new Response(result.stream).arrayBuffer(),
  );
  let out: Uint8Array = original;
  try {
    out = await watermarkPdf(original, payload.email);
  } catch (err) {
    console.error("Watermark error (oddaję oryginał):", err);
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${entry.fileName}"`,
  );
  headers.set("Content-Length", String(out.byteLength));
  headers.set("Cache-Control", "private, no-store");

  return new Response(Buffer.from(out), { status: 200, headers });
}
