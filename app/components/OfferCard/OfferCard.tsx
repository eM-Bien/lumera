"use client";

import { useEffect, useRef } from "react";
import type { Offer } from "../OfferExplorer/offer-types";
import styles from "./OfferCard.module.css";

type OfferCardProps = {
  offer: Offer;
  reversed?: boolean;
  open: boolean;
  onToggle: () => void;
};

export default function OfferCard({
  offer,
  reversed = false,
  open,
  onToggle,
}: OfferCardProps) {
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!media || !img) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // bez parallaxu przy ograniczonym ruchu

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = media.getBoundingClientRect();
      const vh = window.innerHeight;
      // postęp -1..1: -1 gdy ramka tuż nad ekranem, 1 gdy tuż pod
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      // obraz jest 20% wyższy (skala w CSS), więc ma 10% zapasu w każdą stronę
      const shift = Math.max(-1, Math.min(1, progress)) * 12; // ±10%
      img.style.transform = `translateY(${shift}%) scale(1.25)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <li className={`${styles.card} ${reversed ? styles.cardRight : ""}`}>
      <div className={styles.media} ref={mediaRef}>
        {offer.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={imgRef}
            src={offer.image}
            alt={offer.title}
            className={styles.img}
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>{offer.category}</span>
        <span className={styles.locations}>{offer.locations.join(" · ")}</span>
        <h3 className={styles.cardTitle}>{offer.title}</h3>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          onClick={onToggle}
        >
          {open ? "Zwiń opis" : "Pokaż opis"}
          <span
            className={`${styles.toggleIcon} ${open ? styles.toggleIconOpen : ""}`}
            aria-hidden="true"
          >
            ↓
          </span>
        </button>

        <div className={`${styles.descWrap} ${open ? styles.descOpen : ""}`}>
          <div className={styles.descInner}>
            <p className={styles.desc}>{offer.description}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
