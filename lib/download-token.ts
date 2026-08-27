// lib/download-token.ts — podpisane, wygasające tokeny do pobierania plików.
// Bez bazy danych: token = base64url(payload) + "." + HMAC-SHA256(payload).
// Payload zawiera id produktu i czas wygaśnięcia. Sekret w DOWNLOAD_SECRET.
import crypto from "node:crypto";

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dni

function secret(): string {
  const s = process.env.DOWNLOAD_SECRET;
  if (!s) throw new Error("Brak DOWNLOAD_SECRET w zmiennych środowiskowych");
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signDownload(
  id: string,
  email: string,
  ttlMs: number = DEFAULT_TTL_MS,
): string {
  const payload = Buffer.from(
    JSON.stringify({ id, email, exp: Date.now() + ttlMs }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyDownload(
  token: string,
): { id: string; email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, providedSig] = parts;

  const expected = sign(payload);
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.id !== "string") return null;
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    return { id: data.id, email: typeof data.email === "string" ? data.email : "" };
  } catch {
    return null;
  }
}
