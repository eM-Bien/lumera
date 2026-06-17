"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import PrimaryButton from "@/app/components/Buttons/PrimaryButton/PrimaryButton";
import EmptyCartGraphic from "./EmptyCartGraphic";
import styles from "./EmptyCart.module.css";

export default function EmptyCart() {
  const { navigate } = useTransition();

  return (
    <section className={styles.empty}>
      <span className={styles.bgWrap} aria-hidden="true">
        <EmptyCartGraphic className={styles.bgIcon} />
      </span>

      <div className={styles.inner}>
        <h1 className={styles.title}>Pusty koszyk</h1>
        <p className={styles.subtitle}>Czeka na pierwszy wybór</p>
        <p className={styles.text}>
          Nie masz tu jeszcze żadnych ebooków. Zajrzyj do oferty — na pewno coś
          dla siebie znajdziesz!
        </p>
        <PrimaryButton
          className={styles.cta}
          onClick={() => navigate("/ebooki")}
        >
          Przeglądaj ebooki
        </PrimaryButton>
      </div>
    </section>
  );
}
