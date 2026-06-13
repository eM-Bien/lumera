"use client";

import styles from "./page.module.css";
import ScrollReveal from "./ScrollReveal";

export default function AboutPage() {
  return (
    <main className={styles.about}>
      {/* tło — wideo na cały ekran (przyklejone przy scrollu) */}
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster="/about/poster.jpg"
        aria-hidden="true"
      >
        <source src="/about/tlo.mp4" type="video/mp4" />
      </video>
      <div className={styles.vignette} />
      <div className={styles.scrim} aria-hidden="true" />

      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="O Lumera" />
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus."
        />
      </section>

      <section className={`${styles.block} ${styles.right}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus."
        />
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <ScrollReveal
          as="p"
          className={styles.p}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id."
        />
      </section>

      <div className={styles.spacer} />
    </main>
  );
}
