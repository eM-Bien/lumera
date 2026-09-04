// scripts/create-price.mjs — tworzy nową cenę dla ebooka w Stripe.
// Tryb (test/live) wynika z klucza STRIPE_SECRET_KEY w .env.local.
//
// Użycie (z katalogu projektu):
//   node scripts/create-price.mjs           # domyślnie 49 zł (4900 gr)
//   node scripts/create-price.mjs 4900      # dowolna kwota w groszach
//
// Podpina cenę pod produkt istniejącej ceny z EBOOK_1_PRICE_ID (jeśli jest),
// żeby nie mnożyć produktów. Po utworzeniu wypisze nowe price_… — wklej je
// do .env.local jako EBOOK_1_PRICE_ID (a w Vercelu zrób to samo dla live).
import Stripe from "stripe";
import { readFile } from "node:fs/promises";

async function envValue(key) {
  if (process.env[key]) return process.env[key];
  try {
    const env = await readFile(new URL("../.env.local", import.meta.url), "utf8");
    const m = env.match(new RegExp(`^${key}=(.+)$`, "m"));
    if (m) return m[1].trim();
  } catch {}
  return null;
}

const secret = await envValue("STRIPE_SECRET_KEY");
if (!secret) {
  console.error("Brak STRIPE_SECRET_KEY w .env.local.");
  process.exit(1);
}

const amount = Number(process.argv[2] || 4900);
if (!Number.isInteger(amount) || amount < 200) {
  console.error("Kwota (w groszach) musi być liczbą ≥ 200 (min. 2,00 zł dla PLN).");
  process.exit(1);
}

const mode = secret.startsWith("sk_live") ? "LIVE" : "TEST";
const stripe = new Stripe(secret);

// Spróbuj podpiąć się pod produkt istniejącej ceny.
let productId = null;
const oldPriceId = await envValue("EBOOK_1_PRICE_ID");
if (oldPriceId) {
  try {
    const old = await stripe.prices.retrieve(oldPriceId);
    if (typeof old.product === "string") productId = old.product;
  } catch (err) {
    console.warn("Nie udało się odczytać starej ceny (inny tryb?):", err.message);
  }
}

try {
  const price = await stripe.prices.create({
    currency: "pln",
    unit_amount: amount,
    ...(productId
      ? { product: productId }
      : { product_data: { name: "Poznaj swoją skórę (ebook)" } }),
  });

  console.log(`\nUtworzono cenę w trybie ${mode} ✓`);
  console.log(`Kwota: ${(amount / 100).toFixed(2)} zł`);
  if (productId) console.log(`Produkt: ${productId}`);
  console.log("\nWklej to do .env.local jako EBOOK_1_PRICE_ID:\n");
  console.log(price.id + "\n");
} catch (err) {
  console.error("\n=== BŁĄD TWORZENIA CENY ===");
  console.error(err?.message || err);
  process.exit(1);
}
