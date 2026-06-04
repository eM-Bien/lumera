import styles from "./page.module.css";
import LumeraReveal from "./components/LumeraReveal/LumeraReveal";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.reveal}>
          <LumeraReveal
            tagline="Harmonia twarzy i ciała"
            background="/magic-forest.png"
            scrim={0.6}
          />
        </div>
        <div className={styles.vignette} />
      </main>
    </div>
  );
}
