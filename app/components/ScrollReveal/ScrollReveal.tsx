"use client";

import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import styles from "./ScrollReveal.module.css";

type ScrollRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
};

export default function ScrollReveal({
  text,
  as = "h2",
  className = "",
}: ScrollRevealProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const linesRef = useRef<HTMLSpanElement[][]>([]);
  const maxRef = useRef<number[]>([]);
  const words = text.replace(/\s+/g, " ").trim().split(" ");

  const groupLines = () => {
    const map = new Map<number, HTMLSpanElement[]>();
    wordsRef.current.forEach((w) => {
      if (!w) return;
      const top = w.offsetTop;
      if (!map.has(top)) map.set(top, []);
      map.get(top)!.push(w);
    });
    linesRef.current = [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, ws]) => ws);
    maxRef.current = new Array(linesRef.current.length).fill(0);
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      wordsRef.current.forEach((w) => w && (w.style.opacity = "1"));
      return;
    }

    groupLines();

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const span = rect.height + (start - end);
      const prog = Math.min(1, Math.max(0, (start - rect.top) / span));

      const lines = linesRef.current;
      const max = maxRef.current;
      const n = lines.length;
      lines.forEach((lineWords, i) => {
        let lp = Math.min(1, Math.max(0, prog * n - i * 0.6));
        if (lp < max[i]) lp = max[i];
        else max[i] = lp;
        const op = String(0.12 + 0.88 * lp);
        const ty = `translateY(${(1 - lp) * 0.25}em)`;
        lineWords.forEach((w) => {
          w.style.opacity = op;
          w.style.transform = ty;
        });
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      groupLines();
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  const Tag = as;
  return (
    <Tag
      ref={elRef as React.Ref<HTMLElement>}
      className={`${styles.reveal} ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          ref={(node) => {
            if (node) wordsRef.current[i] = node;
          }}
          className={styles.word}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
