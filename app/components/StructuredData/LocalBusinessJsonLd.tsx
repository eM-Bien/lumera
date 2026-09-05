// Dane strukturalne dla Google (schema.org) — lokalny salon.
// Renderowane w root layoutcie, więc obecne na każdej stronie.
const BASE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://lumera-clinic.pl";

const data = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "@id": `${BASE}/#business`,
  name: "Lumera",
  legalName: "Lumera Harmonia skóry głowy, twarzy i ciała Monika Rożniak",
  description:
    "Studio kosmetologii i trychologii — świadoma pielęgnacja skóry głowy, twarzy i ciała.",
  url: BASE,
  image: `${BASE}/hero-lumera-poster.jpg`,
  logo: `${BASE}/moon.svg`,
  telephone: "+48505829913",
  email: "kontakt@lumera-clinic.pl",
  taxID: "7761679983",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Andersa 11",
    postalCode: "09-200",
    addressLocality: "Sierpc",
    addressCountry: "PL",
  },
  areaServed: [
    { "@type": "City", name: "Sierpc" },
    { "@type": "City", name: "Andrespol" },
  ],
};

export default function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
