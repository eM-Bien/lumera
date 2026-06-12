import styles from "./OfferControls.module.css";
import {
  CATEGORIES,
  LOCATIONS,
  type Category,
  type Location,
} from "../OfferExplorer/offer-types";

type OfferControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  active: Set<Category>;
  onToggleFilter: (cat: Category) => void;
  activeLoc: Set<Location>;
  onToggleLocation: (loc: Location) => void;
};

export default function OfferControls({
  query,
  onQueryChange,
  active,
  onToggleFilter,
  activeLoc,
  onToggleLocation,
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

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Kategoria</span>
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

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Lokalizacja</span>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filtruj lokalizacje"
        >
          {LOCATIONS.map((loc) => {
            const on = activeLoc.has(loc);
            return (
              <button
                key={loc}
                type="button"
                className={`${styles.chip} ${on ? styles.chipActive : ""}`}
                aria-pressed={on}
                onClick={() => onToggleLocation(loc)}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
