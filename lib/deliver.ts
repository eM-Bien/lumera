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
      <a href="${l.url}"
         style="display:inline-block;margin:0 0 14px;padding:17px 40px;border-radius:999px;background:#c2a36b;color:#0a0720;font-size:16px;font-weight:bold;text-decoration:none">
        Pobierz ebook
      </a><br>`,
    )
    .join("");

  const html = `
    <div style="margin:0;padding:0;background:#0a0720">
      <div style="max-width:600px;margin:0 auto;padding:60px 40px;text-align:left;background-color:#0a0720;background:linear-gradient(160deg,#1c1446 0%,#0a0720 58%,#05030f 100%);font-family:Arial,Helvetica,sans-serif">
        <p style="margin:0 0 26px;font-size:12px;letter-spacing:5px;text-transform:uppercase;color:#c2a36b">Lumera</p>
        <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.15;font-weight:normal;color:#f0e6d2">Dziękujemy za zakup&nbsp;🤍</h1>
        <p style="margin:0 0 34px;font-size:17px;line-height:1.65;color:#c9bfa8">Twój ebook jest gotowy do pobrania. Kliknij poniżej:</p>
        ${buttons}
        <p style="margin:26px 0 0;font-size:13px;line-height:1.7;color:#8a7d63">
          Link jest ważny 7 dni. Jeśli wygaśnie lub coś nie zadziała, napisz na
          <a href="mailto:${SUPPORT_EMAIL}" style="color:#c2a36b">${SUPPORT_EMAIL}</a>.
        </p>
      </div>
    </div>`;

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
      subject: "Ebook z Lumery czeka na Ciebie 🤍",
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
