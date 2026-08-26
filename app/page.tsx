"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import LumeraReveal from "./components/LumeraReveal/LumeraReveal";
import InkBackground from "./components/InkBackground/InkBackground";
import InkBlobFilter from "./components/InkBlobFilter/InkBlobFilter";
import HomeAbout from "./components/HomeAbout/HomeAbout";
import { useTransitionPhase } from "./transition/TransitionProvider";

const INTRO_KEY = "lumera_intro_seen";

export default function Home() {
  const [skipIntro, setSkipIntro] = useState<boolean | null>(null);
  const [desktop, setDesktop] = useState(false);
  // WebGL montujemy dopiero po zakończeniu przejścia — kompilacja shaderów
  // to duży, jednorazowy koszt na wątku głównym, który zacinał animację.
  // Zatrzask: gdy raz dojdziemy do „idle", zostaje zamontowany (bez odmontowań
  // przy wychodzeniu ze strony, gdzie faza wraca do „exiting").
  const phase = useTransitionPhase();
  const [inkReady, setInkReady] = useState(false);
  useEffect(() => {
    if (phase === "idle") setInkReady(true);
  }, [phase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkipIntro(sessionStorage.getItem(INTRO_KEY) === "true");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(INTRO_KEY, "true");
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.reveal}>
          {skipIntro !== null && (
            <LumeraReveal
              tagline="Harmonia skóry głowy, twarzy i ciała"
              video="/hero-lumera.mp4"
              poster="/hero-lumera-poster.jpg"
              scrim={0.6}
              skipIntro={skipIntro}
              onComplete={handleComplete}
              parallax
            />
          )}
        </div>
        {desktop && inkReady && (
          <InkBackground
            zIndex={4} /* nad hero i sekcją „Odkryj" (z-index:3), pod nawigacją (50) */
            blendMode="screen" /* rozjaśnia las jak smugi światła */
            ink={[0.95, 0.82, 0.55]} /* ciepłe, jasne złoto */
            intensity={0.8}
            dissipation={1.0}
          />
        )}
        <InkBlobFilter />
      </main>

      <HomeAbout />
    </div>
  );
}
