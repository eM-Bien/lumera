"use client";

import { CATEGORIES, type Category } from "../OfferExplorer/offer-types";
import styles from "./OfferControls.module.css";

type OfferControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  active: Set<Category>;
  onToggleFilter: (cat: Category) => void;
};

export default function OfferControls({
  query,
  onQueryChange,
  active,
  onToggleFilter,
}: OfferControlsProps) {
  return (
    <div className={styles.controls}>
      <input
        type="search"
        className={styles.search}
        placeholder="Szukaj zabiegu po nazwie…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Szukaj zabiegu po nazwie"
      />

      <div
        className={styles.filters}
        role="group"
        aria-label="Filtruj kategorie"
      >
        {CATEGORIES.map((cat) => {
          const on = active.has(cat);
          return (
            <button
              key={cat}
              type="button"
              className={`${styles.chip} ${on ? styles.chipActive : ""}`}
              aria-pressed={on}
              onClick={() => onToggleFilter(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
