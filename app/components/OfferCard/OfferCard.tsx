"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "@/app/transition/TransitionProvider";
import type { Location } from "../OfferExplorer/offer-types";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import styles from "./OfferCard.module.css";

type CardData = {
  id: string;
  title: string;
  price: string;
  description: string;
  locations: Location[];
  category?: string;
  image?: string;
  effects?: string[];
};

type OfferCardProps = {
  offer: CardData;
  reversed?: boolean;
  open: boolean;
  onToggle: () => void;
  leafVariant?: number;
};

export default function OfferCard({
  offer,
  reversed = false,
  open,
  onToggle,
  leafVariant = 0,
}: OfferCardProps) {
  const LEAVES = [styles.leaf0, styles.leaf1, styles.leaf2, styles.leaf3];
  const leafClass = LEAVES[((leafVariant % LEAVES.length) + LEAVES.length) % LEAVES.length];
  const { navigate } = useTransition();
  const cardRef = useRef<HTMLLIElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  });

  const userToggledRef = useRef(false);

  const handleToggle = () => {
    userToggledRef.current = true;
    onToggle();
  };

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
            onToggleRef.current();
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.8 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const media = mediaRef.current;
    const img = imgRef.current;
    if (!media || !img) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let raf = 0;
    let idleTimer = 0;
    let mid = 0;
    let denom = 1;
    let vh = window.innerHeight;

    const measure = () => {
      const rect = media.getBoundingClientRect();
      vh = window.innerHeight;
      mid = rect.top + window.scrollY + rect.height / 2;
      denom = vh / 2 + rect.height / 2;
    };

    const apply = () => {
      raf = 0;
      const progress = (mid - window.scrollY - vh / 2) / denom;
      const shift = Math.max(-1, Math.min(1, progress)) * 12;
      img.style.transform = `translateY(${shift}%) scale(1.25)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        measure();
        apply();
      }, 160);
    };
    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <li
      ref={cardRef}
      className={`${styles.card} ${reversed ? styles.cardRight : ""}`}
    >
      <div className={`${styles.media} ${leafClass}`} ref={mediaRef}>
        {offer.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            ref={imgRef}
            src={offer.image}
            alt={offer.title}
            className={`${styles.img} ${
              offer.category === "Trychologia" ? styles.imgTrycho : ""
            }`}
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.content}>
        {offer.category && (
          <span className={styles.eyebrow}>{offer.category}</span>
        )}
        <span className={styles.locations}>{offer.locations.join(" · ")}</span>
        <h3 className={styles.cardTitle}>{offer.title}</h3>
        <span className={styles.price}>{offer.price}</span>

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

            {offer.effects && offer.effects.length > 0 && (
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

        <div className={styles.actions}>
          <PrimaryButton
            className={styles.bookBtn}
            onClick={() => navigate(`/kontakt?zabieg=${offer.id}`)}
          >
            Umów
          </PrimaryButton>
        </div>
      </div>
    </li>
  );
}
