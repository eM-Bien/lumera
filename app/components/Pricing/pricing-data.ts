// Cennik zabiegów Lumery. Źródło: Cennik_Lumera.pdf (aktualizacja 2026-11).

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
    id: "twarz",
    title: "Zabiegi na twarz",
    items: [
      { name: "Konsultacja kosmetologiczna z analizą skóry", price: "100 zł" },
      { name: "Oczyszczanie i infuzja tlenowa", price: "330 zł" },
      { name: "Oczyszczanie wodorowe", price: "250 zł" },
      { name: "Infuzja tlenowa", price: "200 zł" },
      { name: "OxyGeneo", price: "300 zł" },
      { name: "Oczyszczanie wodorowe z Geneo", price: "380 zł" },
      {
        name: "Zabieg bankietowy",
        note: "Produkt dobierany indywidualnie",
        price: "280 zł",
      },
      { name: "Masaż Kobido", price: "250 zł" },
      { name: "Peelingi chemiczne", price: "250 zł" },
      { name: "Zabieg bankietowy KRX V-Tox", price: "350 zł" },
      { name: "Karboksyterapia bezigłowa", price: "250 zł" },
      {
        name: "Lumera Glow — zabieg rozświetlający",
        note: "Karboksyterapia bezigłowa + maska mocno liftingująca",
        price: "500 zł",
      },
      {
        name: "Peeling węglowy",
        variants: [
          { label: "Pojedynczy zabieg", price: "200 zł" },
          { label: "Seria 5 zabiegów", price: "750 zł" },
        ],
      },
      { name: "Radiofrekwencja mikroigłowa — twarz i szyja", price: "450 zł" },
      {
        name: "Mezoterapia mikroigłowa",
        variants: [
          { label: "Twarz i szyja", price: "300 zł" },
          { label: "Twarz, szyja i dekolt", price: "350 zł" },
        ],
      },
      {
        name: "Żelazko przeciwzmarszczkowe",
        variants: [
          { label: "Pojedynczy zabieg", price: "200 zł" },
          { label: "Seria 4 zabiegów", price: "700 zł" },
        ],
      },
      { name: "Usuwanie makijażu permanentnego", price: "300 zł" },
      { name: "Zabieg na przebarwienia", price: "250 zł" },
      {
        name: "Usuwanie tatuażu",
        note: "Cena zależy od wielkości",
        price: "od 200 zł",
      },
    ],
    footnote: "Przy zakupie serii minimum 3 zabiegów na twarz — 15% rabatu.",
  },
  {
    id: "cialo",
    title: "Modelowanie sylwetki",
    items: [
      {
        name: "Icoone",
        variants: [
          { label: "Pojedynczy zabieg · 60 min", price: "250 zł" },
          { label: "Pakiet 5 zabiegów · 60 min", price: "999 zł" },
          { label: "Pakiet 10 zabiegów · 60 min", price: "1700 zł" },
        ],
      },
      {
        name: "Żelazko antycellulitowe",
        variants: [
          { label: "Pakiet 5 zabiegów · 30 min", price: "450 zł" },
          { label: "Pakiet 10 zabiegów · 30 min", price: "700 zł" },
          { label: "Pakiet 5 zabiegów · 40 min", price: "600 zł" },
          { label: "Pakiet 10 zabiegów · 40 min", price: "800 zł" },
        ],
      },
      {
        name: "Kriolipoliza",
        note: "Wymrażanie tkanki tłuszczowej",
        variants: [
          { label: "1 przyłożenie głowicy", price: "400 zł" },
          { label: "2 przyłożenia głowicy", price: "700 zł" },
          { label: "3 przyłożenia głowicy", price: "1050 zł" },
          { label: "4 przyłożenia głowicy", price: "1300 zł" },
          { label: "Podbródek", price: "250 zł" },
        ],
      },
      {
        name: "Fale elektromagnetyczne",
        variants: [
          { label: "Pojedynczy zabieg · 30 min", price: "150 zł" },
          { label: "5 zabiegów", price: "600 zł" },
          { label: "10 zabiegów", price: "899 zł" },
        ],
      },
      { name: "Radiofrekwencja mikroigłowa — ciało", price: "600 zł" },
    ],
    footnote: "Przy zakupie serii minimum 3 zabiegów na ciało — 15% rabatu.",
  },
  {
    id: "trychologia",
    title: "Trychologia",
    items: [
      { name: "Konsultacja trychologiczna z badaniem", price: "200 zł" },
      { name: "Oczyszczanie skóry głowy", price: "200 zł" },
      { name: "Infuzja tlenowa na porost włosów", price: "200 zł" },
      { name: "Zabieg z serum — wariant I", price: "200 zł" },
      { name: "Zabieg z serum — wariant II", price: "200 zł" },
      {
        name: "Mezoterapia mikroigłowa skóry głowy",
        note: "Na porost włosów i przy problemach skóry głowy; dobór indywidualny",
        price: "250–400 zł",
      },
      {
        name: "Mezoterapia igłowa skóry głowy",
        variants: [
          { label: "Biotyna", price: "350 zł" },
          { label: "Hairmax", price: "350 zł" },
        ],
      },
      {
        name: "Dr. CYJ",
        variants: [
          { label: "Pojedynczy zabieg", price: "600 zł" },
          { label: "Seria 4 zabiegów", price: "2100 zł" },
        ],
      },
      { name: "Tropokolagen Neck", price: "500 zł" },
      { name: "Osocze skóry głowy", price: "400 zł" },
    ],
  },
  {
    id: "medycyna-estetyczna",
    title: "Medycyna estetyczna",
    items: [
      { name: "Mezoterapia igłowa Neauvia", price: "650 zł" },
      {
        name: "Mezoterapia igłowa",
        note: "CytoCare / NCTF / Amha Hydro / Skin Rejuvenation",
        price: "350 zł",
      },
      { name: "Mezoterapia okolicy oka", price: "350 zł" },
      { name: "Stymulatory tkankowe — okolica oka", price: "500–600 zł" },
      { name: "Tropokolagen Tissue / Muscle / Matrix", price: "500 zł" },
      { name: "Stymulatory tkankowe", price: "600–1200 zł" },
      {
        name: "Osocze i fibryna",
        variants: [
          { label: "Osocze — twarz", price: "500 zł" },
          { label: "Osocze + fibryna", price: "700 zł" },
          { label: "Fibryna", price: "500 zł" },
        ],
      },
      { name: "Modelowanie ust", price: "600 zł" },
      { name: "Skin booster", price: "700 zł" },
      { name: "Hialuronidaza", price: "400 zł" },
      {
        name: "BTX",
        variants: [
          { label: "1 strefa", price: "350 zł" },
          { label: "3 strefy", price: "800 zł" },
          { label: "Bruksizm", price: "900 zł" },
          { label: "Nadpotliwość pach", price: "800 zł" },
          { label: "Full face", price: "1200 zł" },
          { label: "Lip flip", price: "300 zł" },
          { label: "Lwie zmarszczki", price: "350 zł" },
          { label: "Uniesienie kącików ust", price: "300 zł" },
        ],
      },
      { name: "Lipoliza iniekcyjna", note: "10 ml", price: "400 zł" },
      {
        name: "Wypełnianie zmarszczek kwasem hialuronowym",
        note: "1 ml",
        price: "500 zł",
      },
      {
        name: "Volumetria twarzy — broda, żuchwa, policzki",
        note: "1 ml",
        price: "600 zł",
      },
      { name: "Wypełnianie doliny łez", price: "800 zł" },
      {
        name: "Wypełnianie i modelowanie twarzy wypełniaczem autologicznym",
        note: "1 ml",
        price: "300 zł",
      },
    ],
  },
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
      { name: "Całe nogi", price: "500 zł" },
      { name: "Uda", price: "300 zł" },
      { name: "Łydki", price: "300 zł" },
      { name: "Klatka piersiowa", price: "350 zł" },
      { name: "Plecy", price: "400 zł" },
      { name: "Brzuch", price: "250 zł" },
      { name: "Ramiona", price: "200 zł" },
    ],
    footnote: "Przy zakupie minimum 5 zabiegów — 25% rabatu.",
  },
  {
    id: "drobne-uslugi",
    title: "Drobne usługi",
    items: [
      { name: "Wosk — wąsik", price: "30 zł" },
      { name: "Wosk — twarz", price: "50 zł" },
      { name: "Henna i regulacja brwi", price: "50 zł" },
      { name: "Henna rzęs", price: "40 zł" },
      { name: "Henna brwi z regulacją + henna rzęs", price: "70 zł" },
      {
        name: "Elektrokoagulacja — usuwanie znamion / włókniaków",
        note: "20 min",
        price: "250 zł",
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
