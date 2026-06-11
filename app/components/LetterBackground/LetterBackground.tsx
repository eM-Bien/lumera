"use client";

import { useEffect, useRef, useState } from "react";
import WaterLetter, { LetterBox } from "../WaterLetter/WaterLetter";
import Sprig from "../Sprig/Sprig";
import styles from "./LetterBackground.module.css";

type LetterBackgroundProps = {
  letter?: string;
  fontFamily: string;
  fontWeight?: number | string;
  gold?: [number, number, number];
  /** Wielkość samej litery (ułamek wysokości ekranu). */
  letterFrac?: number;
  /** Skala całej kompozycji (litera + kwiaty). 1 = domyślna. */
  scale?: number;
  className?: string;
};

export default function LetterBackground({
  letter = "L",
  fontFamily,
  fontWeight = 600,
  gold = [240, 235, 235],
  letterFrac = 0.45,
  scale = 1,
  className = "",
}: LetterBackgroundProps) {
  const [box, setBox] = useState<LetterBox | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // skala bazowa jako zmienna CSS — bez stylu liniowego dla wyglądu
  useEffect(() => {
    stageRef.current?.style.setProperty("--base-scale", String(scale));
  }, [scale]);

  // postęp scrolla 0..1 — pełne zaniknięcie po przewinięciu ~jednego ekranu
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / vh));
      el.style.setProperty("--p", String(p));
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
    <div
      ref={stageRef}
      className={`${styles.stage} ${className}`}
      aria-hidden="true"
    >
      <div className={styles.inner}>
        <div className={styles.letter}>
          <WaterLetter
            letter={letter}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            letterFrac={letterFrac}
            gold={gold}
            onLayout={setBox}
          />
        </div>

        {box && (
          <>
            <div className={styles.behind}>
              <Sprig
                left={`${box.cx - box.w * 0.4}px`}
                top={`${box.cy + box.h * 0.2}px`}
                size={`${box.h * 0.32}px`}
                rotate={-22}
                sway={8}
                delay={0}
                color="#fcf8f2"
                flowerScale={1.8}
              />
              <Sprig
                left={`${box.cx + box.w * 0.1}px`}
                top={`${box.cy + box.h * 0.46}px`}
                size={`${box.h * 0.2}px`}
                rotate={18}
                sway={9.5}
                delay={1.4}
                color="#fcf8f2"
                flip
                flowerScale={1.4}
              />
            </div>

            <div className={styles.front}>
              <Sprig
                left={`${box.cx * 0.8}px`}
                top={`${box.cy + box.h * 0.48}px`}
                size={`${box.h * 0.3}px`}
                rotate={8}
                sway={7.5}
                delay={0.6}
                color="#fcf8f2"
              />
              <Sprig
                left={`${box.cx + box.w * -0.5}px`}
                top={`${box.cy + box.h * 0.5}px`}
                size={`${box.h * 0.34}px`}
                rotate={-12}
                sway={8.5}
                delay={2}
                color="#fcf8f2"
                flip
              />
              <Sprig
                left={`${box.cx + box.w * -0.2}px`}
                top={`${box.cy + box.h * 0.47}px`}
                size={`${box.h * 0.36}px`}
                rotate={24}
                sway={9}
                delay={1.1}
                color="#fcf8f2"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
