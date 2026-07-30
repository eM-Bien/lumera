import styles from "./page.module.css";
import PageHeader from "../components/PageHeader/PageHeader";
import EbookCard from "../components/Ebooks/EbookCard/EbookCard";
import { EBOOKS } from "../components/Ebooks/ebook-types";

export default function EbooksPage() {
  return (
    <div className={styles.ebooks}>
      <PageHeader
        title="Ebooki"
        subtitle="Wiedza, którą zabierzesz ze sobą"
        description="Praktyczne poradniki o świadomej pielęgnacji — do przeczytania w swoim tempie, kiedy tylko chcesz. Z czasem pojawi się ich więcej."
      />

      <div className={styles.list}>
        {EBOOKS.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </div>
  );
}
