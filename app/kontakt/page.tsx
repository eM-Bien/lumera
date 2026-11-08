"use client";

import { Suspense, useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import LetterBackground from "../components/LetterBackground/LetterBackground";
import ContactForm from "../components/ContactForm/ContactForm";
import ContactDetails from "../components/ContactDetails/ContactDetails";
import {
  DecorativeSubtitle,
  PageHeading,
} from "../components/PageHeader/Typography";
import styles from "./page.module.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
});

// Strona kontaktu: formularz z literą L w kwiatach, a pod nimi dane
// kontaktowe (studia, telefon, e-mail, social media, dokumenty).
export default function ContactPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
    <section className={styles.contact}>
      {ready && (
        <LetterBackground
          fontFamily={cinzel.style.fontFamily}
          gold={[240, 235, 235]}
          scale={1}
          letterFrac={0.45}
          offsetX="24vw"
          offsetY="2vh"
        />
      )}

      <div className={styles.grid}>
        <div className={styles.formCol}>
          <header className={styles.header}>
            <PageHeading className={styles.title}>Umów wizytę</PageHeading>
            <DecorativeSubtitle className={styles.subtitle}>
              Piękno w harmonii z Tobą
            </DecorativeSubtitle>
          </header>

          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>

    <ContactDetails />
    </main>
  );
}
