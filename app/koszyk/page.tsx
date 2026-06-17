"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import { formatPrice } from "@/app/components/Ebooks/ebook-types";
import CheckoutSteps from "@/app/components/CheckoutSteps/CheckoutSteps";
import styles from "./page.module.css";
import PrimaryButton from "../components/Buttons/PrimaryButton/PrimaryButton";

export default function CartPage() {
  const { navigate } = useTransition();
  const { items, totalCount, totalPrice, removeItem, updateQty, hydrated } =
    useCart();

  const isEmpty = hydrated && items.length === 0;

  const handleCheckout = () => {
    navigate("/platnosc");
  };

  return (
    <div className={styles.cart}>
      <CheckoutSteps current={1} />
      <header className={styles.head}>
        <p className={styles.subtitle}>Gotowe do zakupu</p>
      </header>

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
          <PrimaryButton onClick={() => navigate("/ebooki")}>
            Przeglądaj ebooki
          </PrimaryButton>
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
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.qty)}
                  </span>
                  <p className={styles.itemMeta}>
                    Format PDF · dostęp dożywotni
                  </p>

                  <div className={styles.controls}>
                    <div className={styles.qty}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Zmniejsz ilość"
                      >
                        −
                      </button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Zwiększ ilość"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeItem(item.id)}
                      aria-label={`Usuń „${item.title}" z koszyka`}
                    >
                      <span className={styles.trashIcon} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* --- Podsumowanie --- */}
          <aside className={styles.aside}>
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Podsumowanie</h2>

              <div className={styles.row}>
                <span>Ilość produktów:</span>
                <span>{totalCount}</span>
              </div>

              <div className={styles.row}>
                <span>Razem:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className={styles.row}>
                <span>Koszt dostawy:</span>
                <span>{formatPrice(0)}</span>
              </div>

              <div className={styles.rowTotal}>
                <span>Do zapłaty:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <p className={styles.vatNote}>Cena zawiera podatek VAT</p>

              <PrimaryButton fullWidth onClick={handleCheckout}>
                Przejdź do płatności
              </PrimaryButton>

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
                <li>Dożywotni dostęp</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
