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
  const headingRef = useRef<HTMLHeadingElement | null>(null);
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
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // nagłówek: wyłania się z dołu, gdy sam wjedzie w widok (nie za wcześnie)
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadIn(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -28% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // kafle wpływają, gdy wjadą w widok; „Zabiegi" i „Kontakt" dopiero przy dole
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
          <h2 ref={headingRef} className={styles.heading}>
            <span className={styles.headingInner}>Odkryj Lumerę</span>
          </h2>
          <p className={styles.lead}>
            Studio kosmetologii i trychologii, w którym profesjonalna wiedza
            spotyka się z troską. Zacznij od tego, co Cię interesuje.
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
