export type Ebook = {
  id: string;
  title: string;
  tagline: string;
  cover: string;
  description: string;
  forWhom: string[];
  details: {
    format: string;
    pages: number;
    language: string;
  };
  price: number;
};

export const EBOOKS: Ebook[] = [
  {
    id: "ebook-1",
    cover: "/ebooks/poznaj-swoja-skore-ebook.webp",
    title: "Poznaj swoją skórę",
    tagline: "Przewodnik świadomej pielęgnacji",
    description:
      "Testujesz kolejne kosmetyki z drogerii w nadziei, że w końcu trafisz na ten właściwy, ale efektów wciąż brak? Ten e-book pomoże Ci zrozumieć, czego naprawdę potrzebuje Twoja skóra i przestać dobierać pielęgnację na oślep.",
    forWhom: [
      "Dla Ciebie, jeśli nie wiesz, jaki masz typ skóry",
      "Dla Ciebie, jeśli masz dość kupowania kolejnych kosmetyków metodą prób i błędów",
      "Dla Ciebie, jeśli Twoja kosmetyczka jest pełna produktów, ale nadal nie wiesz, co właściwie służy Twojej skórze",
    ],
    details: {
      format: "PDF",
      pages: 100,
      language: "polski",
    },
    price: 49,
  },
];

export function formatPrice(pln: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(pln);
}
