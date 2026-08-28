// lib/server-catalog.ts — mapowanie naszych id produktów na zasoby Stripe/pliki
// (po stronie serwera). Klient przysyła tylko id; cenę bierzemy z CENY W STRIPE
// (Price ID), więc nie da się jej podmienić z koszyka. Price ID i URL pliku
// trzymamy w zmiennych środowiskowych (osobne dla test/live) — bez commitowania.

export type CatalogEntry = {
  title: string;
  priceEnv: string; // nazwa env ze Stripe Price ID (np. EBOOK_1_PRICE_ID)
  fileName: string; // nazwa pliku widoczna przy pobieraniu (ASCII)
  fileEnv: string; // nazwa env z prywatnym URL-em pliku (Vercel Blob)
};

export const CATALOG: Record<string, CatalogEntry> = {
  "ebook-1": {
    title: "Poznaj swoją skórę",
    priceEnv: "EBOOK_1_PRICE_ID",
    fileName: "Poznaj-swoja-skore.pdf",
    fileEnv: "EBOOK_1_FILE_URL",
  },
};

export function getEntry(id: string): CatalogEntry | null {
  return CATALOG[id] ?? null;
}

// Stripe Price ID — źródło prawdy ceny przy płatności (test/live wg env).
export function getPriceId(id: string): string | null {
  const entry = CATALOG[id];
  if (!entry) return null;
  return process.env[entry.priceEnv]?.trim() || null;
}

// Prywatny URL pliku w Vercel Blob — nigdy nie trafia do klienta, tylko
// serwerowa trasa /api/pobierz pobiera stąd bajty i streamuje je kupującemu.
export function getFileUrl(id: string): string | null {
  const entry = CATALOG[id];
  if (!entry) return null;
  return process.env[entry.fileEnv]?.trim() || null;
}
