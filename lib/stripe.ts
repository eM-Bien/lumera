// lib/stripe.ts — leniwa instancja Stripe (serwer).
// Klucz sprawdzany dopiero przy użyciu (runtime), nie przy imporcie —
// dzięki temu build (np. na Vercelu) przechodzi nawet bez zmiennych env.
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Brak STRIPE_SECRET_KEY w zmiennych środowiskowych");
  }

  _stripe = new Stripe(key);
  return _stripe;
}
