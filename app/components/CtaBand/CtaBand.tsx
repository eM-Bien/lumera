"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import RevealHeading from "../RevealHeading/RevealHeading";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  buttonLabel: string;
  href: string;
};

/**
 * Zamykający pas CTA pełnej szerokości — bez kafelka, z subtelną poświatą.
 * Wspólny dla /zabiegi i /o-lumera.
 */
export default function CtaBand({
  eyebrow,
  title,
  text,
  buttonLabel,
  href,
}: CtaBandProps) {
  const { navigate } = useTransition();

  return (
    <section className={styles.cta} aria-label={title}>
      <div className={styles.inner}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <RevealHeading as="h2" className={styles.title} text={title} />
        {text && <p className={styles.text}>{text}</p>}
        <PrimaryButton
          className={styles.button}
          onClick={() => navigate(href)}
        >
          {buttonLabel}
        </PrimaryButton>
      </div>
    </section>
  );
}
