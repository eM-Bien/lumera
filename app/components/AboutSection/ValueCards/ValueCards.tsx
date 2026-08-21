"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { values } from "../about.content";
import styles from "./ValueCards.module.css";

/** Ikony z public/ dla kolejnych wartości. */
const ICONS: ReactNode[] = [
  // Harmonia
  // eslint-disable-next-line @next/next/no-img-element
  <img key="h" className={styles.iconImg} src="/harmonia.svg" alt="" />,
  // Wiedza
  // eslint-disable-next-line @next/next/no-img-element
  <img key="w" className={styles.iconImg} src="/wiedza.svg" alt="" />,
  // Indywidualne podejście
  // eslint-disable-next-line @next/next/no-img-element
  <img key="i" className={styles.iconImg} src="/indywidual.svg" alt="" />,
  // Troska (nieco mniejsza, bo rysunek jest większy)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    key="t"
    className={`${styles.iconImg} ${styles.iconTroska}`}
    src="/troska.svg"
    alt=""
  />,
];

/**
 * „Nasze wartości" — rząd szklanych kafli. Przy scrollu każdy kafel pojawia
 * się po kolei z chwilowym blaskiem z góry.
 */
export default function ValueCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // zaczyna się pojawiać trochę wcześniej (gdy sekcja jest wyżej w kadrze)
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.in : ""}`}
    >
      {/* strumienie światła z samej góry — po jednym na kartę */}
      <div className={styles.beams} aria-hidden="true">
        {values.map((v, i) => (
          <span
            key={v.label}
            className={styles.beam}
            style={{ ["--i"]: i } as React.CSSProperties}
          />
        ))}
      </div>

      <h2 className={styles.heading}>Nasze wartości</h2>

      <div className={styles.grid}>
        {values.map((v, i) => (
          <article
            key={v.label}
            className={styles.card}
            style={{ ["--i"]: i } as React.CSSProperties}
          >
            <span className={styles.icon} aria-hidden="true">
              {ICONS[i]}
            </span>
            <h3 className={styles.label}>{v.label}</h3>
            <p className={styles.text}>{v.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
