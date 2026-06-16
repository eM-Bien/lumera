// lib/stripe.ts — instancja Stripe po stronie serwera.
// STRIPE_SECRET_KEY trzymaj w .env.local, NIGDY w kliencie/repo.
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Brak STRIPE_SECRET_KEY w zmiennych środowiskowych");
}

// Bez przypinania apiVersion — użyje wersji przypisanej do konta,
// dzięki czemu kod się nie zestarzeje wraz z kolejnymi wersjami API.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
