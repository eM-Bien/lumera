import styles from "./page.module.css";
import LumeraReveal from "./components/LumeraReveal/LumeraReveal";
import Nav from "./components/Nav/Nav";
import InkBackground from "./components/InkBackground/InkBackground";
import InkBlobFilter from "./components/InkBlobFilter/InkBlobFilter";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Nav />
        <div className={styles.reveal}>
          <LumeraReveal
            tagline="Harmonia twarzy i ciała"
            background="/magic-forest.png"
            scrim={0.6}
          />
        </div>
        <InkBackground
          zIndex={2} /* nad zdjęciem, pod nawigacją */
          blendMode="screen" /* rozjaśnia las jak smugi światła */
          ink={[0.95, 0.82, 0.55]} /* ciepłe, jasne złoto */
          intensity={0.8}
          dissipation={1.0}
        />
        <InkBlobFilter />
        <div className={styles.vignette} />
      </main>
    </div>
  );
}
