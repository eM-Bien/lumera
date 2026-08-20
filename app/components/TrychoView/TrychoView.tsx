"use client";

import { useMemo, useState } from "react";
import { normalize, type Location } from "../OfferExplorer/offer-types";
import OfferControls from "../OfferControls/OfferControls";
import OfferCard from "../OfferCard/OfferCard";
import {
  TRYCHO_TREATMENTS,
  TRYCHO_WSKAZANIA,
  TRYCHO_PRZECIWWSKAZANIA,
} from "../OfferExplorer/trycho-types";
import styles from "./TrychoView.module.css";

export default function TrychoView() {
  const [query, setQuery] = useState("");
  const [activeLoc, setActiveLoc] = useState<Set<Location>>(new Set());
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleLocation = (loc: Location) => {
    setActiveLoc((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  };

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return TRYCHO_TREATMENTS.filter((t) => {
      const matchesQuery = q === "" || normalize(t.title).includes(q);
      const matchesLocation =
        activeLoc.size === 0 || t.locations.some((loc) => activeLoc.has(loc));
      return matchesQuery && matchesLocation;
    });
  }, [query, activeLoc]);

  return (
    <div className={styles.view}>
      <div className={styles.controlsWrap}>
        <OfferControls
          query={query}
          onQueryChange={setQuery}
          activeLoc={activeLoc}
          onToggleLocation={toggleLocation}
        />
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          Brak zabiegów dla tych kryteriów. Zmień wyszukiwanie lub odznacz
          filtry.
        </p>
      ) : (
        <ul className={styles.list}>
          {filtered.map((t, i) => (
            <OfferCard
              key={t.id}
              offer={{ ...t, category: "Trychologia" }}
              reversed={i % 2 === 1}
              open={openIds.has(t.id)}
              onToggle={() => toggleOpen(t.id)}
            />
          ))}
        </ul>
      )}

      <div className={styles.panelsWrap}>
        <div className={styles.panels}>
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Wskazania</h3>
          <ul className={styles.wskazaniaList}>
            {TRYCHO_WSKAZANIA.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Przeciwwskazania</h3>
          <p className={styles.panelText}>{TRYCHO_PRZECIWWSKAZANIA}</p>
        </section>
        </div>
      </div>
    </div>
  );
}
