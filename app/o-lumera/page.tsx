"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import RevealHeading from "../components/RevealHeading/RevealHeading";
import VideoBackground from "../components/AboutSection/VideoBackground/VideoBackground";
import Subtitle from "../components/AboutSection/Subtitle/Subtitle";
import TextColumn from "../components/AboutSection/TextColumn/TextColumn";
import {
  intro,
  philosophy,
  story,
} from "../components/AboutSection/about.content";
import ValueCards from "../components/AboutSection/ValueCards/ValueCards";
import ScrollBlueNavy from "../components/AboutSection/ScrollBlueNavy/ScrollBlueNavy";
import MoonReveal from "../components/AboutSection/MoonReveal/MoonReveal";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CtaBand from "../components/CtaBand/CtaBand";

export default function AboutPage() {
  const mainRef = useRef<HTMLElement | null>(null);

  // parallax hero jak na stronie głównej: film zjeżdża w dół i gaśnie,
  // nagłówek „Witamy w Lumera" ucieka szybciej w górę.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 1.2)));
      el.style.setProperty("--p", String(p));
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
    <main ref={mainRef} className={styles.about}>
      <VideoBackground />

      <section className={styles.hero}>
        <RevealHeading
          as="h1"
          className={styles.h1}
          text="Witamy w Lumera"
          mode="load"
          delayMs={150}
        />
      </section>

      <div
        className={styles.rise}
        style={{ ["--sp"]: "-55vh" } as React.CSSProperties}
      >
        <Subtitle>{intro}</Subtitle>
      </div>

      <TextColumn align="left" paragraphs={story.left} />
      <TextColumn align="right" paragraphs={story.right} />

      <ScrollBlueNavy>
        <ValueCards />

        <div className={styles.spacer} />

        <MoonReveal title="Nasza filozofia" paragraphs={philosophy.right}>
          <CtaBand
            eyebrow="Zapraszamy Cię do świata Lumera"
            title="Umów wizytę"
            text="Napisz lub zadzwoń — chętnie odpowiemy na Twoje pytania i pomożemy wybrać odpowiednie zabiegi dla Ciebie"
            buttonLabel="Skontaktuj się"
            href="/kontakt"
          />
        </MoonReveal>
      </ScrollBlueNavy>
      <ScrollToTop />
    </main>
  );
}
