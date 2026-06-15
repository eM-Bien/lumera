"use client";

import { type Ebook, formatPrice } from "../ebook-types";
import { useCart } from "../Cart/CartContext";
import styles from "./EbookCard.module.css";

type EbookCardProps = {
  ebook: Ebook;
};

export default function EbookCard({ ebook }: EbookCardProps) {
  const { addItem } = useCart();

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.cover} src={ebook.cover} alt={ebook.title} />
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{ebook.title}</h2>
        <p className={styles.tagline}>{ebook.tagline}</p>
        <span className={styles.price}>{formatPrice(ebook.price)}</span>
        <p className={styles.desc}>{ebook.description}</p>

        <div className={styles.forWhom}>
          <span className={styles.forWhomLabel}>Dla kogo</span>
          <ul className={styles.forWhomList}>
            {ebook.forWhom.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <ul className={styles.meta}>
          <li>
            <span className={styles.metaKey}>Format</span>
            {ebook.details.format}
          </li>
          <li>
            <span className={styles.metaKey}>Stron</span>
            {ebook.details.pages}
          </li>
          <li>
            <span className={styles.metaKey}>Język</span>
            {ebook.details.language}
          </li>
        </ul>

        <div className={styles.buy}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => addItem(ebook)}
          >
            Dodaj do koszyka
          </button>
        </div>

        <p className={styles.note}>
          Płatność elektroniczna · dostęp do pliku od razu po zakupie
        </p>
        <p className={styles.note}>Dostęp dożywotni · czytaj, kiedy chcesz</p>
      </div>
    </article>
  );
}
