"use client";

import { useState } from "react";
import OfferExplorer from "../OfferExplorer/OfferExplorer";
import TrychoView from "../TrychoView/TrychoView";
import styles from "./OfferTabs.module.css";

type Tab = "kosmetyczne" | "trychologiczne";

export default function OfferTabs() {
  const [tab, setTab] = useState<Tab>("kosmetyczne");

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Rodzaj zabiegów">
        <button
          type="button"
          role="tab"
          id="tab-kosmetyczne"
          aria-selected={tab === "kosmetyczne"}
          aria-controls="panel-kosmetyczne"
          className={`${styles.tab} ${tab === "kosmetyczne" ? styles.tabActive : ""}`}
          onClick={() => setTab("kosmetyczne")}
        >
          Twarz i ciało
        </button>
        <button
          type="button"
          role="tab"
          id="tab-trychologiczne"
          aria-selected={tab === "trychologiczne"}
          aria-controls="panel-trychologiczne"
          className={`${styles.tab} ${tab === "trychologiczne" ? styles.tabActive : ""}`}
          onClick={() => setTab("trychologiczne")}
        >
          Trychologia
        </button>
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
