"use client";

import { useEffect, useRef, useState } from "react";
import { values } from "../about.content";
import styles from "./ValueCards.module.css";

/** Jak mocno karty schodzą się przy pełnym wyśrodkowaniu (0..1). */
const OVERLAP = 0.2;

/**
 * Wartości Lumera — szerokie karty. Na starcie przy brzegach, przy scrollu
 * delikatnie schodzą się do środka (nachodzą na siebie), przechył naprzemienny.
 * Nagłówki z reveal, tło płynnie przechodzi w niebieski gradient.
 */
export default function ValueCards() {
  const ref = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);

  const [intensity, setIntensity] = useState(0); // 0 = przy brzegach, 1 = zeszły do środka
  const [spread, setSpread] = useState(0); // px, rozstaw skrajnych kart
  const [isMobile, setIsMobile] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(max-width: 720px)");
    const measure = () => {
      setIsMobile(mq.matches);
      const stack = stackRef.current;
      const card = stack?.firstElementChild as HTMLElement | undefined;
      const stackW = stack?.clientWidth ?? 0;
      const cardW = card?.offsetWidth ?? 0;
      setSpread(Math.max(0, stackW - cardW));
    };
    measure();

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - vh / 2);
      const maxDist = vh / 2 + rect.height / 2;
      let t = 1 - Math.min(1, dist / maxDist);
      t = t * t * (3 - 2 * t);
      setIntensity(t);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // reveal nagłówków przy wejściu w kadr
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = values.length;

  return (
    <section
      ref={ref}
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
    >
        <h2 className={styles.heading}>
          <span className={styles.headingInner}>Nasze wartości</span>
        </h2>

        <div ref={stackRef} className={styles.stack}>
          {values.map((v, i) => {
            const tilt = i % 2 === 0 ? -3 : 3;
            const frac = n > 1 ? i / (n - 1) : 0.5;
            const baseX = (frac - 0.5) * spread; // rozstaw przy brzegach
            const x = baseX * (1 - intensity * OVERLAP); // schodzenie do środka
            const style = isMobile
              ? ({ ["--i"]: i } as React.CSSProperties)
              : ({
                  ["--i"]: i,
                  transform: `translate(calc(-50% + ${x}px), 0) rotate(${tilt}deg)`,
                  zIndex: i,
                } as React.CSSProperties);
            return (
              <article key={v.label} className={styles.card} style={style}>
                <h3 className={styles.label}>{v.label}</h3>
                <p className={styles.text}>{v.text}</p>
              </article>
            );
          })}
        </div>
      </section>
  );
}
