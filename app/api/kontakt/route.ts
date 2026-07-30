// app/api/kontakt/route.ts — przyjmuje formularz kontaktowy i wysyła maila przez Resend.
import { NextResponse } from "next/server";
import { bookingTitle } from "@/app/components/ContactForm/booking-options";

type Payload = {
  zabieg?: string;
  lokalizacja?: string;
  data?: string;
  pora?: string;
  imie?: string;
  email?: string;
  telefon?: string;
  wiadomosc?: string;
  zgoda?: boolean;
  firma?: string; // honeypot — powinno zostać puste
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  // Honeypot: bot wypełnił ukryte pole — udajemy sukces, nie wysyłamy.
  if (body.firma && body.firma.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const imie = (body.imie ?? "").trim();
  const email = (body.email ?? "").trim();
  const lokalizacja = (body.lokalizacja ?? "").trim();

  if (!imie || !EMAIL_RE.test(email) || !lokalizacja || body.zgoda !== true) {
    return NextResponse.json(
      { error: "Uzupełnij imię, poprawny e-mail, lokalizację i zgodę." },
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
  // Uwaga: `||`, nie `??` — puste CONTACT_FROM (="") też ma wpaść w domyślne.
  const from =
    process.env.CONTACT_FROM?.trim() || "Lumera <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO?.trim() || "kontakt@lumera.pl";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#0a0720;padding:24px">
      <table style="width:100%;max-width:560px;margin:0 auto;border-collapse:collapse;background:#12102a;border-radius:12px;overflow:hidden">
        <tr><td style="padding:18px 12px;font-size:18px;color:#c2a36b;font-weight:bold">Nowa prośba o rezerwację</td></tr>
        ${row("Zabieg", zabiegNazwa)}
        ${row("Lokalizacja", lokalizacja)}
        ${row("Preferowany termin", [body.data, body.pora].filter(Boolean).join(", "))}
        ${row("Imię", imie)}
        ${row("E-mail", email)}
        ${row("Telefon", (body.telefon ?? "").trim())}
        ${row("Wiadomość", (body.wiadomosc ?? "").trim())}
      </table>
    </div>`;

  const text = [
    "Nowa prośba o rezerwację",
    `Zabieg: ${zabiegNazwa}`,
    `Lokalizacja: ${lokalizacja}`,
    `Termin: ${[body.data, body.pora].filter(Boolean).join(", ") || "—"}`,
    `Imię: ${imie}`,
    `E-mail: ${email}`,
    `Telefon: ${(body.telefon ?? "").trim() || "—"}`,
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
        subject: `Rezerwacja: ${zabiegNazwa} — ${imie}`,
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
