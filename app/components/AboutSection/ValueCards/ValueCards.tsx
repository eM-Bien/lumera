"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { values } from "../about.content";
import RevealHeading from "../../RevealHeading/RevealHeading";
import styles from "./ValueCards.module.css";

/** Gradient tła dla każdej wartości (ciemny granat). */
const GRADIENTS = [
  "linear-gradient(150deg, #0b4b5c 0%, #05132f 100%)",
  "linear-gradient(150deg, #143286 0%, #050f28 100%)",
  "linear-gradient(150deg, #281663 0%, #050c24 100%)",
  "linear-gradient(150deg, #331a60 0%, #050b20 100%)",
];

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
 * Karuzela wartości w stylu „RIG": karty płyną w nieskończoność, a ta w centrum
 * jest największa i w pełni widoczna; boczne maleją, przygasają i odchylają się
 * w perspektywie 3D (coverflow).
 */
export default function ValueCards() {
  const n = values.length;
  const COPIES = 3;
  const loop = Array.from({ length: COPIES }, () => values).flat();

  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    if (!marquee || !track) return;
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    let step = 0;
    let cardW = 0;
    let oneCopy = 0;
    let containerW = 0;

    const measure = () => {
      const first = cards[0];
      const mr = parseFloat(getComputedStyle(first).marginRight) || 0;
      cardW = first.offsetWidth;
      step = cardW + mr;
      oneCopy = step * n;
      containerW = marquee.clientWidth;
    };
    measure();

    // skala/przygaszenie/obrót zależne od odległości od środka
    const applyFocus = (offset: number) => {
      const cCenter = offset + containerW / 2;
      // odległość odniesienia ~ szerokość jednej karty → sąsiednie szybko maleją
      const ref = step * 1.35;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        let d = i * step + cardW / 2 - cCenter;
        // zawijanie do najbliższej kopii, by efekt był ciągły
        d = ((d % oneCopy) + oneCopy) % oneCopy;
        if (d > oneCopy / 2) d -= oneCopy;
        const f = Math.max(-1.8, Math.min(1.8, d / ref));
        const af = Math.min(1, Math.abs(f));
        // karta w centrum powiększona, boczne wyraźnie mniejsze
        const scale = 1.3 - 0.7 * af;
        const op = Math.max(0.1, 1 - 0.72 * af);
        const ry = -f * 20;
        const tz = -af * 240;
        el.style.transform = `translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        el.style.opacity = String(op);
        el.style.zIndex = String(1000 - Math.round(af * 1000));
      }
    };

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      track.style.transform = "translateX(0)";
      applyFocus(0);
      return;
    }

    let offset = 0;
    let raf = 0;
    let last = performance.now();
    const speed = 55; // px/s — automatyczny przesuw

    let dragging = false;
    let startX = 0;
    let startOffset = 0;

    const norm = (v: number) => ((v % oneCopy) + oneCopy) % oneCopy;

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!dragging) offset += speed * dt;
      offset = norm(offset);
      track.style.transform = `translateX(${-offset}px)`;
      applyFocus(offset);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // --- chwyć i przeciągnij (mysz + dotyk) --------------------------------
    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startOffset = offset;
      marquee.classList.add(styles.grabbing);
      marquee.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      offset = norm(startOffset - (e.clientX - startX));
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      marquee.classList.remove(styles.grabbing);
      marquee.releasePointerCapture?.(e.pointerId);
    };
    marquee.addEventListener("pointerdown", onDown);
    marquee.addEventListener("pointermove", onMove);
    marquee.addEventListener("pointerup", onUp);
    marquee.addEventListener("pointercancel", onUp);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      marquee.removeEventListener("pointerdown", onDown);
      marquee.removeEventListener("pointermove", onMove);
      marquee.removeEventListener("pointerup", onUp);
      marquee.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  return (
    <section className={styles.section}>
      <RevealHeading as="h2" className={styles.heading} text="Nasze wartości" />

      <div ref={marqueeRef} className={styles.marquee}>
        <div ref={trackRef} className={styles.track}>
          {loop.map((v, i) => {
            const idx = i % n;
            return (
              <article
                key={i}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={styles.card}
                style={{ background: GRADIENTS[idx] }}
                aria-hidden={i >= n}
              >
                <span className={styles.icon} aria-hidden="true">
                  {ICONS[idx]}
                </span>
                <h3 className={styles.label}>{v.label}</h3>
                <p className={styles.text}>{v.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
