import { lowercase } from "./../../../node_modules/zod/src/v4/core/regexes";
export type Category = "Twarz" | "Ciało" | "Dłonie i stopy" | "Relaks";

export const CATEGORIES: Category[] = [
  "Twarz",
  "Ciało",
  "Dłonie i stopy",
  "Relaks",
];

export type Location = "Sierpc" | "Łódź";
export const LOCATIONS: Location[] = ["Sierpc", "Łódź"];

export type Offer = {
  id: string;
  title: string;
  category: Category;
  locations: Location[];
  image?: string; // ścieżka w /public; brak = placeholder gradientowy
  description: string;
};

// Dane startowe — podmień na realną ofertę i zdjęcia.
export const OFFERS: Offer[] = [
  {
    id: "rytual-twarzy",
    title: "Rytuał odmładzający twarzy",
    category: "Twarz",
    locations: ["Sierpc", "Łódź"],
    image: "/oferta/eg-1.png",
    description:
      "Wieloetapowy zabieg z masażem, peelingiem enzymatycznym i maską dopasowaną do potrzeb skóry. Wygładza, rozświetla i przywraca jędrność.",
  },
  {
    id: "modelowanie-ciala",
    title: "Modelowanie sylwetki",
    category: "Ciało",
    locations: ["Sierpc"],
    image: "/oferta/eg-2.jpg",
    description:
      "Intensywny masaż połączony z aktywnymi wyciągami roślinnymi. Ujędrnia skórę, poprawia jej napięcie i wspiera mikrokrążenie.",
  },
  {
    id: "manicure-spa",
    title: "Manicure SPA",
    category: "Dłonie i stopy",
    locations: ["Łódź"],
    image: "/oferta/eg-1.png",
    description:
      "Pielęgnacja dłoni z peelingiem, kąpielą ziołową i odżywczą maską parafinową. Skóra staje się gładka i nawilżona.",
  },
  {
    id: "masaz-relaksacyjny",
    title: "Masaż relaksacyjny",
    category: "Relaks",
    locations: ["Sierpc", "Łódź"],
    image: "/oferta/eg-2.jpg",
    description:
      "Spokojny rytuał z ciepłymi olejkami, prowadzony w rytmie oddechu. Rozluźnia napięcia i wycisza po długim dniu.",
  },
  {
    id: "oczyszczanie-twarzy",
    title: "Głębokie oczyszczanie",
    category: "Twarz",
    locations: ["Sierpc"],
    image: "/oferta/eg-2.jpg",
    description:
      "Zabieg dla skóry mieszanej i tłustej: oczyszczanie, regulacja sebum i kojąca maska. Cera oddycha i wygląda świeżo.",
  },
  {
    id: "peeling-ciala",
    title: "Peeling i odżywienie ciała",
    category: "Ciało",
    locations: ["Sierpc", "Łódź"],
    image: "/oferta/eg-1.png",
    description:
      "Złuszczanie martwego naskórka połączone z odżywczym masłem do ciała. Skóra zostaje aksamitna i wygładzona.",
  },
];

// normalizacja pod wyszukiwanie: małe litery, bez polskich znaków
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
