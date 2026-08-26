"use client";

import { useMemo, useState } from "react";
import { OFFERS, normalize, type Location } from "./offer-types";
import OfferControls from "../OfferControls/OfferControls";
import OfferCard from "../OfferCard/OfferCard";
import styles from "./OfferExplorer.module.css";

export default function OfferExplorer() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(OFFERS.map((o) => o.id)),
  );
  const [activeLoc, setActiveLoc] = useState<Set<Location>>(new Set());

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
    return OFFERS.filter((o) => {
      const matchesQuery = q === "" || normalize(o.title).includes(q);
      const matchesLocation =
        activeLoc.size === 0 || o.locations.some((loc) => activeLoc.has(loc));
      return matchesQuery && matchesLocation;
    });
  }, [query, activeLoc]);

  return (
    <div className={styles.explorer}>
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
          {filtered.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              reversed={i % 2 === 1}
              leafVariant={i}
              open={openIds.has(offer.id)}
              onToggle={() => toggleOpen(offer.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
