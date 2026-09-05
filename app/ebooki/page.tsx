import type { Metadata } from "next";
import styles from "./page.module.css";
import RevealHeading from "../components/RevealHeading/RevealHeading";
import {
  DecorativeSubtitle,
  Description,
} from "../components/PageHeader/Typography";
import EbookCard from "../components/Ebooks/EbookCard/EbookCard";
import { EBOOKS } from "../components/Ebooks/ebook-types";
import ProductJsonLd from "../components/StructuredData/ProductJsonLd";

export const metadata: Metadata = {
  title: "Ebooki",
  description:
    "Ebooki Lumery o świadomej pielęgnacji skóry — praktyczna wiedza, która z Tobą zostanie.",
  alternates: { canonical: "/ebooki" },
};

export default function EbooksPage() {
  return (
    <div className={styles.ebooks}>
      <header className={styles.header}>
        <RevealHeading
          as="h1"
          className={styles.title}
          text="Ebooki"
          mode="load"
          delayMs={150}
        />
        <DecorativeSubtitle className={styles.subtitle}>
          Wiedza, która z Tobą zostanie
        </DecorativeSubtitle>
        <Description className={styles.desc}>
          Rzetelna wiedza i praktyczne wskazówki, dzięki którym łatwiej
          zrozumiesz swoją skórę i wybierzesz to, czego naprawdę potrzebuje.
          Zaglądaj tu czasem - pojawi się ich więcej.
        </Description>
      </header>

      <div className={styles.list}>
        {EBOOKS.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>

      {EBOOKS.map((ebook) => (
        <ProductJsonLd key={ebook.id} ebook={ebook} />
      ))}
    </div>
  );
}
