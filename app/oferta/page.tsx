import styles from "./page.module.css";
import { Parisienne, Cinzel, Playfair_Display } from "next/font/google";
import OfferExplorer from "../components/OfferExplorer/OfferExplorer";

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-parisienne",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <header className={styles.offerTitle}>
        <h1 className={`${styles.title} ${playfair.className}`}>
          Zabiegi i różności
        </h1>
        <p className={`${styles.subtitle} ${parisienne.className}`}>
          Sprawdź co by pasowało do Ciebie
        </p>
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
