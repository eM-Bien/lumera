import type { NextConfig } from "next";

// Nagłówki bezpieczeństwa dla całej strony.
//
// CSP celowo ogranicza się do dyrektyw, które NIE wymagają nonce'ów
// (frame-ancestors / base-uri / form-action / object-src). Pełne script-src
// i style-src wymagałyby proxy.ts, nonce'ów i renderowania dynamicznego, a
// komponenty używają stylów inline (style={{...}}) — dorzucenie ich tutaj
// wywróciłoby stronę. To jest świadomie wybrany, bezpieczny podzbiór.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

// Token pobierania jedzie w query stringu, więc na tych trasach ucinamy
// referrera do zera — żaden zasób zewnętrzny (np. Google Fonts) nie dostanie
// nawet origin-u strony z linkiem.
const noReferrer = [{ key: "Referrer-Policy", value: "no-referrer" }];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Późniejszy wpis nadpisuje ten sam klucz z wpisu wcześniejszego.
      { source: "/pobierz", headers: noReferrer },
      { source: "/api/pobierz", headers: noReferrer },
    ];
  },
  async redirects() {
    // Strona zabiegów zmieniła adres z /oferta na /zabiegi.
    return [{ source: "/oferta", destination: "/zabiegi", permanent: true }];
  },
};

export default nextConfig;
