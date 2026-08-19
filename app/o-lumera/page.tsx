"use client";

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
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import CtaBand from "../components/CtaBand/CtaBand";

export default function AboutPage() {
  return (
    <main className={styles.about}>
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

      <Subtitle>{intro}</Subtitle>

      <TextColumn align="left" paragraphs={story.left} />
      <TextColumn align="right" paragraphs={story.right} />

      <ScrollBlueNavy>
        <ValueCards />

        <RevealHeading
          as="h2"
          className={styles.sectionHeading}
          text="Nasza filozofia"
        />
        <TextColumn align="left" paragraphs={philosophy.right} />

        <div className={styles.spacer} />

        <CtaBand
          eyebrow="Zapraszamy Cię do świata Lumera"
          title="Umów wizytę"
          text="Napisz lub zadzwoń — chętnie odpowiemy na Twoje pytania i pomożemy wybrać odpowiednie zabiegi dla Ciebie"
          buttonLabel="Skontaktuj się"
          href="/kontakt"
        />
      </ScrollBlueNavy>
      <ScrollToTop />
    </main>
  );
}
