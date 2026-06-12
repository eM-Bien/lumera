"use client";

import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import WaterLetter, { LetterBox } from "../components/WaterLetter/WaterLetter";
import Sprig from "../components/Sprig/Sprig";
// import LightsBackground from "../components/LightsBackground";
import ScrollReveal from "./ScrollReveal";
import styles from "./page.module.css";
import LetterBackground from "../components/LetterBackground/LetterBackground";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function AboutPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={styles.about}>
      {ready && (
        <LetterBackground
          fontFamily={cinzel.style.fontFamily}
          gold={[240, 235, 235]}
          scale={1} // ← rozmiar całej kompozycji
          letterFrac={0.45} // ← rozmiar samej litery
        />
      )}
      {/* <LightsBackground /> */}

      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="O Lumera" />
      </section>

      <section className={`${styles.block}  ${styles.left}`}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <section className={`${styles.block} ${styles.right}`}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Ut enim ad minim veniam quis nostrud exercitation ullamco"
        />
      </section>

      <div className={styles.spacer} />
    </main>
  );
}
