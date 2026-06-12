"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { useTransitionPhase } from "../transition/TransitionProvider";

type RGB = [number, number, number];
type Variant = "light" | "dark";

interface LightsBackgroundProps {
  /** Mniejsza liczba = WIĘCEJ stałych drobinek (px² na 1 drobinkę). Domyślnie 14000. */
  density?: number;
  /** Ile razy więcej drobinek w szczycie animacji. Domyślnie 2.5. */
  burstFactor?: number;
  /** Czy drobinki unoszą się w górę. Domyślnie true. */
  rise?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Light {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  depth: number;
  hueIndex: number; // indeks w palecie — pozwala zmienić paletę bez respawnu
  rise: number;
  swA: number;
  swF: number;
  tw: number;
  ph: number;
  base: number;
  dormant: boolean;
  fade: number;
}

// paleta domyślna (ciemne strony) — chłodne światła
const DEFAULT_HUES: RGB[] = [
  [80, 235, 235],
  [80, 160, 255],
  [170, 110, 235],
  [120, 255, 200],
  [200, 230, 255],
];

// paleta złota (strona /oferta, jasne tło) — odcienie #c2a36b
const GOLD_HUES: RGB[] = [
  [194, 163, 107],
  [180, 150, 100],
  [210, 185, 140],
];

// konfiguracja per trasa — TU dodajesz kolejne jasne/ciemne strony
function configForPath(path: string): { variant: Variant; hues: RGB[] } {
  if (path === "/oferta") return { variant: "light", hues: GOLD_HUES };
  return { variant: "dark", hues: DEFAULT_HUES };
}

// --- pokrętła leja ---
const PULL_ACCEL = 1600;
const SWIRL = 1.2;
const RAMP = 4.5;
const CENTER_CLAMP = 35;
const RETURN = 2.0;
const FADE_SPEED = 3.0;

export default function LightsBackground({
  density = 14000,
  burstFactor = 2.5,
  rise = true,
  className,
  style,
}: LightsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // faza przejścia — przez ref (bez reinitu)
  const phase = useTransitionPhase();
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // wariant + paleta zależne od trasy — też przez ref, by zmiana strony
  // przerysowała kolor drobinek BEZ reinicjalizacji (ciągłość przejścia)
  const pathname = usePathname();
  const variantRef = useRef<Variant>(configForPath(pathname).variant);
  const huesRef = useRef<RGB[]>(configForPath(pathname).hues);
  useEffect(() => {
    const c = configForPath(pathname);
    variantRef.current = c.variant;
    huesRef.current = c.hues;
  }, [pathname]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
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
    let pull = 0;
    let prevPhase: string = "idle";

    const rand = (a: number, b: number): number => a + Math.random() * (b - a);
    const rgba = (c: RGB, a: number): string =>
      `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    function spawnLight(seedY: number | undefined, dormant: boolean): Light {
      const x = rand(0, 1);
      const y = seedY != null ? seedY : rand(0, 1);
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        hx: x,
        hy: y,
        depth: rand(0.3, 1),
        hueIndex: (Math.random() * 5) | 0, // modulo wg długości palety przy rysowaniu
        rise: rand(0.004, 0.02),
        swA: rand(0.004, 0.02),
        swF: rand(0.3, 1.0),
        tw: rand(0.7, 2.0),
        ph: rand(0, 6.28),
        base: rand(1.2, 3.2),
        dormant,
        fade: dormant ? 0 : 1,
      };
    }

    function initLights(): void {
      lights.length = 0;
      const baseN = Math.round((W * H) / density);
      const extraN = Math.round(baseN * Math.max(0, burstFactor - 1));
      for (let i = 0; i < baseN; i++) lights.push(spawnLight(undefined, false));
      for (let i = 0; i < extraN; i++) lights.push(spawnLight(undefined, true));
    }

    function resize(): void {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const cw = Math.floor(W * dpr);
      const ch = Math.floor(H * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (lights.length === 0) initLights();
    }

    function drawLight(m: Light, t: number): void {
      if (m.fade <= 0.001) return; // uśpiona i niewidoczna — pomiń

      const palette = huesRef.current;
      const hue = palette[m.hueIndex % palette.length];
      const variant = variantRef.current;

      const sway = Math.sin(t * m.swF + m.ph) * m.swA * (1 - pull);
      const px = (m.x + sway) * W;
      const py = m.y * H;
      const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * m.tw + m.ph));
      const a = (0.25 + 0.75 * m.depth) * tw * m.fade * (1 + pull * 0.8);
      const r = m.base * (0.5 + m.depth);

      // ciemne tło: addytywne smugi światła (lighter).
      // jasne tło: złoto rysowane normalnie — ciemniejsze od kremu, więc
      // skomponowane nad stroną daje delikatne, ciepłe punkty.
      ctx.globalCompositeOperation =
        variant === "light" ? "source-over" : "lighter";

      const g = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
      g.addColorStop(0, rgba(hue, a));
      g.addColorStop(0.25, rgba(hue, a * 0.5));
      g.addColorStop(1, rgba(hue, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r * 4, 0, 6.2832);
      ctx.fill();

      // jasny rdzeń tylko na ciemnym tle (na jasnym by zniknął / rozjaśniał)
      if (variant === "dark") {
        ctx.fillStyle = rgba([255, 255, 255], a * 0.8);
        ctx.beginPath();
        ctx.arc(px, py, r * 0.5, 0, 6.2832);
        ctx.fill();
      }
    }

    let last = performance.now();
    let t = 0;
    function frame(now: number): void {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      const ph = phaseRef.current;

      if (ph === "exiting" && prevPhase !== "exiting") {
        for (const m of lights) {
          m.hx = Math.random();
          m.hy = Math.random();
          if (m.dormant) {
            m.x = Math.random();
            m.y = Math.random();
            m.vx = 0;
            m.vy = 0;
          }
        }
      }
      prevPhase = ph;

      const target = ph === "exiting" ? 1 : 0;
      pull += (target - pull) * Math.min(1, dt * RAMP);
      const friction =
        ph === "exiting" ? 0.995 : ph === "settling" ? 0.8 : 0.86;

      const dormantTarget = ph === "idle" ? 0 : 1;

      const cx = 0.5 * W;
      const cy = 0.5 * H;

      ctx.clearRect(0, 0, W, H);

      for (const m of lights) {
        if (m.dormant) {
          m.fade += (dormantTarget - m.fade) * Math.min(1, dt * FADE_SPEED);
        }

        if (pull > 0.001) {
          const px = m.x * W;
          const py = m.y * H;
          const dx = cx - px;
          const dy = cy - py;
          const d = Math.max(Math.hypot(dx, dy), CENTER_CLAMP);
          const dirx = dx / d;
          const diry = dy / d;
          const tanx = -diry;
          const tany = dirx;
          const accel = pull * PULL_ACCEL * (1 + 220 / d);
          m.vx += (dirx * accel + tanx * accel * SWIRL) * dt;
          m.vy += (diry * accel + tany * accel * SWIRL) * dt;
        }

        m.vx *= friction;
        m.vy *= friction;
        m.x += (m.vx * dt) / W;
        m.y += (m.vy * dt) / H;

        if (ph === "settling") {
          const k = Math.min(1, dt * RETURN);
          m.x += (m.hx - m.x) * k;
          m.y += (m.hy - m.y) * k;
        }

        if (rise && !reduce && ph === "idle" && !m.dormant) {
          m.y -= m.rise * dt;
          if (m.y < -0.04) {
            const fresh = spawnLight(1.04, false);
            Object.assign(m, fresh);
          }
        }

        drawLight(m, t);
      }

      if (!reduce) rafId = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(frame);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
    // variant/hues/phase czytane przez ref — celowo poza deps, by nie reinitować
  }, [density, burstFactor, rise]);

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
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
