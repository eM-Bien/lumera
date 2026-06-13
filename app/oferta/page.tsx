import styles from "./page.module.css";
import OfferExplorer from "../components/OfferExplorer/OfferExplorer";

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <header className={styles.offerTitle}>
        <h1 className={styles.title}>Zabiegi i różności</h1>
        <p className={styles.subtitle}>Sprawdź co by pasowało do Ciebie</p>
        <p className={styles.description}>
          Tu jakieś info może że różne rzeczy są w różnych lokalizacjach i
          blablabla.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Pellentesque et efficitur ante. Suspendisse aliquam semper lorem nec
          iaculis. Duis fermentum neque in feugiat suscipit. Nullam rhoncus
          sagittis ultricies. Quisque at nibh vitae justo semper pellentesque.
          Proin placerat et lacus vel tempus.
        </p>
      </header>

      <OfferExplorer />
    </div>
  );
}
