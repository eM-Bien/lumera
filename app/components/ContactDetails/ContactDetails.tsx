"use client";

import Link from "next/link";
import { useTransition } from "@/app/transition/TransitionProvider";
import {
  EMAIL,
  LOCATIONS,
  PHONE,
  PHONE_HREF,
  SOCIALS,
} from "@/app/contact-info";
import styles from "./ContactDetails.module.css";

const LEGAL = [
  { href: "/regulamin", name: "Regulamin" },
  { href: "/polityka-prywatnosci", name: "Polityka prywatności" },
];

function mapsHref(street: string, zip: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Lumera, ${street}, ${zip} ${city}`,
  )}`;
}

/** Link wewnętrzny z przejściem strony (jak w nawigacji). */
function InternalLink({ href, children }: { href: string; children: string }) {
  const { navigate } = useTransition();
  return (
    <Link
      href={href}
      className={styles.link}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}

/**
 * Dane kontaktowe Lumery (strona /kontakt): studia, telefon i e-mail,
 * media społecznościowe oraz dokumenty — cztery kolumny pod separatorem.
 */
export default function ContactDetails() {
  return (
    <section className={styles.details} aria-label="Dane kontaktowe">
      <div className={styles.divider} aria-hidden="true">
        <span>✦</span>
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.heading}>Studia</h2>
          <ul className={styles.list}>
            {LOCATIONS.map((loc) => (
              <li key={loc.city} className={styles.place}>
                <span className={styles.city}>{loc.city}</span>
                <a
                  className={styles.link}
                  href={mapsHref(loc.street, loc.zip, loc.city)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {loc.street}, {loc.zip}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Kontakt</h2>
          <ul className={styles.list}>
            <li>
              <a className={styles.link} href={`tel:${PHONE_HREF}`}>
                {PHONE}
              </a>
            </li>
            <li>
              <a className={styles.link} href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Obserwuj nas</h2>
          <ul className={styles.list}>
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  className={styles.socialRow}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} ${s.label}`}
                >
                  <span className={styles.social} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt="" />
                  </span>
                  <span className={styles.link}>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Dokumenty">
          <h2 className={styles.heading}>Informacje</h2>
          <ul className={styles.list}>
            {LEGAL.map((p) => (
              <li key={p.href}>
                <InternalLink href={p.href}>{p.name}</InternalLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
