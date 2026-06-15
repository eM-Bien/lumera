// Dane i typ ebooka. Dodanie kolejnego = dopisanie obiektu do EBOOKS.

export type Ebook = {
  id: string;
  title: string;
  tagline: string; // jedno zdanie — co daje
  cover: string; // ścieżka do grafiki w /public
  description: string;
  forWhom: string[]; // 2–4 punkty „dla kogo"
  details: {
    format: string; // np. "PDF"
    pages: number;
    language: string; // np. "polski"
  };
  price: number; // w złotych, np. 49 albo 49.99
};

export const EBOOKS: Ebook[] = [
  {
    id: "ebook-1",
    cover: "/ebooks/poznaj-swoja-skore-ebook.png",
    title: "Tytuł ebooka",
    tagline: "Krótkie zdanie, które mówi, co z tego będziesz mieć.",
    description:
      "Tu opis ebooka — o czym jest, co znajdziesz w środku i dlaczego warto. Kilka zdań, które rozwijają tagline i budują wartość.",
    forWhom: [
      "Dla osób, które chcą zadbać o pielęgnację świadomie",
      "Dla początkujących i tych, którzy chcą uporządkować wiedzę",
      "Dla każdego, kto woli konkrety zamiast ogólników",
    ],
    details: {
      format: "PDF",
      pages: 48,
      language: "polski",
    },
    price: 49,
  },
];

// formatuje cenę po polsku: 49 -> "49,00 zł"
export function formatPrice(pln: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(pln);
}
