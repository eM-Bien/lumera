"use client";

import { useTransition } from "./TransitionProvider";
import styles from "./TransitionOverlay.module.css";

export default function TransitionOverlay() {
  const { phase } = useTransition();
  return (
    <div
      className={`${styles.overlay} ${phase === "exiting" ? styles.dark : ""}`}
      aria-hidden="true"
    />
  );
}
