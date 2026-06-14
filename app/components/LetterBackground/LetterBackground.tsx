"use client";

import { useEffect, useRef, useState } from "react";
import WaterLetter, { LetterBox } from "../WaterLetter/WaterLetter";
import Sprig from "../Sprig/Sprig";
import styles from "./LetterBackground.module.css";
import Flower from "../Flower/Flower";

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

// proporcja szer/wys obrazka krwawnika (do wyliczenia wysokości z szerokości)
const PLANT_ASPECT = 0.951; // proporcja szer/wys goździków

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

  // goździki: szerokie na 1.4×wysokość litery; podstawa łodygi przy stopie litery
  const plantW = box ? box.h * 0.8 : 0;
  const plantH = plantW / PLANT_ASPECT;
  // top tak dobrane, by DÓŁ rośliny był na ~box.cy + box.h*0.55 (stopa litery)
  const plantTop = box ? box.cy + box.h * 0.45 - plantH : 0;

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
                color="#ffffff"
                flowerScale={1.8}
              />
              <Flower
                src="/flowers/peonia-1.png"
                size={`${box.h * 0.45}px`}
                left={`${box.cx - box.h * 0.55}px`}
                top={`${box.cy + box.h * 0.08}px`}
                rotate={-6}
                sway={2.5}
                duration={7.5}
                delay={0}
              />
            </div>

            <div className={styles.front}>
              <Flower
                src="/flowers/gozdzik.png"
                size={`${plantW}px`}
                left={`${box.cx - box.h * 0.3}px`}
                top={`${plantTop}px`}
                rotate={2}
                sway={6.8}
                duration={8}
                delay={0.5}
                bob={0}
              />
              <Sprig
                left={`${box.cx + box.w * -0.2}px`}
                top={`${box.cy + box.h * 0.47}px`}
                size={`${box.h * 0.36}px`}
                rotate={24}
                sway={9}
                delay={1.1}
                color="#ffffff"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
