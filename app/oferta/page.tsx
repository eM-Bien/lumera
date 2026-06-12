import styles from "./page.module.css";
import { WindSong } from "next/font/google";
import OfferExplorer from "../components/OfferExplorer/OfferExplorer";

const windsong = WindSong({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-windsong",
});

export default function OfferPage() {
  return (
    <div className={styles.offer}>
      <header className={styles.offerTitle}>
        <h1 className={styles.title}>Zabiegi i różności</h1>
        <p className={`${styles.description} ${windsong.className}`}>
          Sprawdź co by pasowało do Ciebie
        </p>
      </header>

      <OfferExplorer />
    </div>
  );
}
