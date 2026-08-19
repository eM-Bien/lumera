import styles from "./page.module.css";
import RevealHeading from "../components/RevealHeading/RevealHeading";
import {
  DecorativeSubtitle,
  Description,
} from "../components/PageHeader/Typography";
import EbookCard from "../components/Ebooks/EbookCard/EbookCard";
import { EBOOKS } from "../components/Ebooks/ebook-types";

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
          Wiedza, którą zabierzesz ze sobą
        </DecorativeSubtitle>
        <Description className={styles.desc}>
          Praktyczne poradniki o świadomej pielęgnacji — do przeczytania w swoim
          tempie, kiedy tylko chcesz. Z czasem pojawi się ich więcej.
        </Description>
      </header>

      <div className={styles.list}>
        {EBOOKS.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </div>
  );
}
