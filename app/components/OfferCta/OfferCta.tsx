"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import PrimaryButton from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import styles from "./OfferCta.module.css";

export default function OfferCta() {
  const { navigate } = useTransition();

  return (
    <section className={styles.cta} aria-labelledby="offer-cta-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Nie wiesz na co się zdecydować?</p>
        <h2 id="offer-cta-title" className={styles.title}>
          Umów się na konsultację
        </h2>
        <p className={styles.text}>
          Dobierzemy zabieg do Twoich potrzeb i skóry. Napisz lub zadzwoń —
          pomożemy wybrać to, co sprawdzi się najlepiej.
        </p>
        <PrimaryButton
          className={styles.button}
          onClick={() => navigate("/kontakt")}
        >
          Skontaktuj się
        </PrimaryButton>
      </div>
    </section>
  );
}
