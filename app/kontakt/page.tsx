"use client";

import { Fragment, useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import LetterBackground from "../components/LetterBackground/LetterBackground";
import styles from "./page.module.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
});

const PHONE = "+48 600 000 000";
const PHONE_HREF = "+48600000000";
const EMAIL = "kontakt@lumera.pl";

const LOCATIONS = [
  { city: "Sierpc", address: ["ul. Przykładowa 12", "09-200 Sierpc"] },
  { city: "Łódź", address: ["ul. Przykładowa 34", "90-001 Łódź"] },
];

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/lumera.studio",
    icon: "/icons/insta.svg",
    label: "@lumera.studio",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/lumera.studio",
    icon: "/icons/facebook.svg",
    label: "/lumera.studio",
  },
];

export default function ContactPage() {
  // opóźnione pojawienie LetterBackground — czeka na font
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={styles.contact}>
      {/* tło — litera odbita w wodzie + kwiaty, przesunięta w prawo i niżej */}
      {ready && (
        <LetterBackground
          fontFamily={cinzel.style.fontFamily}
          gold={[240, 235, 235]}
          scale={1}
          letterFrac={0.45}
          offsetX="24vw"
          offsetY="10vh"
        />
      )}

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Do zobaczenia w Lumera</h1>
          <p className={styles.subtitle}>
            Wybierz lokalizację i zarezerwuj chwilę tylko dla siebie
          </p>
        </header>

        {/* telefon + email — wyróżnione */}
        <div className={styles.shared}>
          <a className={styles.contactLink} href={`tel:${PHONE_HREF}`}>
            {PHONE}
          </a>
        </div>
        <div className={styles.shared}>
          <a className={styles.contactLink} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>

        {/* lokalizacje — obok siebie, rozdzielone kropką */}
        <div className={styles.locations}>
          {LOCATIONS.map((loc, i) => (
            <Fragment key={loc.city}>
              {i > 0 && (
                <span className={styles.locDivider} aria-hidden="true">
                  ·
                </span>
              )}
              <section className={styles.location}>
                <h2 className={styles.city}>{loc.city}</h2>
                <address className={styles.address}>
                  {loc.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </section>
            </Fragment>
          ))}
        </div>

        <footer className={styles.social}>
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              className={styles.socialLink}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.socialIcon} src={s.icon} alt="" />
              <span className={styles.socialLabel}>{s.label}</span>
            </a>
          ))}
        </footer>
      </div>
    </main>
  );
}
