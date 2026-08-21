"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
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
    sub: "Przewodniki o świadomej pielęgnacji",
    href: "/ebooki",
  },
  {
    key: "kontakt",
    title: "Kontakt",
    sub: "Napisz lub zadzwoń",
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
  const shapeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [inView, setInView] = useState(false);
  const [headIn, setHeadIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // na mobile kafle są jeden pod drugim, więc „Odkryj Lumerę"
          // odsłaniamy już przy wejściu w sekcję (nie po kaflu Kontakt)
          if (window.matchMedia("(max-width: 820px)").matches) {
            setHeadIn(true);
          }
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // kafle wpływają, gdy wjadą w widok; „Zabiegi" i „Kontakt" dopiero przy dole.
  // Nagłówek „Odkryj Lumerę" wjeżdża dopiero, gdy pojawi się Kontakt.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    shapeRefs.current.forEach((el, i) => {
      if (!el) return;
      const key = SHAPES[i]?.key;
      // moment wjazdu każdego kafla (im większy %, tym później)
      const BOTTOM: Record<string, string> = {
        ebooki: "-18%",
        oferta: "-24%",
        kontakt: "-40%",
      };
      const rootMargin = `0px 0px ${BOTTOM[key] ?? "-24%"} 0px`;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            el.classList.add(styles.shapeIn);
            if (key === "kontakt") setHeadIn(true); // nagłówek po Kontakcie
            io.disconnect();
          }
        },
        { threshold: 0, rootMargin },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section ref={ref} className={`${styles.about} ${inView ? styles.in : ""}`}>
      <div className={styles.inner}>
        <div className={`${styles.head} ${headIn ? styles.headIn : ""}`}>
          <h2 className={styles.heading}>
            <span className={styles.headingInner}>Odkryj Lumerę</span>
          </h2>
          <p className={styles.lead}>
            Studio kosmetologii i trychologii, w którym dzięki profesjonalnej
            wiedzy pomożemy Ci w doborze zabiegów dopasowanych do Twoich
            potrzeb. Poznaj naszą ofertę i znajdź coś dla siebie.
          </p>
        </div>

        {SHAPES.map((s, i) => (
          <button
            key={s.key}
            ref={(el) => {
              shapeRefs.current[i] = el;
            }}
            type="button"
            className={`${styles.shape} ${SHAPE_CLASS[s.key]}`}
            onClick={() => navigate(s.href)}
          >
            <span className={styles.shapeTitle}>{s.title}</span>
            <span className={styles.shapeSub}>{s.sub}</span>
          </button>
        ))}

        <button
          type="button"
          className={styles.orderNow}
          onClick={() => navigate("/o-lumera")}
        >
          <span className={styles.orderLine} aria-hidden="true" />
          <span className={styles.orderLabel}>Poznaj nas</span>
          <span className={styles.orderArrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
