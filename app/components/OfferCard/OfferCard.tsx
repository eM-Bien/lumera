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
  const cardRef = useRef<HTMLLIElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // aktualne wartości dostępne w callbacku observera (bez stale closure)
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  });

  // czy użytkownik kliknął przycisk — wtedy auto-rozwijanie go nie dotyczy
  const userToggledRef = useRef(false);

  const handleToggle = () => {
    userToggledRef.current = true;
    onToggle();
  };

  // auto-rozwijanie opisu, gdy karta wjedzie w widok
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            !openRef.current &&
            !userToggledRef.current
          ) {
            onToggleRef.current(); // rozwiń (zostaje otwarte)
            io.unobserve(el); // jednorazowo
          }
        }
      },
      { threshold: 0.8 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // parallax na zdjęciu
  useEffect(() => {
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!media || !img) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = media.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const shift = Math.max(-1, Math.min(1, progress)) * 12;
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
    <li
      ref={cardRef}
      className={`${styles.card} ${reversed ? styles.cardRight : ""}`}
    >
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
          onClick={handleToggle}
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

            {offer.effects.length > 0 && (
              <div className={styles.effects}>
                <span className={styles.effectsTitle}>Efekty zabiegu</span>
                <ul className={styles.effectsList}>
                  {offer.effects.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
