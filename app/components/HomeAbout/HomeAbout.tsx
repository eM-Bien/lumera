"use client";

import { useEffect, useRef, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import RevealHeading from "../RevealHeading/RevealHeading";
import styles from "./HomeAbout.module.css";

const EXPLORE = [
  {
    title: "Ebooki",
    text: "Praktyczna wiedza o świadomej pielęgnacji — do przeczytania w swoim tempie.",
    href: "/ebooki",
    label: "Zobacz ebooki",
  },
  {
    title: "Zabiegi",
    text: "Twarz, ciało i skóra głowy. Znajdź zabieg dopasowany do Twoich potrzeb.",
    href: "/oferta",
    label: "Przeglądaj zabiegi",
  },
  {
    title: "Nie wiesz od czego zacząć?",
    text: "Napisz do nas — pomożemy dobrać to, co sprawdzi się najlepiej właśnie dla Ciebie.",
    href: "/kontakt",
    label: "Skontaktuj się",
  },
];

/**
 * Sekcja pod hero na stronie głównej: granatowa „zakładka" wysuwa się przy
 * scrollu, pojawiają się duże nagłówki, krótkie info o nas i zachęta do
 * rozglądania po stronie (ebooki / zabiegi / kontakt).
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
        <p className={styles.eyebrow}>Kim jesteśmy</p>
        <RevealHeading
          as="h2"
          className={styles.heading}
          text="Pielęgnacja oparta na wiedzy i trosce"
        />
        <p className={styles.lead}>
          Lumera to studio kosmetologii i trychologii, w którym profesjonalna
          wiedza spotyka się z troską. Dobieramy pielęgnację twarzy, ciała i
          skóry głowy do Twoich realnych potrzeb — z uważnością i bez
          uniwersalnych rozwiązań.
        </p>

        <div className={styles.cards}>
          {EXPLORE.map((c, i) => (
            <article
              key={c.href}
              className={styles.card}
              style={{ transitionDelay: `${0.15 + i * 0.12}s` }}
            >
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardText}>{c.text}</p>
              <button
                type="button"
                className={styles.cardLink}
                onClick={() => navigate(c.href)}
              >
                {c.label}
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
