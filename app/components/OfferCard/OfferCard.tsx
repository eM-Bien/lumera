"use client";

import type { Offer } from "../OfferExplorer/offer-types";
import styles from "./OfferCard.module.css";

type OfferCardProps = {
  offer: Offer;
  /** true = zdjęcie po prawej stronie (co druga karta) */
  reversed?: boolean;
  open: boolean;
  onToggle: () => void;
};

export default function OfferCard({
  offer,
  reversed = false,
  open,
  onToggle,
}: OfferCardProps) {
  return (
    <li className={`${styles.card} ${reversed ? styles.cardRight : ""}`}>
      <div className={styles.media}>
        {offer.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={offer.image} alt={offer.title} className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>{offer.category}</span>
        <span className={styles.locations}>{offer.locations.join(" · ")}</span>
        <h3 className={styles.cardTitle}>{offer.title}</h3>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          onClick={onToggle}
        >
          {open ? "Zwiń opis" : "Pokaż opis"}
          <span
            className={`${styles.toggleIcon} ${open ? styles.toggleIconOpen : ""}`}
            aria-hidden="true"
          >
            ↓
          </span>
        </button>

        <div className={`${styles.descWrap} ${open ? styles.descOpen : ""}`}>
          <div className={styles.descInner}>
            <p className={styles.desc}>{offer.description}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
