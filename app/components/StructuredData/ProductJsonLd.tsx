import type { Ebook } from "../Ebooks/ebook-types";

// Dane strukturalne produktu (ebook) — szansa na rich result z ceną w Google.
const BASE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://lumera-clinic.pl";

type ProductJsonLdProps = {
  ebook: Ebook;
};

export default function ProductJsonLd({ ebook }: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ebook.title,
    description: ebook.description,
    image: `${BASE}${ebook.cover}`,
    brand: { "@type": "Brand", name: "Lumera" },
    offers: {
      "@type": "Offer",
      price: ebook.price,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: `${BASE}/ebooki`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
