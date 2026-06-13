"use client";

import { useEffect, useState } from "react";
import { Cinzel, Montserrat } from "next/font/google";
import LetterBackground from "../components/LetterBackground/LetterBackground";
import styles from "./page.module.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-montserrat",
});

// wspólne dane — te same w obu lokalizacjach
const PHONE = "+48 600 000 000";
const PHONE_HREF = "+48600000000";
const EMAIL = "kontakt@lumera.pl";

const LOCATIONS = [
  { city: "Sierpc", address: ["ul. Przykładowa 12", "09-200 Sierpc"] },
  { city: "Łódź", address: ["ul. Przykładowa 34", "90-001 Łódź"] },
];

export default function ContactPage() {
  // opóźnione pojawienie LetterBackground (jak na about) — czeka na font
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className={`${styles.kontakt} ${cinzel.variable} ${montserrat.variable}`}
    >
      {/* tło — litera odbita w wodzie + kwiaty */}
      {ready && (
        <LetterBackground
          fontFamily={cinzel.style.fontFamily}
          gold={[240, 235, 235]}
          scale={1}
          letterFrac={0.45}
        />
      )}

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Kontakt</h1>
          <p className={styles.subtitle}>Zapraszamy do naszych gabinetów</p>
        </header>

        <div className={styles.locations}>
          {LOCATIONS.map((loc) => (
            <section key={loc.city} className={styles.location}>
              <h2 className={styles.city}>{loc.city}</h2>
              <address className={styles.address}>
                {loc.address.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </section>
          ))}
        </div>

        <div className={styles.shared}>
          <a className={styles.contactLink} href={`tel:${PHONE_HREF}`}>
            {PHONE}
          </a>
          <span className={styles.divider} aria-hidden="true">
            ·
          </span>
          <a className={styles.contactLink} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
