"use client";

import { useState } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import { formatPrice } from "@/app/components/Ebooks/ebook-types";
import CheckoutSteps from "@/app/components/CheckoutSteps/CheckoutSteps";
import PrimaryButton from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import styles from "./page.module.css";

export default function PaymentPage() {
  const { navigate } = useTransition();
  const { items, totalPrice, hydrated } = useCart();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDelivery, setAcceptDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPay = acceptTerms && acceptDelivery && items.length > 0 && !loading;

  const handlePay = async () => {
    if (!canPay) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // wysyłamy TYLKO id + ilość — cenę policzy serwer
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Błąd płatności");
      // redirect na hostowaną stronę Stripe (zewnętrzny URL — bez transition)
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Coś poszło nie tak");
      setLoading(false);
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <div className={styles.pay}>
        <CheckoutSteps current={2} />
        <header className={styles.head}>
          <p className={styles.subtitle}>Koszyk jest pusty</p>
        </header>
        <div className={styles.empty}>
          <PrimaryButton onClick={() => navigate("/ebooki")}>
            Wróć do ebooków
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pay}>
      <CheckoutSteps current={2} />
      <header className={styles.head}>
        <p className={styles.subtitle}>Ostatni krok</p>
      </header>

      <div className={styles.content}>
        {/* --- Podsumowanie --- */}
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.itemName}>
                {item.title}
                {item.qty > 1 && ` × ${item.qty}`}
              </span>
              <span className={styles.itemPrice}>
                {formatPrice(item.price * item.qty)}
              </span>
            </li>
          ))}
          <li className={styles.total}>
            <span>Razem do zapłaty</span>
            <span>{formatPrice(totalPrice)}</span>
          </li>
        </ul>
        <p className={styles.vatNote}>Cena zawiera podatek VAT (5%)</p>

        {/* --- Zgody --- */}
        <div className={styles.consents}>
          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              Akceptuję{" "}
              <a href="/regulamin" target="_blank" className={styles.link}>
                regulamin
              </a>{" "}
              oraz{" "}
              <a
                href="/polityka-prywatnosci"
                target="_blank"
                className={styles.link}
              >
                politykę prywatności
              </a>
              .
            </span>
          </label>

          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={acceptDelivery}
              onChange={(e) => setAcceptDelivery(e.target.checked)}
            />
            <span>
              Żądam dostarczenia treści cyfrowych natychmiast po zakupie i
              przyjmuję do wiadomości, że tracę prawo odstąpienia od umowy.
            </span>
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <PrimaryButton
          fullWidth
          className={styles.payBtn}
          onClick={handlePay}
          disabled={!canPay}
        >
          {loading ? "Przekierowanie…" : "Zapłać i pobierz"}
        </PrimaryButton>

        <button
          type="button"
          className={styles.secondary}
          onClick={() => navigate("/koszyk")}
        >
          Wróć do koszyka
        </button>

        <p className={styles.note}>
          Płatność obsługuje Stripe — zostaniesz przekierowany na bezpieczną
          stronę płatności.
        </p>
      </div>
    </div>
  );
}
