"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import CheckoutSteps from "@/app/components/CheckoutSteps/CheckoutSteps";
import PrimaryButton from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import SuccessGraphic from "./SuccessGraphic";
import styles from "./page.module.css";

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

  const goContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/kontakt");
  };

  return (
    <section className={styles.success}>
      <span className={styles.bgWrap} aria-hidden="true">
        <SuccessGraphic className={styles.bgIcon} />
      </span>

      <div className={styles.stepsWrap}>
        <CheckoutSteps current={3} size="compact" />
      </div>

      <div className={styles.inner}>
        <h1 className={styles.title}>Dziękujemy!</h1>
        <p className={styles.subtitle}>Płatność przyjęta</p>
        <p className={styles.text}>
          Link do pobrania plików wysłaliśmy na podany adres e-mail. Jeśli
          wiadomość nie dotarła w ciągu kilku minut, sprawdź folder spam.
        </p>

        <p className={styles.contact}>
          Coś poszło nie tak?{" "}
          <a href="/kontakt" className={styles.link} onClick={goContact}>
            Skontaktuj się z nami
          </a>
        </p>

        <div className={styles.actions}>
          <PrimaryButton onClick={() => navigate("/")}>
            Strona główna
          </PrimaryButton>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate("/ebooki")}
          >
            Przeglądaj ebooki
          </button>
        </div>
      </div>
    </section>
  );
}
