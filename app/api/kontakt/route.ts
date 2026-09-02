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
    <td style="padding:7px 0;color:#8a8a92;white-space:nowrap;vertical-align:top;font-size:14px">${label}</td>
    <td style="padding:7px 0 7px 16px;color:#33333a;font-size:14px">${escapeHtml(value) || "-"}</td>
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
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#edeef1" style="margin:0;padding:0;background-color:#edeef1">
      <tr><td align="center" style="padding:28px 12px;background-color:#edeef1">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e6e6ea;border-radius:14px">
          <tr><td style="padding:40px 44px;font-family:Arial,Helvetica,sans-serif;color:#33333a">
            <div style="font-size:12px;letter-spacing:5px;text-transform:uppercase;color:#c2a36b;margin:0 0 10px">Lumera</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#1b1640;margin:0 0 20px">Nowa prośba o rezerwację</div>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
              ${row("Zabieg", zabiegNazwa)}
              ${row("Lokalizacja", lokalizacja)}
              ${row("Preferowany termin", [body.data, body.pora].filter(Boolean).join(", "))}
              ${row("Imię", imie)}
              ${row("Nazwisko", nazwisko)}
              ${row("E-mail", email)}
              ${row("Telefon", telefon)}
              ${row("Wiadomość", (body.wiadomosc ?? "").trim())}
            </table>
          </td></tr>
        </table>
      </td></tr>
    </table>`;

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

    // Automatyczne potwierdzenie dla klienta. Nie blokuje zgłoszenia —
    // powiadomienie do salonu już poszło, więc błąd tutaj tylko logujemy.
    try {
      const termin = [body.data, body.pora].filter(Boolean).join(", ");
      const clientFrom = process.env.DELIVERY_FROM?.trim() || from;
      const recap = [
        `<strong style="color:#1b1640">Zabieg:</strong> ${escapeHtml(zabiegNazwa)}`,
        `<strong style="color:#1b1640">Lokalizacja:</strong> ${escapeHtml(lokalizacja)}`,
        termin
          ? `<strong style="color:#1b1640">Preferowany termin:</strong> ${escapeHtml(termin)}`
          : "",
      ]
        .filter(Boolean)
        .join("<br>");

      const confHtml = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#edeef1" style="margin:0;padding:0;background-color:#edeef1">
          <tr><td align="center" style="padding:28px 12px;background-color:#edeef1">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e6e6ea;border-radius:14px">
              <tr><td style="padding:52px 44px;font-family:Arial,Helvetica,sans-serif;color:#33333a">
                <div style="font-size:12px;letter-spacing:5px;text-transform:uppercase;color:#c2a36b;margin:0 0 10px">Lumera</div>
                <div style="height:1px;line-height:1px;font-size:0;background-color:#e6e6ea;width:44px;margin:0 0 26px">&nbsp;</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;color:#1b1640;margin:0 0 14px">Dziękujemy&nbsp;<span style="color:#1b1640">&#10084;</span></div>
                <div style="font-size:16px;line-height:1.65;color:#5a5a63;margin:0 0 24px">Otrzymaliśmy Twoje zgłoszenie i wkrótce odezwiemy się, żeby potwierdzić termin.</div>
                <div style="font-size:15px;line-height:1.9;color:#33333a;margin:0 0 8px">${recap}</div>
                <div style="font-size:13px;line-height:1.7;color:#8a8a92;margin:28px 0 0">To wiadomość automatyczna - prosimy na nią nie odpowiadać. W razie pytań napisz na <a href="mailto:${to}" style="color:#c2a36b">${to}</a> lub zadzwoń +48 505 829 913.</div>
              </td></tr>
            </table>
          </td></tr>
        </table>`;

      const confText = [
        "Dziękujemy!",
        "",
        "Otrzymaliśmy Twoje zgłoszenie i wkrótce odezwiemy się, żeby potwierdzić termin.",
        "",
        `Zabieg: ${zabiegNazwa}`,
        `Lokalizacja: ${lokalizacja}`,
        termin ? `Preferowany termin: ${termin}` : "",
        "",
        "To wiadomość automatyczna - prosimy na nią nie odpowiadać.",
        `W razie pytań: ${to} lub tel. +48 505 829 913`,
      ]
        .filter((line) => line !== "")
        .join("\n");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: clientFrom,
          to: email,
          reply_to: to,
          subject: "Dziękujemy za wiadomość — Lumera",
          html: confHtml,
          text: confText,
        }),
      });
    } catch (err) {
      console.error("Auto-potwierdzenie nie wysłane:", err);
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
