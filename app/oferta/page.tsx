import styles from "./page.module.css";
import RevealHeading from "../components/RevealHeading/RevealHeading";
import {
  DecorativeSubtitle,
  Description,
} from "../components/PageHeader/Typography";
import OfferTabs from "../components/OfferTabs/OfferTabs";
import CtaBand from "../components/CtaBand/CtaBand";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

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
          Zabiegi na twarz, ciało i skórę głowy — oczyszczanie, nawilżanie,
          odmładzanie, modelowanie. Wyszukaj po nazwie lub zawęź po lokalizacji,
          żeby łatwiej znaleźć coś dla siebie.
        </Description>
      </header>

      <OfferTabs />

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
