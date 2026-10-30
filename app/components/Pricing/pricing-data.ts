// Cennik zabiegów Lumery. Źródło: odręczne notatki (podstawione 1:1).
// Pozycje oznaczone // TODO wymagają potwierdzenia nazwy/ceny.

export type PriceVariant = {
  label: string;
  price: string;
};

export type PriceItem = {
  name: string;
  /** Pojedyncza cena — gdy pozycja nie ma wariantów. */
  price?: string;
  /** Mały dopisek pod nazwą (np. „produkt dobierany indywidualnie"). */
  note?: string;
  /** Warianty (serie, pakiety, strefy) — zamiast pojedynczej ceny. */
  variants?: PriceVariant[];
};

export type PriceGroup = {
  id: string;
  title: string;
  /** Dopisek pod tytułem grupy (np. „cena za zabieg"). */
  subtitle?: string;
  items: PriceItem[];
  /** Przypis na dole grupy (np. informacja o rabacie). */
  footnote?: string;
};

/** Slug bez polskich znaków — do stabilnych id w linkach (?zabieg=…). */
export function slugifyPl(s: string): string {
  const map: Record<string, string> = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ż: "z",
    ź: "z",
  };
  return s
    .toLowerCase()
    .replace(/[ąćęłńóśżź]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Id zabiegu = grupa + slug nazwy (nazwa bywa powtórzona w różnych grupach). */
export function treatmentId(groupId: string, name: string): string {
  return `${groupId}-${slugifyPl(name)}`;
}

export const PRICING: PriceGroup[] = [
  {
    id: "depilacja-laserowa",
    title: "Depilacja laserowa",
    subtitle: "Cena za pojedynczy zabieg",
    items: [
      { name: "Twarz", price: "250 zł" },
      { name: "Wąsik", price: "150 zł" },
      { name: "Broda", price: "150 zł" },
      { name: "Bikini płytkie", price: "250 zł" },
      { name: "Bikini głębokie", price: "350 zł" },
      { name: "Pachy", price: "200 zł" },
      { name: "Nogi", price: "500 zł" },
      { name: "Uda", price: "320 zł" },
      { name: "Łydki", price: "320 zł" },
      { name: "Klatka piersiowa", price: "250 zł" },
      { name: "Plecy", price: "400 zł" },
      { name: "Brzuch", price: "250 zł" },
      { name: "Ramiona", price: "200 zł" },
    ],
    footnote: "Przy zakupie minimum 5 zabiegów — 25% rabatu.",
  },
  {
    id: "trychologia",
    title: "Trychologia",
    items: [
      { name: "Konsultacja trychologiczna z badaniem", price: "200 zł" },
      { name: "Oczyszczanie skóry głowy", price: "200 zł" },
      { name: "Infuzja na porost włosa", price: "200 zł" },
      { name: "Serum ALTS", price: "200 zł" }, // TODO potwierdzić nazwę
      { name: "Serum (nazwa do potwierdzenia)", price: "200 zł" }, // TODO nazwa
      {
        name: "Mezoterapia mikroigłowa",
        note: "Preparat dobierany indywidualnie (porost / przeciw wypadaniu)",
        price: "250–400 zł",
      },
      {
        name: "Mezoterapia Dr.Cyj Hair Filler", // TODO potwierdzić nazwę
        variants: [
          { label: "Pojedynczy zabieg", price: "600 zł" },
          { label: "Seria 4 zabiegów", price: "2100 zł" },
        ],
      },
      {
        name: "Tropokolagen", // TODO potwierdzić pełną nazwę
        variants: [
          { label: "Pojedynczy zabieg", price: "450 zł" },
          { label: "Seria 4 zabiegów", price: "1600 zł" },
        ],
      },
      {
        name: "Osocze na porost włosów",
        variants: [
          { label: "Pojedynczy zabieg", price: "500 zł" },
          { label: "Seria 4 zabiegów", price: "1700 zł" },
        ],
      },
    ],
  },
  {
    id: "twarz",
    title: "Zabiegi na twarz",
    items: [
      { name: "Konsultacja kosmetologiczna z analizą skóry", price: "100 zł" },
      { name: "Oczyszczanie wodorowe + infuzja tlenowa", price: "320 zł" },
      { name: "Oczyszczanie wodorowe", price: "250 zł" },
      { name: "Infuzja tlenowa", price: "240 zł" },
      {
        name: "Zabieg bankietowy",
        note: "Przed imprezą",
        price: "280 zł",
      },
      { name: "OxyGeneo", price: "300 zł" },
      { name: "Oczyszczanie wodorowe z Geneo", price: "380 zł" },
      {
        name: "Żelazko przeciwzmarszczkowe", // TODO: „żelazko" czy „igiełko"?
        variants: [
          { label: "Pojedynczy zabieg", price: "200 zł" },
          { label: "Seria 4 zabiegów", price: "700 zł" },
        ],
      },
      { name: "Masaż Kobido", price: "250 zł" },
      { name: "Peeling chemiczny", price: "250 zł" },
      { name: "Zabieg bankietowy KRX V-Tox", price: "350 zł" },
      { name: "Karboksyterapia bezigłowa", price: "250 zł" },
      {
        name: "Mezoterapia mikroigłowa",
        variants: [
          { label: "Twarz", price: "300 zł" },
          { label: "Twarz + dekolt", price: "350 zł" },
        ],
      },
    ],
    footnote: "Przy serii 4 zabiegów — 15% rabatu.",
  },
  {
    id: "cialo",
    title: "Zabiegi na ciało",
    items: [
      {
        name: "Slim — modelowanie ciała", // TODO potwierdzić nazwę
        variants: [
          { label: "Pojedynczy zabieg · 60 min", price: "250 zł" },
          { label: "5 zabiegów · 60 min", price: "888 zł" },
          { label: "10 zabiegów · 60 min", price: "1700 zł" },
        ],
      },
      {
        name: "Zabieg antycellulitowy",
        variants: [
          { label: "5 zabiegów · 30 min", price: "450 zł" },
          { label: "10 zabiegów · 30 min", price: "700 zł" },
          { label: "5 zabiegów · 40 min", price: "600 zł" },
          { label: "10 zabiegów · 40 min", price: "800 zł" },
        ],
      },
      {
        name: "Kriolipoliza",
        variants: [
          { label: "1 głowica", price: "400 zł" },
          { label: "2 głowice", price: "700 zł" },
          { label: "3 głowice", price: "1050 zł" },
          { label: "4 głowice", price: "1300 zł" },
          { label: "Podbródek", price: "250 zł" },
        ],
      },
      {
        name: "Fale elektromagnetyczne",
        variants: [
          { label: "Pojedynczy zabieg · 30 min", price: "150 zł" },
          { label: "5 zabiegów · 30 min", price: "600 zł" },
          { label: "10 zabiegów · 30 min", price: "888 zł" },
        ],
      },
    ],
  },
];

export type BookingEntry = { id: string; title: string; group: string };

/** Płaska lista zabiegów z cennika — źródło opcji w formularzu kontaktu. */
export const BOOKING_FROM_PRICING: BookingEntry[] = PRICING.flatMap((g) =>
  g.items.map((it) => ({
    id: treatmentId(g.id, it.name),
    title: it.name,
    group: g.title,
  })),
);
