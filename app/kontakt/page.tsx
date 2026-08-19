"use client";

import { Suspense, useEffect, useState } from "react";
import { Cinzel } from "next/font/google";
import LetterBackground from "../components/LetterBackground/LetterBackground";
import ContactForm from "../components/ContactForm/ContactForm";
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
  { city: "Sierpc", street: "ul. Przykładowa 12", zip: "09-200" },
  { city: "Łódź", street: "ul. Przykładowa 34", zip: "90-001" },
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
          offsetY="2vh"
        />
      )}

      <div className={styles.grid}>
        {/* LEWA — kontakt (zadzwoń/napisz) nad panelem, panel do dołu */}
        <div className={styles.formCol}>
          <div className={styles.reach}>
            <a className={styles.reachItem} href={`tel:${PHONE_HREF}`}>
              <span className={styles.reachLabel}>Zadzwoń</span>
              <span className={styles.reachValue}>{PHONE}</span>
            </a>
            <a className={styles.reachItem} href={`mailto:${EMAIL}`}>
              <span className={styles.reachLabel}>Napisz</span>
              <span className={styles.reachValue}>{EMAIL}</span>
            </a>
          </div>

          <div className={styles.formWrap}>
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>

        {/* PRAWA — adresy pod grafiką */}
        <div className={styles.infoCol}>
          <div className={styles.infoBottom}>
            <div className={styles.locations}>
              {LOCATIONS.map((loc) => (
                <section className={styles.location} key={loc.city}>
                  <h2 className={styles.city}>{loc.city}</h2>
                  <address className={styles.address}>
                    <span>{loc.street}</span>
                    <span>{loc.zip}</span>
                  </address>
                </section>
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
        </div>
      </div>
    </main>
  );
}
