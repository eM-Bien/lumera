// app/api/webhooks/stripe/route.ts — odbiera potwierdzenia płatności od Stripe.
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Brak podpisu" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Błąd weryfikacji webhooka:", err);
    return NextResponse.json({ error: "Zły podpis" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        const email = session.customer_details?.email;
        const itemIds = (session.metadata?.itemIds ?? "").split(",");

        console.log("Opłacono:", { email, itemIds });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
