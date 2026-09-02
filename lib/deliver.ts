// lib/deliver.ts — realizacja zamówienia: mail z linkami do pobrania (Resend)
// oraz opcjonalne dopisanie kupującego do listy mailingowej (Resend Audiences).
import { getEntry } from "./server-catalog";
import { signDownload } from "./download-token";

type DownloadLink = { title: string; url: string };

const SUPPORT_EMAIL = "kontakt@lumera-clinic.pl";

function baseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
}

export function buildDownloadLinks(ids: string[], email: string): DownloadLink[] {
  const links: DownloadLink[] = [];
  for (const id of ids) {
    const entry = getEntry(id);
    if (!entry) continue;
    const token = signDownload(id, email);
    links.push({
      title: entry.title,
      // Link do STRONY pobrania (nie bezpośrednio do pliku) — dzięki temu
      // skanery poczty otwierające link nie zużywają limitu pobrań.
      url: `${baseUrl()}/pobierz?t=${encodeURIComponent(token)}`,
    });
  }
  return links;
}

export async function sendDeliveryEmail(
  to: string,
  links: DownloadLink[],
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Brak RESEND_API_KEY");
  const from =
    process.env.DELIVERY_FROM?.trim() ||
    process.env.CONTACT_FROM?.trim() ||
    "Lumera <onboarding@resend.dev>";

  const buttons = links
    .map(
      (l) => `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px">
        <tr><td bgcolor="#14102e" style="background-color:#14102e;border-radius:999px">
          <a href="${l.url}" style="display:inline-block;padding:16px 42px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#e9d9b8;text-decoration:none">Pobierz ebook</a>
        </td></tr>
      </table>`,
    )
    .join("");

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#edeef1" style="margin:0;padding:0;background-color:#edeef1">
      <tr><td align="center" style="padding:28px 12px;background-color:#edeef1">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e6e6ea;border-radius:14px">
          <tr><td style="padding:52px 44px;font-family:Arial,Helvetica,sans-serif;color:#33333a">
            <div style="font-size:12px;letter-spacing:5px;text-transform:uppercase;color:#c2a36b;margin:0 0 10px">Lumera</div>
            <div style="height:1px;line-height:1px;font-size:0;background-color:#e6e6ea;width:44px;margin:0 0 26px">&nbsp;</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;color:#1b1640;margin:0 0 14px">Dziękujemy za zakup&nbsp;<span style="color:#1b1640">&#10084;</span></div>
            <div style="font-size:16px;line-height:1.65;color:#5a5a63;margin:0 0 32px">Twój ebook jest gotowy do pobrania. Kliknij poniżej:</div>
            ${buttons}
            <div style="font-size:13px;line-height:1.7;color:#8a8a92;margin:28px 0 0">Link jest ważny 7 dni. Jeśli wygaśnie lub coś nie zadziała, napisz na <a href="mailto:${SUPPORT_EMAIL}" style="color:#c2a36b">${SUPPORT_EMAIL}</a>.</div>
          </td></tr>
        </table>
      </td></tr>
    </table>`;

  const text = [
    "Dziękujemy za zakup w Lumerze!",
    "",
    "Twoje pliki do pobrania:",
    ...links.map((l) => `- ${l.title}: ${l.url}`),
    "",
    "Link jest ważny 7 dni.",
    `W razie problemów: ${SUPPORT_EMAIL}.`,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: SUPPORT_EMAIL,
      subject: "Ebook z Lumery czeka na Ciebie 🩶",
      html,
      text,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend delivery failed: ${res.status} ${detail}`);
  }
}

// Dopisanie kupującego do listy mailingowej. Cicho pomijane, jeśli lista nie
// jest skonfigurowana; duplikaty/inne błędy nie wywracają realizacji zamówienia.
export async function addToAudience(
  email: string,
  name?: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) return;

  try {
    await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        ...(name ? { first_name: name } : {}),
      }),
    });
  } catch (err) {
    console.error("addToAudience error:", err);
  }
}
