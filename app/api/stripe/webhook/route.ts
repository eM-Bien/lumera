// app/api/stripe/webhook/route.ts — pewny sygnał „zapłacono" od Stripe.
// To TUTAJ realizujemy zamówienie (nie na stronie sukcesu, do której klient
// może nie dotrzeć). Weryfikujemy podpis surowego body, a po opłaceniu
// wysyłamy pliki i (za zgodą) dopisujemy kupującego do listy mailingowej.
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getEntry } from "@/lib/server-catalog";
import {
  buildDownloadLinks,
  sendDeliveryEmail,
  addToAudience,
} from "@/lib/deliver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fulfill(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== "paid") return;

  const email = session.customer_details?.email;
  const ids = (session.metadata?.itemIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((id) => getEntry(id) !== null);

  if (!email || ids.length === 0) return;

  await sendDeliveryEmail(email, buildDownloadLinks(ids, email));

  if (session.metadata?.marketing === "1") {
    await addToAudience(email, session.customer_details?.name ?? undefined);
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Brak STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook nieskonfigurowany", { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) return new Response("Brak podpisu", { status: 400 });

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("Weryfikacja podpisu webhooka nieudana:", err);
    return new Response("Nieprawidłowy podpis", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      await fulfill(event.data.object);
    } catch (err) {
      console.error("Błąd realizacji zamówienia:", err);
      // 500 → Stripe ponowi próbę
      return new Response("Błąd realizacji", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}
