import styles from "./page.module.css";
import EbookCard from "../components/Ebooks/EbookCard/EbookCard";
import { EBOOKS } from "../components/Ebooks/ebook-types";

export default function EbooksPage() {
  return (
    <div className={styles.ebooks}>
      <header className={styles.head}>
        <h1 className={styles.title}>Ebooki</h1>
        <p className={styles.subtitle}>Wiedza, którą zabierzesz ze sobą</p>
        <p className={styles.description}>
          Praktyczne poradniki o świadomej pielęgnacji — do przeczytania w swoim
          tempie, kiedy tylko chcesz. Z czasem pojawi się ich więcej.
        </p>
      </header>

      <div className={styles.list}>
        {EBOOKS.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </div>
  );
}
