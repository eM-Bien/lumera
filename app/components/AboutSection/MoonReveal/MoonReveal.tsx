"use client";

import { useEffect, useRef, type ReactNode } from "react";
import RevealHeading from "../../RevealHeading/RevealHeading";
import styles from "./MoonReveal.module.css";

type Props = {
  /** Nagłówek obok księżyca (np. „Nasza filozofia"). */
  title: string;
  /** Akapity tekstu obok księżyca. */
  paragraphs: string[];
  /** To, co odsłania się na dole (pasek CTA „Umów wizytę"). */
  children: ReactNode;
};

/**
 * Ciemna sekcja z księżycem. Przy scrollu księżyc zniża się do środka i rośnie,
 * „Nasza filozofia" znika, a od dołu wysuwa się pasek z CTA „Umów wizytę".
 */
export default function MoonReveal({ title, paragraphs, children }: Props) {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height - vh;
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const p = total > 0 ? scrolled / total : 0;
      el.style.setProperty("--dp", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene}>
      <div className={styles.sticky}>
        <div className={styles.aside}>
          <RevealHeading
            as="h2"
            className={styles.asideHeading}
            text={title}
            mode="load"
          />
          <div className={styles.asideText}>
            {paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>

        <div className={styles.behind}>{children}</div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.moon}
          src="/about/moon.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
