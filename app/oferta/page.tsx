import styles from "./page.module.css";
import PageHeader from "../components/PageHeader/PageHeader";
import OfferTabs from "../components/OfferTabs/OfferTabs";
import OfferCta from "../components/OfferCta/OfferCta";

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <PageHeader
        title="Zabiegi"
        subtitle="Sprawdź, co pasuje do Ciebie"
        description="Zabiegi na twarz i ciało — od oczyszczania, przez nawilżenie, po odmładzanie i modelowanie. Wyszukaj po nazwie lub zawęź po lokalizacji, żeby szybciej znaleźć coś dla siebie."
      />

      <OfferTabs />

      <OfferCta />
    </div>
  );
}
