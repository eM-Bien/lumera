"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { values } from "../about.content";
import styles from "./ValueCards.module.css";

/** Ikony wartości (public/). Ostatnia — „troska" — jest większa w pliku,
 *  więc dostaje dodatkową klasę zmniejszającą rysunek. */
const ICON_SRC = [
  "/harmonia.svg",
  "/wiedza.svg",
  "/indywidual.svg",
  "/troska.svg",
];

function iconClass(i: number): string {
  return i === 3 ? `${styles.iconImg} ${styles.iconTroska}` : styles.iconImg;
}

/**
 * „Nasze wartości" — rząd szklanych kafli. Każdy kafel jest klikalny: po
 * kliknięciu wylatuje na środek, powiększa się, obraca i rozwija na pełny
 * ekran z dłuższym opisem oraz przyciskiem X do zamknięcia.
 */
export default function ValueCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const [open, setOpen] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState({ dx: 0, dy: 0, cw: 280, ch: 360 });
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // pojawianie się sekcji przy scrollu
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
      { threshold: 0, rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openCard = (i: number, el: HTMLElement) => {
    // punkt startowy animacji = środek klikniętego kafla względem środka ekranu
    const rect = el.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
    const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
    // FLIP: panel startuje dokładnie w rozmiarze kafla (pionowy), potem rośnie
    lastFocused.current = el;
    setOrigin({ dx, dy, cw: rect.width, ch: rect.height });
    setClosing(false);
    setOpen(i);
  };

  const requestClose = useCallback(() => setClosing(true), []);

  // koniec animacji: przy zamykaniu odmontowujemy i wracamy fokusem na kafel
  const onAnimEnd = () => {
    if (closing) {
      setOpen(null);
      setClosing(false);
      lastFocused.current?.focus?.();
    }
  };

  // Escape + blokada scrolla + fokus na „zamknij", gdy otwarte
  useEffect(() => {
    if (open === null) return;
    // zatrzymujemy smooth scroll (Lenis) — samo overflow:hidden go nie blokuje
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    closeBtnRef.current?.focus();

    const SCROLL_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (SCROLL_KEYS.includes(e.key)) e.preventDefault();
    };
    const preventTouch = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("keydown", onKey);
    window.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("touchmove", preventTouch);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, requestClose]);

  const active = open !== null ? values[open] : null;

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
            style={{ ["--i"]: i } as CSSProperties}
          />
        ))}
      </div>

      <h2 className={styles.heading}>Nasze wartości</h2>

      <div className={styles.grid}>
        {values.map((v, i) => (
          <article
            key={v.label}
            className={styles.card}
            style={{ ["--i"]: i } as CSSProperties}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            onClick={(e) => openCard(i, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openCard(i, e.currentTarget);
              }
            }}
          >
            <span className={styles.icon} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={iconClass(i)} src={ICON_SRC[i]} alt="" />
            </span>
            <h3 className={styles.label}>{v.label}</h3>
            <p className={styles.text}>{v.text}</p>
            <span className={styles.more} aria-hidden="true">
              Czytaj więcej
            </span>
          </article>
        ))}
      </div>

      {open !== null &&
        active &&
        createPortal(
          <div
            className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
            onClick={requestClose}
          >
            <div
              className={`${styles.modal} ${closing ? styles.modalClosing : ""}`}
              style={
                {
                  ["--dx"]: `${origin.dx}px`,
                  ["--dy"]: `${origin.dy}px`,
                  ["--cw"]: `${origin.cw}px`,
                  ["--ch"]: `${origin.ch}px`,
                } as CSSProperties
              }
              role="dialog"
              aria-modal="true"
              aria-label={active.label}
              onClick={requestClose}
              onAnimationEnd={onAnimEnd}
            >
              <button
                ref={closeBtnRef}
                type="button"
                className={styles.close}
                onClick={requestClose}
                aria-label="Zamknij"
              >
                ×
              </button>

              <h3 className={styles.modalTitle}>{active.label}</h3>
              <div className={styles.modalText}>
                {active.long.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* stabilna ikona na czas powiększania — nie rozjeżdża się z panelem;
                znika przed obrotem, potem pojawia się właściwa treść */}
            {!closing && (
              <span className={styles.flyLabel} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={iconClass(open)} src={ICON_SRC[open]} alt="" />
              </span>
            )}
          </div>,
          document.body,
        )}
    </section>
  );
}
