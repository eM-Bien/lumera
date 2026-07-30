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
      <input
        type="search"
        className={styles.search}
        placeholder="Szukaj zabiegu po nazwie…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Szukaj zabiegu po nazwie"
      />

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
