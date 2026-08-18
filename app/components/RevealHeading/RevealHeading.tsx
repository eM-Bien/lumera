"use client";

import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import styles from "./RevealHeading.module.css";

type RevealHeadingProps = {
  text: string;
  as?: ElementType;
  className?: string;
};

/**
 * Nagłówek z efektem jak everwonder/about: na starcie litery są rozjechane na
 * zewnątrz (im dalej od środka, tym bardziej), a przy scrollu zjeżdżają na
 * właściwe miejsca. Efekt związany ze scrollem (reaguje w obie strony).
 * Typografia w całości z przekazanego `className`.
 */
export default function RevealHeading({
  text,
  as = "h2",
  className = "",
}: RevealHeadingProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);

  // grupowanie po słowach (żeby słowo nie łamało się w środku), globalny indeks liter
  const words = text.split(" ");
  const wordMeta = words.map((w, i) => ({
    w,
    // globalny indeks pierwszej litery = suma długości poprzednich słów + spacje
    start: words.slice(0, i).reduce((s, ww) => s + ww.length + 1, 0),
  }));
  const total = text.length;
  const center = (total - 1) / 2;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const letters = lettersRef.current;

    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

    const settle = () => {
      letters.forEach((s) => {
        if (s) {
          s.style.transform = "none";
          s.style.opacity = "1";
        }
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // pełne zejście już około połowy ekranu (subtelniej)
      const start = vh * 0.95;
      const end = vh * 0.56;
      const p = clamp((start - rect.top) / (start - end), 0, 1);
      const e = easeOut(p);
      const amp = Math.min(window.innerWidth * 0.018, 20); // px na krok od środka

      letters.forEach((s, k) => {
        if (!s) return;
        const dir = k - center;
        const tx = dir * amp * (1 - e);
        const ty = Math.sin(k * 1.7) * 20 * (1 - e); // lekki rozrzut w pionie
        const op = 0.3 + 0.7 * e;
        s.style.transform = `translate(${tx}px, ${ty}px)`;
        s.style.opacity = String(op);
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const Tag = as;
  return (
    <Tag
      ref={elRef as React.Ref<HTMLElement>}
      className={`${styles.reveal} ${className}`}
    >
      {wordMeta.map(({ w, start }, wi) => (
        <span key={wi} className={styles.word}>
          {[...w].map((ch, ci) => {
            const idx = start + ci;
            return (
              <span
                key={ci}
                ref={(node) => {
                  lettersRef.current[idx] = node;
                }}
                className={styles.char}
              >
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span
              ref={(node) => {
                lettersRef.current[start + w.length] = node;
              }}
              className={styles.char}
            >
              {" "}
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}
