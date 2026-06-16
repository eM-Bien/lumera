// app/api/checkout/route.ts — tworzy Stripe Checkout Session.
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getEntry } from "@/lib/server-catalog";

type IncomingItem = { id: string; qty: number };

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: IncomingItem[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Pusty koszyk" }, { status: 400 });
    }

    // Budujemy pozycje WYŁĄCZNIE z cennika serwerowego — cena z klienta jest ignorowana.
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const { id, qty } of items) {
      const entry = getEntry(id);
      if (!entry) {
        return NextResponse.json(
          { error: `Nieznany produkt: ${id}` },
          { status: 400 },
        );
      }
      const quantity = Number.isInteger(qty) && qty > 0 ? qty : 1;
      line_items.push({
        quantity,
        price_data: {
          currency: "pln",
          unit_amount: entry.amount, // grosze, brutto (zawiera VAT 5%)
          product_data: { name: entry.title },
        },
      });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      locale: "pl",
      line_items,
      success_url: `${base}/platnosc/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/koszyk`,

      // dane do faktury: adres + opcjonalny NIP
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },

      // automatyczna faktura Stripe
      invoice_creation: { enabled: true },

      // do dostarczenia pliku w webhooku
      metadata: {
        itemIds: items.map((i) => i.id).join(","),
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
