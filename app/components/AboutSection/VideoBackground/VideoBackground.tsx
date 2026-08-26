"use client";

import { useEffect, useRef } from "react";
import { useTransitionPhase } from "@/app/transition/TransitionProvider";
import styles from "./VideoBackground.module.css";

export default function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);
  const phase = useTransitionPhase();

  useEffect(() => {
    if (phase !== "idle") return;
    ref.current?.play().catch(() => {});
  }, [phase]);

  return (
    <>
      <video
        ref={ref}
        className={styles.video}
        muted
        loop
        playsInline
        preload="auto"
        poster="/about/bg-clouds-poster.jpg"
        aria-hidden="true"
      >
        <source src="/about/bg-clouds.webm" type="video/webm" />
        <source src="/about/bg-clouds.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} aria-hidden="true" />
    </>
  );
}
