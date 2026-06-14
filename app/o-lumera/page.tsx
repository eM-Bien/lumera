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
  summary,
  values,
} from "../components/AboutSection/about.content";
import SectionHeading from "../components/AboutSection/SectionHeading/SectionHeading";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

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

      <SectionHeading text="Nasze wartości" />

      {values.map((v) => (
        <div key={v.label}>
          <Subtitle>{v.label}</Subtitle>
          <TextColumn align="left" paragraphs={[v.text]} />
        </div>
      ))}

      <SectionHeading text="Nasza filozofia" align="right" />
      <TextColumn align="right" paragraphs={philosophy.right} />

      <div className={styles.spacer} />

      <Subtitle>{summary}</Subtitle>
      <ScrollToTop />
    </main>
  );
}
