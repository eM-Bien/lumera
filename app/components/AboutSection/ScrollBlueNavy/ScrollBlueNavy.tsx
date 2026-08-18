"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ScrollBlueNavy.module.css";

/**
 * Tło sterowane scrollem dla obszaru obejmującego dzieci:
 * u góry obszaru — niebieski gradient, ku dołowi przechodzi w ciemny granat.
 * Płynnie pojawia się i znika na krańcach obszaru.
 */
export default function ScrollBlueNavy({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [blue, setBlue] = useState(0);
  const [navy, setNavy] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));
    const smooth = (x: number) => x * x * (3 - 2 * x);

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const c = vh / 2;

      // widoczność: rośnie gdy środek okna wchodzi w obszar, znika przy krańcach
      let vis: number;
      if (rect.top > c) vis = 1 - clamp((rect.top - c) / (vh * 0.6), 0, 1);
      else if (rect.bottom < c)
        vis = 1 - clamp((c - rect.bottom) / (vh * 0.6), 0, 1);
      else vis = 1;

      // 0 na górze obszaru (niebieski) → 1 na dole (granat)
      const frac = smooth(clamp((c - rect.top) / Math.max(1, rect.height), 0, 1));

      setBlue(vis * (1 - frac) * 0.95);
      setNavy(vis * frac * 0.97);
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
    <>
      <div className={styles.blue} style={{ opacity: blue }} aria-hidden="true" />
      <div className={styles.navy} style={{ opacity: navy }} aria-hidden="true" />
      <div ref={ref}>{children}</div>
    </>
  );
}
