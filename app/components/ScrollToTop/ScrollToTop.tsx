// components/ScrollToTop/ScrollToTop.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // sentinel = pierwszy viewport; widoczny → jesteśmy na górze → chowamy
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // znika sama dzięki observerowi, gdy sentinel wróci do widoku
  };

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.button} ${visible ? styles.visible : ""}`}
        onClick={handleClick}
        aria-label="Przewiń na górę strony"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M12 19V5M12 5l-6 6M12 5l6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
