"use client";

import { useMemo, useState } from "react";
import { OFFERS, normalize, type Category, type Location } from "./offer-types";
import OfferControls from "../OfferControls/OfferControls";
import OfferCard from "../OfferCard/OfferCard";
import styles from "./OfferExplorer.module.css";

export default function OfferExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<Category>>(new Set());
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [activeLoc, setActiveLoc] = useState<Set<Location>>(new Set());

  const toggleLocation = (loc: Location) => {
    setActiveLoc((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  };

  const toggleFilter = (cat: Category) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
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
      const matchesCategory = active.size === 0 || active.has(o.category);
      // lokalizacja: zabieg pasuje, jeśli MA którąś z zaznaczonych lokalizacji
      const matchesLocation =
        activeLoc.size === 0 || o.locations.some((loc) => activeLoc.has(loc));
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [query, active, activeLoc]);

  return (
    <div className={styles.explorer}>
      <OfferControls
        query={query}
        onQueryChange={setQuery}
        active={active}
        onToggleFilter={toggleFilter}
        activeLoc={activeLoc}
        onToggleLocation={toggleLocation}
      />

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
              open={openIds.has(offer.id)}
              onToggle={() => toggleOpen(offer.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
