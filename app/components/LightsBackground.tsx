"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type RGB = [number, number, number];

interface LightsBackgroundProps {
  /** Mniejsza liczba = WIĘCEJ drobinek (px² na 1 drobinkę). Domyślnie 14000. */
  density?: number;
  /** Czy drobinki unoszą się w górę. Domyślnie true. */
  rise?: boolean;
  /** Paleta kolorów jako tablice [r, g, b]. */
  hues?: RGB[];
  className?: string;
  style?: CSSProperties;
}

interface Light {
  x: number;
  y: number;
  depth: number;
  hue: RGB;
  rise: number;
  swA: number;
  swF: number;
  tw: number;
  ph: number;
  base: number;
}

const DEFAULT_HUES: RGB[] = [
  [80, 235, 235],
  [80, 160, 255],
  [170, 110, 235],
  [120, 255, 200],
  [200, 230, 255],
];

/**
 * Warstwa unoszących się drobinek światła (przezroczyste tło).
 * Użycie:  <MotesBackground />  — najlepiej w kontenerze position:relative,
 * a treść dawaj nad nią (wyższy z-index).
 */
export default function LightsBackground({
  density = 14000,
  rise = true,
  hues = DEFAULT_HUES,
  className,
  style,
}: LightsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // zawężone, nie-null referencje używane wewnątrz zagnieżdżonych funkcji
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let rafId: number | null = null;
    const lights: Light[] = [];

    const rand = (a: number, b: number): number => a + Math.random() * (b - a);
    const rgba = (c: RGB, a: number): string =>
      `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    function spawnLight(seedY?: number): Light {
      return {
        x: rand(0, 1),
        y: seedY != null ? seedY : rand(0, 1),
        depth: rand(0.3, 1),
        hue: hues[(Math.random() * hues.length) | 0],
        rise: rand(0.004, 0.02),
        swA: rand(0.004, 0.02),
        swF: rand(0.3, 1.0),
        tw: rand(0.7, 2.0),
        ph: rand(0, 6.28),
        base: rand(1.2, 3.2),
      };
    }

    function initLights(): void {
      lights.length = 0;
      const n = Math.round((W * H) / density);
      for (let i = 0; i < n; i++) lights.push(spawnLight());
    }

    function resize(): void {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // rozmiar liczony z rodzica (jeśli jest), inaczej z okna
      const parent = canvas.parentElement;
      W = parent ? parent.clientWidth : window.innerWidth;
      H = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLights();
    }

    function drawLight(m: Light, t: number): void {
      const sway = Math.sin(t * m.swF + m.ph) * m.swA;
      const px = (m.x + sway) * W;
      const py = m.y * H;
      const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * m.tw + m.ph));
      const a = (0.25 + 0.75 * m.depth) * tw;
      const r = m.base * (0.5 + m.depth);
      const g = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
      g.addColorStop(0, rgba(m.hue, a));
      g.addColorStop(0.25, rgba(m.hue, a * 0.5));
      g.addColorStop(1, rgba(m.hue, 0));
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r * 4, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = rgba([255, 255, 255], a * 0.8);
      ctx.beginPath();
      ctx.arc(px, py, r * 0.5, 0, 6.2832);
      ctx.fill();
    }

    let last = performance.now();
    let t = 0;
    function frame(now: number): void {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, W, H);
      for (const m of lights) {
        if (rise && !reduce) {
          m.y -= m.rise * dt;
          if (m.y < -0.04) Object.assign(m, spawnLight(1.04));
        }
        drawLight(m, t);
      }
      if (!reduce) rafId = requestAnimationFrame(frame);
    }

    // obserwujemy zmianę rozmiaru rodzica (lepsze niż samo okno)
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", resize);

    resize();
    rafId = requestAnimationFrame(frame);

    // SPRZĄTANIE — kluczowe w Next.js (nawigacja / hot reload)
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, [density, rise, hues]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none", // klikalność przechodzi do warstw pod spodem
        ...style,
      }}
    />
  );
}
