import styles from "./page.module.css";
import OfferTabs from "../components/OfferTabs/OfferTabs";

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <header className={styles.offerTitle}>
        <h1 className={styles.title}>Zabiegi</h1>
        <p className={styles.subtitle}>Sprawdź, co pasuje do Ciebie</p>
        <p className={styles.description}>
          Zabiegi na twarz i ciało — od oczyszczania, przez nawilżenie, po
          odmładzanie i modelowanie. Wybierz kategorię lub lokalizację, żeby
          szybciej znaleźć coś dla siebie.
        </p>
      </header>

      <OfferTabs />
    </div>
  );
}
