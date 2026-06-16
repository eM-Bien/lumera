// lib/server-catalog.ts — ŹRÓDŁO PRAWDY CEN (po stronie serwera).
// Klient przysyła tylko id produktów; kwotę liczymy TUTAJ.
// Nigdy nie ufaj cenie z localStorage/koszyka — można ją podmienić.
// Docelowo: pobierać z bazy. Kwoty w GROSZACH (Stripe = najmniejsza jednostka).

export type CatalogEntry = {
  title: string;
  amount: number; // brutto w groszach, np. 49,00 zł = 4900
};

export const CATALOG: Record<string, CatalogEntry> = {
  "ebook-1": { title: "Poznaj swoją skórę", amount: 4900 },
};

export function getEntry(id: string): CatalogEntry | null {
  return CATALOG[id] ?? null;
}
