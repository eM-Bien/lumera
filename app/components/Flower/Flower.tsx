"use client";

import styles from "./Flower.module.css";

type FlowerProps = {
  src: string;
  left: string;
  top: string;
  size: string;
  rotate?: number;
  sway?: number;
  duration?: number;
  delay?: number;
  flip?: boolean;
  bob?: number;
};

export default function Flower({
  src,
  left,
  top,
  size,
  rotate = 0,
  sway = 3,
  duration = 7,
  delay = 0,
  flip = false,
  bob = 4,
}: FlowerProps) {
  return (
    <div
      className={styles.flower}
      style={
        {
          left,
          top,
          width: size,
          "--rot": `${rotate}deg`,
          "--sway": `${sway}deg`,
          "--bob": `${bob}px`,
          "--dur": `${duration}s`,
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.img}
        src={src}
        alt=""
        aria-hidden="true"
        style={{ transform: flip ? "scaleX(-1)" : "none" }}
      />
    </div>
  );
}
