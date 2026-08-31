import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Umów wizytę w Lumerze — Sierpc i Andrespol. Napisz na kontakt@lumera-clinic.pl lub zadzwoń: +48 505 829 913.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
