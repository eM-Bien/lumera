"use client";

import { useState } from "react";
import OfferExplorer from "../OfferExplorer/OfferExplorer";
import TrychoView from "../TrychoView/TrychoView";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton/SecondaryButton";
import styles from "./OfferTabs.module.css";

type Tab = "kosmetyczne" | "trychologiczne";

const TABS: { id: Tab; label: string }[] = [
  { id: "kosmetyczne", label: "Twarz i ciało" },
  { id: "trychologiczne", label: "Trychologia" },
];

export default function OfferTabs() {
  const [tab, setTab] = useState<Tab>("kosmetyczne");

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Rodzaj zabiegów">
        {TABS.map(({ id, label }) => {
          const selected = tab === id;
          const Btn = selected ? PrimaryButton : SecondaryButton;
          return (
            <Btn
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
            >
              {label}
            </Btn>
          );
        })}
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
