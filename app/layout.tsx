import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Parisienne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";
import TransitionProvider from "./transition/TransitionProvider";
import LightsBackground from "./components/LightsBackground";
import TransitionOverlay from "./transition/TransitionOverlay";
import Nav from "./components/Nav/Nav";
import { CartProvider } from "./components/Ebooks/Cart/CartContext";
import CartDrawer from "./components/Ebooks/Cart/CartDrawer";
import CursorInk from "./components/CursorInk/CursorInk";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-header",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-basic",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-decoration",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://lumera-clinic.pl",
  ),
  title: {
    default: "Lumera — Harmonia skóry głowy, twarzy i ciała 🤍",
    template: "%s — Lumera",
  },
  description:
    "Lumera — studio kosmetologii i trychologii. Świadoma pielęgnacja skóry głowy, twarzy i ciała w Sierpcu i Andrespolu. Zabiegi, konsultacje i ebooki o pielęgnacji.",
  keywords: [
    "Lumera",
    "kosmetologia",
    "trychologia",
    "pielęgnacja skóry",
    "skóra głowy",
    "zabiegi na twarz",
    "zabiegi na ciało",
    "Sierpc",
    "Andrespol",
    "ebooki o pielęgnacji",
  ],
  authors: [{ name: "Lumera" }],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Lumera",
    title: "Lumera — Harmonia skóry głowy, twarzy i ciała",
    description:
      "Studio kosmetologii i trychologii. Świadoma pielęgnacja skóry głowy, twarzy i ciała — zabiegi, konsultacje i ebooki.",
    images: [
      {
        url: "/hero-lumera-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Lumera — harmonia skóry głowy, twarzy i ciała",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumera — Harmonia skóry głowy, twarzy i ciała",
    description:
      "Studio kosmetologii i trychologii. Świadoma pielęgnacja skóry głowy, twarzy i ciała.",
    images: ["/hero-lumera-poster.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${parisienne.variable} ${montserrat.variable} ${playfair.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CartProvider>
          <div className="appWrapper">
            <TransitionProvider>
              <LightsBackground
                style={{ position: "fixed", zIndex: 45, pointerEvents: "none" }}
                burstFactor={2.5}
              />{" "}
              <Nav />
              <CursorInk />
              <TransitionOverlay />
              {children}
              <CartDrawer />
            </TransitionProvider>
            <SmoothScroll />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
