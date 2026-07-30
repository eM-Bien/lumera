import { type Location } from "./offer-types";

// Zabieg trychologiczny — model prostszy niż Offer:
// bez listy „efektów", za to z lokalizacjami do filtrowania.
export type TrychoTreatment = {
  id: string;
  title: string;
  description: string;
  locations: Location[];
};

// Lokalizacje ustawione domyślnie na obie — dostosuj do realnej dostępności.
export const TRYCHO_TREATMENTS: TrychoTreatment[] = [
  {
    id: "konsultacja-trychologiczna",
    title: "Konsultacja trychologiczna z badaniem skóry głowy",
    locations: ["Sierpc", "Łódź"],
    description:
      "Obejmuje szczegółowy wywiad zdrowotny, ocenę stanu włosów i skóry głowy oraz badanie trichoskopowe. Pozwala rozpoznać przyczyny problemów takich jak nadmierne wypadanie włosów, łupież, świąd, przetłuszczanie czy stany zapalne. Po konsultacji przygotowywany jest indywidualny plan terapii i pielęgnacji.",
  },
  {
    id: "leczenie-lysienia",
    title: "Leczenie łysienia",
    locations: ["Sierpc", "Łódź"],
    description:
      "Postępowanie dobierane jest indywidualnie w zależności od rodzaju łysienia (androgenowe, telogenowe, plackowate i inne). Terapia może obejmować zabiegi gabinetowe, preparaty trychologiczne, zalecenia pielęgnacyjne oraz współpracę z lekarzem w razie potrzeby. Celem jest ograniczenie wypadania włosów i pobudzenie ich odrostu.",
  },
  {
    id: "leczenie-azs-lupiezu",
    title: "Leczenie AZS, łupieżu i innych schorzeń skóry głowy",
    locations: ["Sierpc", "Łódź"],
    description:
      "Pomoc w terapii atopowego zapalenia skóry (AZS), łupieżu suchego i tłustego, łojotokowego zapalenia skóry, nadmiernego przetłuszczania, przesuszenia, świądu, łuszczycy skóry głowy oraz podrażnień. Terapia obejmuje odpowiednio dobrane preparaty, zabiegi i zalecenia pielęgnacyjne.",
  },
  {
    id: "leczenie-wszawicy",
    title: "Leczenie wszawicy",
    locations: ["Sierpc", "Łódź"],
    description:
      "Ocena stopnia nasilenia problemu, instruktaż prawidłowego postępowania, dobór preparatów oraz zalecenia dotyczące dezynfekcji otoczenia i profilaktyki nawrotów.",
  },
  {
    id: "infuzja-skora-glowy",
    title: "Infuzja na skórę głowy",
    locations: ["Sierpc", "Łódź"],
    description:
      "Nowoczesny zabieg polegający na wtłaczaniu substancji aktywnych w skórę głowy przy użyciu technologii infuzji. Składniki odżywcze, nawilżające i stymulujące cebulki włosów wspierają regenerację skóry, poprawiają kondycję włosów, ograniczają ich wypadanie i wspomagają wzrost. Zabieg jest komfortowy i nieinwazyjny.",
  },
];

// Wspólne dla całej sekcji trychologicznej.
export const TRYCHO_WSKAZANIA: string[] = [
  "Nadmierne wypadanie włosów",
  "Przerzedzenie włosów",
  "Łupież",
  "Świąd skóry głowy",
  "AZS i ŁZS",
  "Łuszczyca skóry głowy",
  "Nadmierne przetłuszczanie",
  "Suchość i podrażnienia",
  "Wszawica",
];

export const TRYCHO_PRZECIWWSKAZANIA =
  "Aktywne infekcje skóry głowy, gorączka, świeże rany, niektóre choroby dermatologiczne w fazie ostrej oraz przeciwwskazania indywidualne oceniane podczas konsultacji.";
