// app/api/webhooks/stripe/route.ts — odbiera potwierdzenia płatności od Stripe.
// To JEDYNE wiarygodne źródło informacji "zapłacono" (success_url da się podrobić).
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

// webhook MUSI działać na runtime Node.js (potrzebny surowy body + crypto)
export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text(); // RAW body — wymagane do weryfikacji podpisu
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Brak podpisu" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Błąd weryfikacji webhooka:", err);
    return NextResponse.json({ error: "Zły podpis" }, { status: 400 });
  }

  // Idempotencja: Stripe potrafi wysłać ten sam event kilka razy.
  // TODO: zapisz event.id w bazie i pomiń, jeśli już przetworzony.

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // dopuść tylko realnie opłacone sesje
      if (session.payment_status === "paid") {
        const email = session.customer_details?.email;
        const itemIds = (session.metadata?.itemIds ?? "").split(",");

        // TODO: DOSTARCZENIE PRODUKTU
        // 1) wygeneruj signed URL do pliku w prywatnym storage (S3/R2/Supabase)
        // 2) wyślij mail (Resend/Postmark) z linkiem na `email`
        // 3) ewentualnie zapisz zamówienie w bazie
        console.log("Opłacono:", { email, itemIds });
      }
      break;
    }

    default:
      // pozostałe eventy ignorujemy
      break;
  }

  // 200 = potwierdzenie odbioru. Inaczej Stripe ponawia wysyłkę.
  return NextResponse.json({ received: true });
}
