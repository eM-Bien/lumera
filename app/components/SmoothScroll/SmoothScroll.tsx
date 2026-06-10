"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // szanuj preferencję — bez smooth scrolla

    const lenis = new Lenis({
      duration: 1.1, // im więcej, tym cięższy „wybieg" (oryginał ma ~1–1.2)
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic — miękkie dojście
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
