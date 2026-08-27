// lib/server-catalog.ts — ŹRÓDŁO PRAWDY CEN i PLIKÓW (po stronie serwera).
// Klient przysyła tylko id produktów; kwotę i plik ustalamy TUTAJ.
// Nigdy nie ufaj cenie z localStorage/koszyka — można ją podmienić.
// Kwoty w GROSZACH (Stripe = najmniejsza jednostka). URL pliku trzymamy
// w zmiennej środowiskowej (fileEnv), żeby nie commitować go do repo.

export type CatalogEntry = {
  title: string;
  amount: number; // brutto w groszach, np. 49,00 zł = 4900
  fileName: string; // nazwa pliku widoczna przy pobieraniu (ASCII)
  fileEnv: string; // nazwa zmiennej env z prywatnym URL-em pliku (Vercel Blob)
};

export const CATALOG: Record<string, CatalogEntry> = {
  "ebook-1": {
    title: "Poznaj swoją skórę",
    amount: 4900,
    fileName: "Poznaj-swoja-skore.pdf",
    fileEnv: "EBOOK_1_FILE_URL",
  },
};

export function getEntry(id: string): CatalogEntry | null {
  return CATALOG[id] ?? null;
}

// Prywatny URL pliku w Vercel Blob — nigdy nie trafia do klienta, tylko
// serwerowa trasa /api/pobierz pobiera stąd bajty i streamuje je kupującemu.
export function getFileUrl(id: string): string | null {
  const entry = CATALOG[id];
  if (!entry) return null;
  return process.env[entry.fileEnv]?.trim() || null;
}
