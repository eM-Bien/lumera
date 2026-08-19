"use client";

import { useState } from "react";
import OfferExplorer from "../OfferExplorer/OfferExplorer";
import TrychoView from "../TrychoView/TrychoView";
import styles from "./OfferTabs.module.css";

type Tab = "kosmetyczne" | "trychologiczne";

const TABS: { id: Tab; label: string }[] = [
  { id: "kosmetyczne", label: "Twarz i ciało" },
  { id: "trychologiczne", label: "Trychologia" },
];

export default function OfferTabs() {
  const [tab, setTab] = useState<Tab>("kosmetyczne");
  const activeIndex = TABS.findIndex((t) => t.id === tab);

  return (
    <div className={styles.wrap}>
      <div className={styles.switcher}>
        <span className={styles.kicker}>Wybierz kategorię</span>
        <div className={styles.tabs} role="tablist" aria-label="Rodzaj zabiegów">
          {TABS.map(({ id, label }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={selected}
                aria-controls={`panel-${id}`}
                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            );
          })}
          <span
            className={styles.indicator}
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {tab === "kosmetyczne" ? (
        <div
          role="tabpanel"
          id="panel-kosmetyczne"
          aria-labelledby="tab-kosmetyczne"
        >
          <OfferExplorer />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="panel-trychologiczne"
          aria-labelledby="tab-trychologiczne"
        >
          <TrychoView />
        </div>
      )}
    </div>
  );
}
