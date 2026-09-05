import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://lumera-clinic.pl";

// Publiczne, indeksowalne trasy. Trasy transakcyjne (koszyk, płatność,
// pobieranie) świadomie pomijamy — są też zablokowane w robots.
const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/zabiegi", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ebooki", priority: 0.9, changeFrequency: "monthly" },
  { path: "/o-lumera", priority: 0.7, changeFrequency: "yearly" },
  { path: "/kontakt", priority: 0.8, changeFrequency: "yearly" },
  { path: "/regulamin", priority: 0.3, changeFrequency: "yearly" },
  { path: "/polityka-prywatnosci", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
