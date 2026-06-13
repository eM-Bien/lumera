import { Cinzel, Montserrat } from "next/font/google";
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
  {
    city: "Sierpc",
    address: ["ul. Przykładowa 12", "09-200 Sierpc"],
  },
  {
    city: "Łódź",
    address: ["ul. Przykładowa 34", "90-001 Łódź"],
  },
];

export default function ContactPage() {
  return (
    <main
      className={`${styles.kontakt} ${cinzel.variable} ${montserrat.variable}`}
    >
      {/* tło — wideo na cały ekran */}
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster="/kontakt/poster.jpg"
        aria-hidden="true"
      >
        {/* <source src="/kontakt/tlo.webm" type="video/webm" /> */}
        <source src="/kontakt/tlo.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Kontakt</h1>
          <p className={styles.subtitle}>Zapraszamy do naszych gabinetów</p>
        </header>

        {/* dwie lokalizacje */}
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

        {/* wspólny telefon + email (te same dla obu lokali) */}
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
