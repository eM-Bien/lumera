export type Category = "Twarz" | "Ciało";

export type Location = "Sierpc" | "Andrespol";
export const LOCATIONS: Location[] = ["Sierpc", "Andrespol"];

export type Offer = {
  id: string;
  title: string;
  category: Category;
  locations: Location[];
  image?: string;
  description: string;
  effects: string[];
  price: string;
};

export const OFFERS: Offer[] = [
  {
    id: "oczyszczanie-wodorowe",
    title: "Oczyszczanie wodorowe",
    price: "500 zł",
    category: "Twarz",
    locations: ["Sierpc", "Andrespol"],
    image: "/offer/wodorowe.jpg",
    description:
      "Zaawansowany zabieg, który usuwa nadmiar sebum i zanieczyszczenia oraz neutralizuje wolne rodniki odpowiedzialne za przedwczesne starzenie skóry. Doskonały dla cery tłustej, mieszanej i problematycznej, a także dla każdego, kto chce przywrócić skórze świeżość i naturalny blask.",
    effects: [
      "Dokładnie oczyszczona skóra",
      "Zmniejszenie ilości zaskórników",
      "Odświeżenie i rozświetlenie cery",
      "Wygładzenie struktury skóry",
      "Poprawa kondycji i kolorytu",
    ],
  },
  {
    id: "infuzja-tlenowa",
    title: "Infuzja tlenowa",
    price: "500 zł",
    category: "Twarz",
    locations: ["Sierpc", "Andrespol"],
    image: "/offer/infuzja.jpg",
    description:
      "Zabieg wykorzystujący czysty tlen pod ciśnieniem do wtłaczania składników aktywnych w głąb skóry. Zapewnia natychmiastowe odżywienie i regenerację — bez bólu i okresu rekonwalescencji. Idealny dla zmęczonej, odwodnionej i pozbawionej blasku cery.",
    effects: [
      "Intensywne nawilżenie",
      "Poprawa napięcia i elastyczności skóry",
      "Ukojenie i regeneracja",
      "Rozświetlenie cery",
      "Efekt zdrowej, promiennej skóry",
    ],
  },
  {
    id: "oczyszczanie-infuzja",
    title: "Oczyszczanie wodorowe + infuzja tlenowa",
    price: "500 zł",
    category: "Twarz",
    locations: ["Sierpc", "Andrespol"],
    image: "/offer/oczyszczanie-infuzja.webp",
    description:
      "Połączenie dwóch zabiegów, które kompleksowo odpowiadają na potrzeby skóry. Najpierw dokładne oczyszczenie z zanieczyszczeń i wolnych rodników, a następnie intensywne nawilżenie, odżywienie i regeneracja dzięki infuzji tlenowej.",
    effects: [
      "Głęboko oczyszczona skóra",
      "Intensywne nawilżenie i odżywienie",
      "Redukcja oznak zmęczenia",
      "Wygładzenie i poprawa struktury skóry",
      "Natychmiastowy efekt świeżej, promiennej cery",
    ],
  },
  {
    id: "zelazko-twarz",
    title: "Żelazko przeciwzmarszczkowe — twarz",
    price: "500 zł",
    category: "Twarz",
    locations: ["Sierpc", "Andrespol"],
    image: "/offer/zelazko-twarz.webp",
    description:
      "Zabieg z wykorzystaniem żelazka kosmetycznego, który wspomaga przenikanie substancji aktywnych, pobudza mikrokrążenie i stymuluje skórę do regeneracji. Skutecznie spowalnia pierwsze oznaki starzenia i przywraca wypoczęty wygląd.",
    effects: [
      "Wygładzenie drobnych zmarszczek",
      "Poprawa napięcia skóry",
      "Zwiększenie elastyczności",
      "Lepsze odżywienie tkanek",
      "Odmłodzony i wypoczęty wygląd cery",
    ],
  },
  {
    id: "zelazko-cialo",
    title: "Żelazko antycellulitowe — ciało",
    price: "500 zł",
    category: "Ciało",
    locations: ["Sierpc", "Andrespol"],
    image: "/offer/zelazko-cialo.webp",
    description:
      "Zabieg z wykorzystaniem żelazka kosmetycznego, który poprawia mikrokrążenie, wspomaga metabolizm komórkowy i zwiększa skuteczność działania preparatów antycellulitowych. Pomaga w walce z cellulitem i utratą jędrności.",
    effects: [
      "Poprawa jędrności i napięcia skóry",
      "Zmniejszenie widoczności cellulitu",
      "Wygładzenie nierówności",
      "Poprawa mikrokrążenia",
      "Bardziej zadbany i estetyczny wygląd skóry",
    ],
  },
];

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
