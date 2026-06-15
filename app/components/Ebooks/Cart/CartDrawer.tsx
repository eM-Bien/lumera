"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { formatPrice } from "../ebook-types";
import styles from "./CartDrawer.module.css";

// poprawna polska odmiana: 1 produkt / 2–4 produkty / 5+ produktów
function pluralProdukt(n: number): string {
  if (n === 1) return "produkt";
  const ones = n % 10;
  const tens = n % 100;
  if (ones >= 2 && ones <= 4 && (tens < 10 || tens >= 20)) return "produkty";
  return "produktów";
}

export default function CartDrawer() {
  const { isOpen, lastAdded, totalCount, totalPrice, closeCart } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape zamyka
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  // blokada scrolla tła, gdy drawer otwarty
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // focus na panel po otwarciu (dostępność)
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-hidden={!isOpen}
        tabIndex={-1}
      >
        <div className={styles.header}>
          <span className={styles.badge} aria-hidden="true">
            ✓
          </span>
          <h2 id="cart-drawer-title" className={styles.heading}>
            Dodano do koszyka
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={closeCart}
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        {lastAdded && (
          <div className={styles.product}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.cover}
              src={lastAdded.cover}
              alt={lastAdded.title}
            />
            <div className={styles.info}>
              <p className={styles.productTitle}>{lastAdded.title}</p>
              <p className={styles.productPrice}>
                {formatPrice(lastAdded.price)}
              </p>
            </div>
          </div>
        )}

        <p className={styles.summary}>
          Masz {totalCount} {pluralProdukt(totalCount)} w koszyku · Razem{" "}
          <strong>{formatPrice(totalPrice)}</strong>
        </p>

        <div className={styles.actions}>
          <Link href="/koszyk" className={styles.primary} onClick={closeCart}>
            Przejdź do koszyka
          </Link>
          <button
            type="button"
            className={styles.secondary}
            onClick={closeCart}
          >
            Kontynuuj zakupy
          </button>
        </div>

        <p className={styles.note}>
          Płatność elektroniczna · dostęp do pliku od razu po zakupie
        </p>
      </aside>
    </>
  );
}
