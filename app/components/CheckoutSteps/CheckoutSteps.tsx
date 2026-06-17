import { Fragment } from "react";
import styles from "./CheckoutSteps.module.css";

const STEPS = ["Koszyk", "Podsumowanie", "Potwierdzenie"];

type CheckoutStepsProps = {
  current: number; // 1 = Koszyk, 2 = Podsumowanie, 3 = Potwierdzenie
  size?: "title" | "compact"; // title = aktywny krok jako nagłówek; compact = równy pasek
};

export default function CheckoutSteps({
  current,
  size = "title",
}: CheckoutStepsProps) {
  return (
    <nav
      className={`${styles.steps} ${
        size === "compact" ? styles.compact : styles.title
      }`}
      aria-label="Postęp zamówienia"
    >
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isActive = n === current;
        const state = isActive
          ? styles.active
          : n < current
            ? styles.done
            : styles.todo;

        return (
          <Fragment key={label}>
            {i > 0 && (
              <span className={styles.sep} aria-hidden="true">
                →
              </span>
            )}
            {isActive && size === "title" ? (
              // aktywny krok pełni rolę nagłówka strony (h1)
              <h1 className={`${styles.step} ${state}`} aria-current="step">
                {label}
              </h1>
            ) : (
              <span
                className={`${styles.step} ${state}`}
                aria-current={isActive ? "step" : undefined}
              >
                {label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
