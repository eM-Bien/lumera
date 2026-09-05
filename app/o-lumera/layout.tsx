import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Lumerze",
  description:
    "Poznaj Lumerę — filozofię świadomej pielęgnacji skóry głowy, twarzy i ciała oraz wartości, którymi się kierujemy.",
  alternates: { canonical: "/o-lumera" },
};

export default function OLumeraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
