"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import { formatPrice } from "@/app/components/Ebooks/ebook-types";
import styles from "./page.module.css";

function pluralProdukt(n: number): string {
  if (n === 1) return "produkt";
  const ones = n % 10;
  const tens = n % 100;
  if (ones >= 2 && ones <= 4 && (tens < 10 || tens >= 20)) return "produkty";
  return "produktów";
}

export default function CartPage() {
  const { navigate } = useTransition();
  const { items, totalCount, totalPrice, removeItem, hydrated } = useCart();

  const isEmpty = hydrated && items.length === 0;

  const handleCheckout = () => {
    // TODO: podłączyć bramkę płatności (np. Przelewy24 / Stripe)
    navigate("/platnosc");
  };

  return (
    <div className={styles.cart}>
      <header className={styles.head}>
        <h1 className={styles.title}>Koszyk</h1>
        <p className={styles.subtitle}>Jeszcze tylko krok</p>
      </header>

      {/* przed hydratacją — żeby nie mignął pusty stan */}
      {!hydrated && (
        <div className={styles.loading}>
          <p>Wczytywanie koszyka…</p>
        </div>
      )}

      {isEmpty && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Twój koszyk jest pusty</p>
          <p className={styles.emptyText}>
            Zajrzyj do ebooków — może coś dla Ciebie tam czeka.
          </p>
          <button
            type="button"
            className={styles.primary}
            onClick={() => navigate("/ebooki")}
          >
            Przeglądaj ebooki
          </button>
        </div>
      )}

      {hydrated && items.length > 0 && (
        <div className={styles.content}>
          {/* --- Lista pozycji --- */}
          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.cover}
                  src={item.cover}
                  alt={item.title}
                />

                <div className={styles.itemBody}>
                  <h2 className={styles.itemTitle}>{item.title}</h2>
                  <p className={styles.itemMeta}>
                    Format PDF · dostęp dożywotni
                  </p>
                  {item.qty > 1 && (
                    <p className={styles.itemQty}>Ilość: {item.qty}</p>
                  )}
                </div>

                <div className={styles.itemRight}>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.qty)}
                  </span>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Usuń „${item.title}" z koszyka`}
                  >
                    Usuń
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* --- Podsumowanie --- */}
          <aside className={styles.aside}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Podsumowanie</h2>

              <div className={styles.row}>
                <span>
                  Produkty ({totalCount} {pluralProdukt(totalCount)})
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className={styles.rowTotal}>
                <span>Razem do zapłaty</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <p className={styles.vatNote}>Cena zawiera podatek VAT</p>

              <button
                type="button"
                className={styles.primary}
                onClick={handleCheckout}
              >
                Przejdź do płatności
              </button>

              <button
                type="button"
                className={styles.secondary}
                onClick={() => navigate("/ebooki")}
              >
                Kontynuuj zakupy
              </button>

              <ul className={styles.perks}>
                <li>Bezpieczna płatność elektroniczna</li>
                <li>Dostęp do plików od razu po zakupie</li>
                <li>Dożywotni dostęp — czytaj, kiedy chcesz</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
