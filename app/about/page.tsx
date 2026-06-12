"use client";

import styles from "./page.module.css";

import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import { Montserrat } from "next/font/google";
import ScrollReveal from "./ScrollReveal";
import LetterBackground from "../components/LetterBackground/LetterBackground";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
});

export default function AboutPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className={`${styles.about} ${cinzel.variable} ${montserrat.variable}`}
    >
      {ready && (
        <LetterBackground
          fontFamily={cinzel.style.fontFamily}
          gold={[240, 235, 235]}
          scale={1} // ← rozmiar całej kompozycji
          letterFrac={0.45} // ← rozmiar samej litery
        />
      )}

      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="O Lumera" />
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <section className={`${styles.block} ${styles.right}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <div className={styles.spacer} />
    </main>
  );
}
