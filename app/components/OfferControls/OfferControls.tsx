import styles from "./OfferControls.module.css";
import { LOCATIONS, type Location } from "../OfferExplorer/offer-types";

type OfferControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  activeLoc: Set<Location>;
  onToggleLocation: (loc: Location) => void;
};

export default function OfferControls({
  query,
  onQueryChange,
  activeLoc,
  onToggleLocation,
}: OfferControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.2-3.2" />
        </svg>
        <input
          type="search"
          className={styles.search}
          placeholder="Wyszukaj zabieg po nazwie…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Wyszukaj zabieg po nazwie"
        />
      </div>

      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>Lokalizacja</span>
        <div className={styles.filters} role="group" aria-label="Lokalizacja">
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
