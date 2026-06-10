"use client";

import styles from "./page.module.css";
import LumeraReveal from "./components/LumeraReveal/LumeraReveal";
import Nav from "./components/Nav/Nav";
import InkBackground from "./components/InkBackground/InkBackground";
import InkBlobFilter from "./components/InkBlobFilter/InkBlobFilter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ExitTransition from "./components/ExitTransition/ExitTransition";

const EXIT_MS = 850;

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => router.push(href), EXIT_MS);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Nav show={revealed} onNavigate={handleNavigate} />
        <div className={styles.reveal}>
          <LumeraReveal
            tagline="Harmonia twarzy i ciała"
            background="/magic-forest.png"
            scrim={0.6}
            onComplete={() => setRevealed(true)}
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
        <ExitTransition exiting={exiting} />
      </main>
    </div>
  );
}
