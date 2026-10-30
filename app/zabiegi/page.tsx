import type { Metadata } from "next";
import styles from "./page.module.css";
import RevealHeading from "../components/RevealHeading/RevealHeading";
import {
  DecorativeSubtitle,
  Description,
} from "../components/PageHeader/Typography";
import PriceList from "../components/Pricing/PriceList";
import CtaBand from "../components/CtaBand/CtaBand";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export const metadata: Metadata = {
  title: "Oferta zabiegów",
  description:
    "Zabiegi kosmetologiczne i trychologiczne w Lumerze — na twarz, ciało i skórę głowy. Sprawdź ofertę w Sierpcu i Andrespolu.",
  alternates: { canonical: "/zabiegi" },
};

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <header className={styles.header}>
        <RevealHeading
          as="h1"
          className={styles.title}
          text="Zabiegi"
          mode="load"
          delayMs={150}
        />
        <DecorativeSubtitle className={styles.subtitle}>
          Znajdź coś dla siebie
        </DecorativeSubtitle>
        <Description className={styles.desc}>
          Depilacja laserowa, trychologia oraz zabiegi na twarz i ciało —
          oczyszczanie, nawilżanie, odmładzanie i modelowanie. Pełny cennik
          znajdziesz poniżej.
        </Description>
      </header>

      <PriceList />

      <div className={styles.ctaWrap}>
        <CtaBand
          eyebrow="Nie wiesz na co się zdecydować?"
          title="Umów się na konsultację"
          text="Dobierzemy zabieg do Twoich potrzeb i skóry. Napisz lub zadzwoń — pomożemy wybrać to, co sprawdzi się najlepiej."
          buttonLabel="Skontaktuj się"
          href="/kontakt"
        />
      </div>

      <ScrollToTop />
    </div>
  );
}
