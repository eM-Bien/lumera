// app/api/kontakt/route.ts — przyjmuje formularz kontaktowy i wysyła maila przez Resend.
import { NextResponse } from "next/server";
import { bookingTitle } from "@/app/components/ContactForm/booking-options";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Payload = {
  zabieg?: string;
  lokalizacja?: string;
  data?: string;
  pora?: string;
  imie?: string;
  nazwisko?: string;
  email?: string;
  telefon?: string;
  wiadomosc?: string;
  zgoda?: boolean;
  firma?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;
const PHONE_RE = /^\d{9}$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px;color:#9a8c6f;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:6px 12px;color:#f0e6d2">${escapeHtml(value) || "—"}</td>
  </tr>`;
}

export async function POST(request: Request) {
  // Honeypot zatrzymuje proste boty, ale skrypt uderzający prosto w API go
  // omija — bez limitu ten endpoint jest darmowym generatorem maili.
  const { rateLimited, retryAfterS } = await checkRateLimit(request, {
    bucket: "kontakt",
    limit: 5,
    windowS: 60 * 60,
  });
  if (rateLimited) {
    return NextResponse.json(
      { error: "Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę." },
      { status: 429, headers: { "Retry-After": String(retryAfterS) } },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  if (body.firma && body.firma.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const imie = (body.imie ?? "").trim();
  const nazwisko = (body.nazwisko ?? "").trim();
  const email = (body.email ?? "").trim();
  const telefon = (body.telefon ?? "").trim();
  const lokalizacja = (body.lokalizacja ?? "").trim();

  if (
    !imie ||
    !nazwisko ||
    !EMAIL_RE.test(email) ||
    !PHONE_RE.test(telefon) ||
    !lokalizacja ||
    body.zgoda !== true
  ) {
    return NextResponse.json(
      {
        error:
          "Uzupełnij imię i nazwisko, poprawny e-mail, telefon (9 cyfr), lokalizację i zgodę.",
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Brak RESEND_API_KEY w środowisku.");
    return NextResponse.json(
      { error: "Wysyłka chwilowo niedostępna. Spróbuj później." },
      { status: 500 },
    );
  }

  const zabiegNazwa = bookingTitle((body.zabieg ?? "").trim());
  const from =
    process.env.CONTACT_FROM?.trim() || "Lumera <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO?.trim() || "kontakt@lumera-clinic.pl";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#0a0720;padding:24px">
      <table style="width:100%;max-width:560px;margin:0 auto;border-collapse:collapse;background:#12102a;border-radius:12px;overflow:hidden">
        <tr><td style="padding:18px 12px;font-size:18px;color:#c2a36b;font-weight:bold">Nowa prośba o rezerwację</td></tr>
        ${row("Zabieg", zabiegNazwa)}
        ${row("Lokalizacja", lokalizacja)}
        ${row("Preferowany termin", [body.data, body.pora].filter(Boolean).join(", "))}
        ${row("Imię", imie)}
        ${row("Nazwisko", nazwisko)}
        ${row("E-mail", email)}
        ${row("Telefon", telefon)}
        ${row("Wiadomość", (body.wiadomosc ?? "").trim())}
      </table>
    </div>`;

  const text = [
    "Nowa prośba o rezerwację",
    `Zabieg: ${zabiegNazwa}`,
    `Lokalizacja: ${lokalizacja}`,
    `Termin: ${[body.data, body.pora].filter(Boolean).join(", ") || "—"}`,
    `Imię: ${imie}`,
    `Nazwisko: ${nazwisko}`,
    `E-mail: ${email}`,
    `Telefon: ${telefon || "—"}`,
    `Wiadomość: ${(body.wiadomosc ?? "").trim() || "—"}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Rezerwacja: ${zabiegNazwa} — ${imie} ${nazwisko}`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return NextResponse.json(
        { error: "Nie udało się wysłać wiadomości. Spróbuj później." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Błąd wysyłki maila:", err);
    return NextResponse.json(
      { error: "Nie udało się wysłać wiadomości. Spróbuj później." },
      { status: 500 },
    );
  }
}
