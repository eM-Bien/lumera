"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import styles from "../page.module.css";

export default function PaymentSuccessPage() {
  const { navigate } = useTransition();
  const { clearCart } = useCart();
  const cleared = useRef(false);

  // po powrocie z udanej płatności czyścimy koszyk (raz)
  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return (
    <div className={styles.pay}>
      <header className={styles.head}>
        <h1 className={styles.title}>Dziękujemy!</h1>
        <p className={styles.subtitle}>Płatność przyjęta</p>
      </header>
      <div className={styles.content}>
        <p className={styles.note} style={{ textAlign: "left" }}>
          Link do pobrania plików wysłaliśmy na podany adres e-mail. Jeśli
          wiadomość nie dotarła w ciągu kilku minut, sprawdź folder spam.
        </p>
        <button
          type="button"
          className={styles.primary}
          onClick={() => navigate("/ebooki")}
        >
          Wróć do ebooków
        </button>
      </div>
    </div>
  );
}
