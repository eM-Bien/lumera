// app/api/checkout/route.ts — tworzy Stripe Checkout Session.
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getEntry, getPriceId } from "@/lib/server-catalog";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type IncomingItem = { id: string; qty: number };

export async function POST(request: Request) {
  // Każde wywołanie tworzy sesję w Stripe — bez limitu da się zaśmiecić
  // dashboard i dobić do limitów API.
  const { rateLimited, retryAfterS } = await checkRateLimit(request, {
    bucket: "checkout",
    limit: 10,
    windowS: 10 * 60,
  });
  if (rateLimited) {
    return NextResponse.json(
      { error: "Zbyt wiele prób płatności. Spróbuj ponownie za chwilę." },
      { status: 429, headers: { "Retry-After": String(retryAfterS) } },
    );
  }

  try {
    const { items, marketing } = (await request.json()) as {
      items: IncomingItem[];
      marketing?: boolean;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Pusty koszyk" }, { status: 400 });
    }

    const taxRateId = process.env.STRIPE_TAX_RATE_ID?.trim();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const { id, qty } of items) {
      const priceId = getPriceId(id);
      if (!getEntry(id) || !priceId) {
        return NextResponse.json(
          { error: `Nieznany produkt: ${id}` },
          { status: 400 },
        );
      }
      const quantity = Number.isInteger(qty) && qty > 0 ? qty : 1;
      line_items.push({
        price: priceId,
        quantity,
        ...(taxRateId ? { tax_rates: [taxRateId] } : {}),
      });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      line_items,
      success_url: `${base}/platnosc/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/koszyk`,

      billing_address_collection: "required",
      tax_id_collection: { enabled: true },

      invoice_creation: { enabled: true },

      metadata: {
        itemIds: items.map((i) => i.id).join(","),
        marketing: marketing ? "1" : "0",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Nie udało się utworzyć płatności" },
      { status: 500 },
    );
  }
}
