import type { ReactNode } from "react";
import { values } from "../about.content";
import RevealHeading from "../../RevealHeading/RevealHeading";
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
 * „Nasze wartości" — rząd szklanych (frosted glass) kafli: każda wartość
 * na osobnym, przezroczystym panelu z ikoną, tytułem i opisem.
 */
export default function ValueCards() {
  return (
    <section className={styles.section}>
      <RevealHeading as="h2" className={styles.heading} text="Nasze wartości" />

      <div className={styles.grid}>
        {values.map((v, i) => (
          <article key={v.label} className={styles.card}>
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
