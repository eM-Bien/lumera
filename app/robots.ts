import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://lumera-clinic.pl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trasy transakcyjne i techniczne nie powinny trafiać do indeksu.
      disallow: ["/koszyk", "/platnosc", "/pobierz", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
