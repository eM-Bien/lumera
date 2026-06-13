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
      <div className={styles.scrim} aria-hidden="true" />

      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="Witamy w Lumera" />
      </section>

      <section className={styles.subtitleWrapper}>
        <p className={styles.subtitle}>
          Lumera to miejsce stworzone z pasji do świadomej pielęgnacji oraz
          holistycznego podejścia do zdrowia i piękna.
        </p>
      </section>

      <section className={`${styles.block} ${styles.left}`}>
        <div className={styles.column}>
          <ScrollReveal
            as="p"
            className={styles.p}
            text="Wierzymy, że prawdziwa harmonia zaczyna się od uważności na potrzeby własnego ciała i umysłu."
          />
          <ScrollReveal
            as="p"
            className={styles.p}
            text="Powstaliśmy z potrzeby tworzenia przestrzeni, w której profesjonalna wiedza spotyka się z troską, a każda osoba może poczuć się wysłuchana, zaopiekowana i zrozumiana."
          />
        </div>
      </section>

      <section className={`${styles.block} ${styles.right}`}>
        <div className={styles.column}>
          <ScrollReveal
            as="p"
            className={styles.p}
            text="Naszą misją jest wspieranie w odzyskiwaniu równowagi oraz budowaniu zdrowych nawyków pielęgnacyjnych. Łączymy nowoczesne podejście kosmetologiczne i trychologiczne z indywidualnym spojrzeniem na potrzeby każdego człowieka."
          />
          <ScrollReveal
            as="p"
            className={styles.p}
            text="W Lumera nie wierzymy w uniwersalne rozwiązania. Każda skóra, każda skóra głowy i każda historia są wyjątkowe. Dlatego stawiamy na konsultację, edukację i pielęgnację dopasowaną do Ciebie."
          />
          <ScrollReveal
            as="p"
            className={styles.p}
            text="Tworzymy miejsce, w którym możesz zwolnić, odetchnąć i oddać się rytuałom opartym na wiedzy, doświadczeniu i autentycznej trosce."
          />
        </div>
      </section>

      <div className={styles.spacer} />
    </main>
  );
}
