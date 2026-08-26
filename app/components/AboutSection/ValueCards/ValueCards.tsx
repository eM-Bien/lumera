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
    const rect = el.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - window.innerWidth / 2;
    const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
    lastFocused.current = el;
    setOrigin({ dx, dy, cw: rect.width, ch: rect.height });
    setClosing(false);
    setOpen(i);
  };

  const requestClose = useCallback(() => setClosing(true), []);

  const onAnimEnd = () => {
    if (closing) {
      setOpen(null);
      setClosing(false);
      lastFocused.current?.focus?.();
    }
  };

  useEffect(() => {
    if (open === null) return;
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    lenis?.stop();
    closeBtnRef.current?.focus({ preventScroll: true });

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
    const preventScroll = (e: Event) => e.preventDefault();
    document.addEventListener("keydown", onKey);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      lenis?.start();
    };
  }, [open, requestClose]);

  const active = open !== null ? values[open] : null;

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${inView ? styles.in : ""}`}
    >
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
