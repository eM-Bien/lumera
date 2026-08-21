"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import RevealHeading from "../RevealHeading/RevealHeading";
import styles from "./HomeAbout.module.css";

const SHAPES = [
  {
    key: "oferta",
    title: "Zabiegi",
    sub: "Twarz, ciało i skóra głowy",
    href: "/oferta",
  },
  {
    key: "ebooki",
    title: "Ebooki",
    sub: "Wiedza, którą zabierzesz ze sobą",
    href: "/ebooki",
  },
  {
    key: "kontakt",
    title: "Kontakt",
    sub: "Nie wiesz od czego zacząć?",
    href: "/kontakt",
  },
] as const;

const SHAPE_CLASS: Record<string, string> = {
  ebooki: styles.ebooki,
  oferta: styles.oferta,
  kontakt: styles.kontakt,
};

/**
 * Sekcja pod hero na stronie głównej — układ „lookbook": duży nagłówek,
 * krótkie info o nas i trzy zaokrąglone kształty (liście) prowadzące do
 * ebooków, oferty i kontaktu.
 */
export default function HomeAbout() {
  const { navigate } = useTransition();
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.about} ${inView ? styles.in : ""}`}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <RevealHeading
            as="h2"
            className={styles.heading}
            text="Odkryj Lumerę"
          />
          <p className={styles.lead}>
            Studio kosmetologii i trychologii, w którym profesjonalna wiedza
            spotyka się z troską. Zacznij od tego, co Cię interesuje.
          </p>
        </div>

        {SHAPES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`${styles.shape} ${SHAPE_CLASS[s.key]}`}
            style={{ transitionDelay: `${0.15 + i * 0.12}s` }}
            onClick={() => navigate(s.href)}
          >
            <span className={styles.shapeTitle}>{s.title}</span>
            <span className={styles.shapeSub}>{s.sub}</span>
          </button>
        ))}

        <button
          type="button"
          className={styles.orderNow}
          onClick={() => navigate("/kontakt")}
        >
          <span className={styles.orderLine} aria-hidden="true" />
          <span className={styles.orderLabel}>Umów wizytę</span>
          <span className={styles.orderArrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
