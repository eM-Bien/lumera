"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { PRICING, treatmentId } from "./pricing-data";
import styles from "./PriceList.module.css";

// Krótsze etykiety na zakładki (pełne tytuły zostają w nagłówkach grup).
const TAB_LABELS: Record<string, string> = {
  "depilacja-laserowa": "Depilacja",
  trychologia: "Trychologia",
  twarz: "Twarz",
  cialo: "Ciało",
};

export default function PriceList() {
  const { navigate } = useTransition();
  const [activeId, setActiveId] = useState(PRICING[0]?.id);
  const group = PRICING.find((g) => g.id === activeId) ?? PRICING[0];

  // Świecący pasek pod aktywną zakładką — pozycja mierzona z realnej
  // szerokości przycisku, więc przesuwa się płynnie mimo różnych długości.
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  const measure = useCallback(() => {
    const el = tabRefs.current[activeId];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeId]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    // Czcionki ładują się asynchronicznie — po ich wczytaniu szerokości
    // etykiet się zmieniają, więc mierzymy ponownie.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div className={styles.pricing}>
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
                type="button"
                role="tab"
                aria-selected={selected}
                ref={(el) => {
                  tabRefs.current[g.id] = el;
                }}
                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                onClick={() => setActiveId(g.id)}
              >
                {TAB_LABELS[g.id] ?? g.title}
              </button>
            );
          })}
          <span
            className={styles.indicator}
            aria-hidden="true"
            style={
              indicator
                ? { left: indicator.left, width: indicator.width, opacity: 1 }
                : { opacity: 0 }
            }
          />
        </div>
      </div>

      <section className={styles.group} aria-live="polite">
        <div className={styles.groupHead}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          {group.subtitle && (
            <p className={styles.groupSubtitle}>{group.subtitle}</p>
          )}
        </div>

        <div className={styles.grid} key={group.id}>
          {group.items.map((item, i) => {
            const href = `/kontakt?zabieg=${treatmentId(group.id, item.name)}`;
            return (
              <article
                key={item.name}
                className={styles.card}
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
                style={{ animationDelay: `${Math.min(i, 10) * 55}ms` }}
              >
                <div className={styles.cardHead}>
                  <h3 className={styles.name}>{item.name}</h3>
                  {item.price && (
                    <span className={styles.priceChip}>{item.price}</span>
                  )}
                </div>
                {item.note && <p className={styles.note}>{item.note}</p>}
                {item.variants && (
                  <ul className={styles.variants}>
                    {item.variants.map((v) => (
                      <li key={v.label} className={styles.variant}>
                        <span className={styles.variantLabel}>{v.label}</span>
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

        {group.footnote && <p className={styles.footnote}>{group.footnote}</p>}
      </section>
    </div>
  );
}
