"use client";

import { useEffect, useState } from "react";
import { values } from "../about.content";
import RevealHeading from "../../RevealHeading/RevealHeading";
import styles from "./ValueCards.module.css";

/** Co ile ms karuzela sama przechodzi do kolejnej wartości. */
const AUTOPLAY_MS = 5000;

/**
 * Wartości Lumera jako karuzela (styl „lookbook"): po lewej tytuł (np. Harmonia),
 * po prawej opis. Wartości rotują automatycznie; można też przełączać ręcznie.
 */
export default function ValueCards() {
  const n = values.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => setActive(((i % n) + n) % n);

  // autoplay — resetuje odliczanie po każdej zmianie (auto lub ręcznej)
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, n]);

  const v = values[active];

  return (
    <section className={styles.section}>
      <RevealHeading as="h2" className={styles.heading} text="Nasze wartości" />

      <div
        className={styles.carousel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* lewa: licznik + tytuł */}
        <div className={styles.left}>
          <span className={styles.index} key={`i-${active}`}>
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <h3 className={styles.title} key={`t-${active}`}>
            {v.label}
          </h3>
        </div>

        <span className={styles.divider} aria-hidden="true" />

        {/* prawa: opis */}
        <div className={styles.right}>
          <p className={styles.text} key={`x-${active}`}>
            {v.text}
          </p>
        </div>
      </div>

      {/* nawigacja */}
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(active - 1)}
          aria-label="Poprzednia wartość"
        >
          ‹
        </button>

        <div className={styles.dots}>
          {values.map((val, i) => (
            <button
              key={val.label}
              type="button"
              className={`${styles.dot} ${i === active ? styles.dotOn : ""}`}
              aria-label={val.label}
              aria-current={i === active}
              onClick={() => go(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => go(active + 1)}
          aria-label="Następna wartość"
        >
          ›
        </button>
      </div>
    </section>
  );
}
