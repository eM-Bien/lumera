"use client";

import { useRef, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { PRICING, treatmentId } from "./pricing-data";
import styles from "./PriceList.module.css";

// Krótsze etykiety na zakładki (pełne tytuły zostają w nagłówkach grup).
const TAB_LABELS: Record<string, string> = {
  twarz: "Twarz",
  cialo: "Ciało",
  trychologia: "Trychologia",
  "medycyna-estetyczna": "Medycyna estetyczna",
  "depilacja-laserowa": "Depilacja",
  "drobne-uslugi": "Drobne usługi",
};

export default function PriceList() {
  const { navigate } = useTransition();
  const [activeId, setActiveId] = useState(PRICING[0]?.id);
  const group = PRICING.find((g) => g.id === activeId) ?? PRICING[0];

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectTab = (id: string) => {
    setActiveId(id);
    // Na wąskim ekranie zakładki się przewijają — pokaż wybraną w całości.
    tabRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <div className={styles.pricing}>
      <div className={styles.menu}>
        <div className={styles.tabsWrap}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Kategorie zabiegów"
          >
            {PRICING.map((g) => {
              const selected = g.id === activeId;
              return (
                <button
                  key={g.id}
                  id={`tab-${g.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="pricing-panel"
                  ref={(el) => {
                    tabRefs.current[g.id] = el;
                  }}
                  className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                  onClick={() => selectTab(g.id)}
                >
                  {TAB_LABELS[g.id] ?? g.title}
                </button>
              );
            })}
            <span className={styles.tabsFill} aria-hidden="true" />
          </div>
        </div>

        <section
          id="pricing-panel"
          role="tabpanel"
          aria-labelledby={`tab-${group.id}`}
          className={styles.panel}
          aria-live="polite"
        >
          <div className={styles.groupHead}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            {group.subtitle && (
              <p className={styles.groupSubtitle}>{group.subtitle}</p>
            )}
            <span className={styles.ornament} aria-hidden="true">
              ✦
            </span>
          </div>

          <div className={styles.list} key={group.id}>
            {group.items.map((item, i) => {
              const href = `/kontakt?zabieg=${treatmentId(group.id, item.name)}`;
              return (
                <article
                  key={item.name}
                  className={styles.item}
                  role="button"
                  tabIndex={0}
                  aria-label={`Umów: ${item.name}`}
                  onClick={() => navigate(href)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(href);
                    }
                  }}
                  style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                >
                  <div className={styles.row}>
                    <h3 className={styles.name}>{item.name}</h3>
                    {item.price && (
                      <>
                        <span className={styles.leader} aria-hidden="true" />
                        <span className={styles.price}>{item.price}</span>
                      </>
                    )}
                  </div>
                  {item.note && <p className={styles.note}>{item.note}</p>}
                  {item.variants && (
                    <ul className={styles.variants}>
                      {item.variants.map((v) => (
                        <li key={v.label} className={styles.variant}>
                          <span className={styles.variantLabel}>{v.label}</span>
                          <span className={styles.leader} aria-hidden="true" />
                          <span className={styles.variantPrice}>{v.price}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className={styles.bookHint} aria-hidden="true">
                    Umów
                    <span className={styles.bookArrow}>→</span>
                  </span>
                </article>
              );
            })}
          </div>

          {group.footnote && (
            <p className={styles.footnote}>{group.footnote}</p>
          )}
        </section>
      </div>
    </div>
  );
}
