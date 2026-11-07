"use client";

import { useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { PRICING, treatmentId, type PriceGroup } from "./pricing-data";
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

/** Lista pozycji jednej kategorii — wspólna dla zakładek (desktop) i akordeonu (mobile). */
function GroupItems({ group }: { group: PriceGroup }) {
  const { navigate } = useTransition();

  return (
    <>
      <div className={styles.list}>
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

      {group.footnote && <p className={styles.footnote}>{group.footnote}</p>}
    </>
  );
}

export default function PriceList() {
  const [activeId, setActiveId] = useState(PRICING[0]?.id);
  const group = PRICING.find((g) => g.id === activeId) ?? PRICING[0];

  // Akordeon (mobile): sekcje otwierane niezależnie, na start pierwsza.
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(PRICING[0] ? [PRICING[0].id] : []),
  );
  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={styles.pricing}>
      {/* ───── Desktop: zakładki + panel ───── */}
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
                  className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                  onClick={() => setActiveId(g.id)}
                >
                  {TAB_LABELS[g.id] ?? g.title}
                </button>
              );
            })}
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

          <GroupItems key={group.id} group={group} />
        </section>
      </div>

      {/* ───── Mobile: akordeon — kategorie jak rozdziały menu ───── */}
      <div className={styles.accordion}>
        {PRICING.map((g) => {
          const open = openIds.has(g.id);
          return (
            <section
              key={g.id}
              className={`${styles.acc} ${open ? styles.accOpen : ""}`}
            >
              <h2 className={styles.accHeading}>
                <button
                  type="button"
                  id={`acc-${g.id}`}
                  className={styles.accButton}
                  aria-expanded={open}
                  aria-controls={`acc-panel-${g.id}`}
                  onClick={() => toggle(g.id)}
                >
                  <span className={styles.accTitle}>{g.title}</span>
                  <span className={styles.accChevron} aria-hidden="true" />
                </button>
              </h2>
              <div
                id={`acc-panel-${g.id}`}
                role="region"
                aria-labelledby={`acc-${g.id}`}
                className={styles.accBody}
                inert={!open}
              >
                <div className={styles.accInner}>
                  {g.subtitle && (
                    <p className={styles.accSubtitle}>{g.subtitle}</p>
                  )}
                  <GroupItems group={g} />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
