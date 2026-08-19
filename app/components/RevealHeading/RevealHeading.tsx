"use client";

import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import styles from "./RevealHeading.module.css";

type RevealHeadingProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "scroll" (domyślnie) — efekt sterowany scrollem; "load" — odtwarza się raz na wejściu. */
  mode?: "scroll" | "load";
  /** Opóźnienie startu (ms) dla trybu "load". */
  delayMs?: number;
};

/**
 * Nagłówek z efektem jak everwonder/about: na starcie litery są rozjechane na
 * zewnątrz (im dalej od środka, tym bardziej), a przy scrollu (lub „na dzień
 * dobry" w trybie load) zjeżdżają na właściwe miejsca.
 * Typografia w całości z przekazanego `className`.
 */
export default function RevealHeading({
  text,
  as = "h2",
  className = "",
  mode = "scroll",
  delayMs = 0,
}: RevealHeadingProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);

  // grupowanie po słowach (żeby słowo nie łamało się w środku), globalny indeks liter
  const words = text.split(" ");
  const wordMeta = words.map((w, i) => ({
    w,
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

    // ustawia litery dla postępu e (0 = rozjechane, 1 = na miejscu)
    const applyE = (e: number) => {
      const amp = Math.min(window.innerWidth * 0.018, 20);
      letters.forEach((s, k) => {
        if (!s) return;
        const dir = k - center;
        const tx = dir * amp * (1 - e);
        const ty = Math.sin(k * 1.7) * 20 * (1 - e);
        const op = 0.3 + 0.7 * e;
        s.style.transform = `translate(${tx}px, ${ty}px)`;
        s.style.opacity = String(op);
      });
    };

    const settle = () => applyE(1);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    let raf = 0;

    // --- tryb „load": jednorazowa animacja na wejściu ----------------------
    if (mode === "load") {
      applyE(0);
      const duration = 1100;
      let startT = 0;
      const tick = (t: number) => {
        if (!startT) startT = t;
        const elapsed = t - startT - delayMs;
        if (elapsed <= 0) {
          raf = requestAnimationFrame(tick);
          return;
        }
        const p = clamp(elapsed / duration, 0, 1);
        applyE(easeOut(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => {
        if (raf) cancelAnimationFrame(raf);
      };
    }

    // --- tryb „scroll": efekt związany z pozycją w oknie -------------------
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.95;
      const end = vh * 0.56;
      const p = clamp((start - rect.top) / (start - end), 0, 1);
      applyE(easeOut(p));
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
  }, [text, mode, delayMs, center]);

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
              {" "}
            </span>
          )}
        </span>
      ))}
    </Tag>
  );
}
