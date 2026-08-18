"use client";

import styles from "./page.module.css";
import ScrollReveal from "../components/ScrollReveal/ScrollReveal";
import VideoBackground from "../components/AboutSection/VideoBackground/VideoBackground";
import Subtitle from "../components/AboutSection/Subtitle/Subtitle";
import TextColumn from "../components/AboutSection/TextColumn/TextColumn";
import {
  intro,
  philosophy,
  story,
} from "../components/AboutSection/about.content";
import SectionHeading from "../components/AboutSection/SectionHeading/SectionHeading";
import ValueCards from "../components/AboutSection/ValueCards/ValueCards";
import ScrollBlueNavy from "../components/AboutSection/ScrollBlueNavy/ScrollBlueNavy";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CtaBand from "../components/CtaBand/CtaBand";

export default function AboutPage() {
  return (
    <main className={styles.about}>
      <VideoBackground />

      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="Witamy w Lumera" />
      </section>

      <Subtitle>{intro}</Subtitle>

      <TextColumn align="left" paragraphs={story.left} />
      <TextColumn align="right" paragraphs={story.right} />

      <ScrollBlueNavy>
        <ValueCards />

        <SectionHeading text="Nasza filozofia" align="right" />
        <TextColumn align="right" paragraphs={philosophy.right} />
      </ScrollBlueNavy>

      <div className={styles.spacer} />

      <CtaBand
        eyebrow="Zapraszamy Cię do świata Lumera"
        title="Umów wizytę"
        text="Miejsce stworzone z pasji, wiedzy i serca. Napisz lub zadzwoń — z przyjemnością Cię poznamy."
        buttonLabel="Skontaktuj się"
        href="/kontakt"
      />
      <ScrollToTop />
    </main>
  );
}
