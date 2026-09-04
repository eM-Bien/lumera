"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import { EBOOKS, formatPrice } from "@/app/components/Ebooks/ebook-types";
import CheckoutSteps from "@/app/components/CheckoutSteps/CheckoutSteps";
import EmptyCart from "../components/Ebooks/Cart/EmptyCart/EmptyCart";
import PrimaryButton from "../components/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../components/Buttons/SecondaryButton/SecondaryButton";
import { DecorativeSubtitle } from "../components/PageHeader/Typography";

export default function CartPage() {
  const { navigate } = useTransition();
  const { items, totalCount, totalPrice, removeItem, updateQty, hydrated } =
    useCart();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDelivery, setAcceptDelivery] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSavings = items.reduce((sum, i) => {
    const ebook = EBOOKS.find((e) => e.id === i.id);
    const reg = ebook?.regularPrice;
    return reg != null && reg > i.price ? sum + (reg - i.price) * i.qty : sum;
  }, 0);

  const isEmpty = hydrated && items.length === 0;
  const canPay =
    acceptTerms && acceptDelivery && items.length > 0 && !loading;

  const handlePay = async () => {
    if (!canPay) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          marketing: acceptMarketing,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Błąd płatności");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Coś poszło nie tak");
      setLoading(false);
    }
  };

  return (
    <div className={styles.cart}>
      {!hydrated && (
        <div className={styles.loading}>
          <p>Wczytywanie koszyka…</p>
        </div>
      )}

      {isEmpty && <EmptyCart />}

      {hydrated && items.length > 0 && (
        <>
          <div className={styles.headerReveal}>
            <CheckoutSteps current={1} />
            <header className={styles.head}>
              <DecorativeSubtitle>Gotowe do zakupu</DecorativeSubtitle>
            </header>
          </div>

          <div className={styles.content}>
            <ul className={styles.items}>
              {items.map((item) => {
                const ebook = EBOOKS.find((e) => e.id === item.id);
                return (
                <li key={item.id} className={styles.item}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.cover}
                    src={ebook?.cover ?? item.cover}
                    alt={item.title}
                  />

                  <div className={styles.itemBody}>
                    <h2 className={styles.itemTitle}>{item.title}</h2>
                    <span className={styles.itemPrice}>
                      {ebook?.regularPrice != null &&
                        ebook.regularPrice > item.price && (
                          <span className={styles.itemRegularPrice}>
                            {formatPrice(ebook.regularPrice * item.qty)}
                          </span>
                        )}
                      {formatPrice(item.price * item.qty)}
                    </span>
                    <p className={styles.itemMeta}>
                      {ebook ? `${ebook.details.pages} stron · ` : ""}Format PDF ·
                      dostęp dożywotni
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
                );
              })}
            </ul>

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

                {totalSavings > 0 && (
                  <div className={`${styles.row} ${styles.savingsRow}`}>
                    <span>Oszczędzasz:</span>
                    <span>−{formatPrice(totalSavings)}</span>
                  </div>
                )}

                <div className={styles.row}>
                  <span>Koszt dostawy:</span>
                  <span>{formatPrice(0)}</span>
                </div>

                <div className={styles.rowTotal}>
                  <span>Do zapłaty:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <p className={styles.vatNote}>Cena zawiera podatek VAT (5%)</p>

                <div className={styles.consents}>
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span>
                      Akceptuję{" "}
                      <a
                        href="/regulamin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        Regulamin sklepu
                      </a>{" "}
                      oraz zapoznałam/em się z{" "}
                      <a
                        href="/polityka-prywatnosci"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        Polityką prywatności
                      </a>
                      .<span className={styles.req}>*</span>
                    </span>
                  </label>

                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={acceptDelivery}
                      onChange={(e) => setAcceptDelivery(e.target.checked)}
                    />
                    <span>
                      Wyrażam zgodę na natychmiastowe dostarczenie e-booka i
                      przyjmuję do wiadomości, że po jego dostarczeniu utracę
                      prawo odstąpienia od umowy.
                      <span className={styles.req}>*</span>
                    </span>
                  </label>

                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={acceptMarketing}
                      onChange={(e) => setAcceptMarketing(e.target.checked)}
                    />
                    <span>
                      Chcę otrzymywać od Lumery e-maile z poradami dotyczącymi
                      pielęgnacji, nowościami i specjalnymi ofertami. Zgodę mogę
                      wycofać w każdej chwili.
                    </span>
                  </label>
                </div>

                <p className={styles.required}>* pola wymagane do zakupu</p>

                {error && <p className={styles.error}>{error}</p>}

                <PrimaryButton
                  fullWidth
                  className={styles.payBtn}
                  onClick={handlePay}
                  disabled={!canPay}
                >
                  {loading ? "Przekierowanie…" : "Kupuję i płacę"}
                </PrimaryButton>

                <SecondaryButton
                  className={styles.secondary}
                  onClick={() => navigate("/ebooki")}
                  fullWidth
                >
                  Kontynuuj zakupy
                </SecondaryButton>

                <p className={styles.note}>
                  Płatność obsługuje Stripe — zostaniesz przekierowany na
                  bezpieczną stronę płatności.
                </p>

                <ul className={styles.perks}>
                  <li>Bezpieczna płatność elektroniczna</li>
                  <li>Dostęp do plików od razu po zakupie</li>
                  <li>Dożywotni dostęp</li>
                </ul>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
