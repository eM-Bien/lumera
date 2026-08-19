"use client";

import { useMemo, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { normalize, type Location } from "../OfferExplorer/offer-types";
import OfferControls from "../OfferControls/OfferControls";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import {
  TRYCHO_TREATMENTS,
  TRYCHO_WSKAZANIA,
  TRYCHO_PRZECIWWSKAZANIA,
} from "../OfferExplorer/trycho-types";
import styles from "./TrychoView.module.css";

export default function TrychoView() {
  const { navigate } = useTransition();
  const [query, setQuery] = useState("");
  const [activeLoc, setActiveLoc] = useState<Set<Location>>(new Set());

  const toggleLocation = (loc: Location) => {
    setActiveLoc((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
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
      <OfferControls
        query={query}
        onQueryChange={setQuery}
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
          {filtered.map((t) => (
            <li key={t.id} className={styles.card}>
              <span className={styles.locations}>
                {t.locations.join(" · ")}
              </span>
              <h3 className={styles.cardTitle}>{t.title}</h3>
              <span className={styles.price}>{t.price}</span>
              <p className={styles.desc}>{t.description}</p>
              <div className={styles.actions}>
                <PrimaryButton
                  onClick={() => navigate(`/kontakt?zabieg=${t.id}`)}
                >
                  Umów
                </PrimaryButton>
              </div>
            </li>
          ))}
        </ul>
      )}

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
          <p className={styles.desc}>{TRYCHO_PRZECIWWSKAZANIA}</p>
        </section>
      </div>
    </div>
  );
}
