import styles from "./page.module.css";
import PageHeader from "../components/PageHeader/PageHeader";
import OfferTabs from "../components/OfferTabs/OfferTabs";
import CtaBand from "../components/CtaBand/CtaBand";

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <PageHeader
        title="Zabiegi"
        subtitle="Sprawdź, co pasuje do Ciebie"
        description="Zabiegi na twarz i ciało — od oczyszczania, przez nawilżenie, po odmładzanie i modelowanie. Wyszukaj po nazwie lub zawęź po lokalizacji, żeby szybciej znaleźć coś dla siebie."
      />

      <OfferTabs />

      <CtaBand
        eyebrow="Nie wiesz na co się zdecydować?"
        title="Umów się na konsultację"
        text="Dobierzemy zabieg do Twoich potrzeb i skóry. Napisz lub zadzwoń — pomożemy wybrać to, co sprawdzi się najlepiej."
        buttonLabel="Skontaktuj się"
        href="/kontakt"
      />
    </div>
  );
}
