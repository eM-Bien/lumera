"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTransitionPhase } from "../transition/TransitionProvider";

type RGB = [number, number, number];

interface LightsBackgroundProps {
  /** Mniejsza liczba = WIĘCEJ stałych drobinek (px² na 1 drobinkę). Domyślnie 14000. */
  density?: number;
  /**
   * Ile razy więcej drobinek pojawia się w szczycie animacji.
   * 1 = bez dodatkowych, 2.5 = w leju ~2,5× gęściej. Domyślnie 2.5.
   */
  burstFactor?: number;
  /** Czy drobinki unoszą się w górę. Domyślnie true. */
  rise?: boolean;
  /** Paleta kolorów jako tablice [r, g, b]. */
  hues?: RGB[];
  className?: string;
  style?: CSSProperties;
}

interface Light {
  x: number; // pozycja znormalizowana 0..1
  y: number;
  vx: number; // prędkość w px/s — napędza lej
  vy: number;
  hx: number; // „dom" — miejsce, na które drobinka wraca po leju
  hy: number;
  depth: number;
  hue: RGB;
  rise: number;
  swA: number;
  swF: number;
  tw: number;
  ph: number;
  base: number;
  dormant: boolean; // true = drobinka z dodatkowej puli (widoczna tylko w leju)
  fade: number; // 0..1 — krycie dodatkowej drobinki (lerp)
}

const DEFAULT_HUES: RGB[] = [
  [80, 235, 235],
  [80, 160, 255],
  [170, 110, 235],
  [120, 255, 200],
  [200, 230, 255],
];

// --- pokrętła leja (dostrój tutaj) ---
const PULL_ACCEL = 1600; // px/s² — siła ssania (większa = gwałtowniejszy lej)
const SWIRL = 1.2; // udział stycznej (0 = prosto do środka, >1 = mocno krąży)
const RAMP = 4.5; // jak szybko narasta/opada ssanie
const CENTER_CLAMP = 35; // mniejsze = ciaśniej zbite w środku
const RETURN = 2.0; // jak szybko drobinki wracają na miejsce (mniej = delikatniej)
const FADE_SPEED = 3.0; // jak szybko dodatkowe drobinki pojawiają się / znikają

export default function LightsBackground({
  density = 14000,
  burstFactor = 2.5,
  rise = true,
  hues = DEFAULT_HUES,
  className,
  style,
}: LightsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // faza z kontekstu — czytana przez ref, NIE w deps efektu (zero reinitu)
  const phase = useTransitionPhase();
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

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
    let pull = 0; // bieżąca siła ssania 0..1 (lerp do celu zależnego od fazy)
    let prevPhase: string = "idle"; // do wykrycia startu leja

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
        hue: hues[(Math.random() * hues.length) | 0],
        rise: rand(0.004, 0.02),
        swA: rand(0.004, 0.02),
        swF: rand(0.3, 1.0),
        tw: rand(0.7, 2.0),
        ph: rand(0, 6.28),
        base: rand(1.2, 3.2),
        dormant,
        fade: dormant ? 0 : 1, // stałe widoczne od razu, pula uśpiona
      };
    }

    function initLights(): void {
      lights.length = 0;
      const baseN = Math.round((W * H) / density); // stałe drobinki
      const extraN = Math.round(baseN * Math.max(0, burstFactor - 1)); // pula
      for (let i = 0; i < baseN; i++) lights.push(spawnLight(undefined, false));
      for (let i = 0; i < extraN; i++) lights.push(spawnLight(undefined, true));
    }

    function resize(): void {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      const cw = Math.floor(W * dpr);
      const ch = Math.floor(H * dpr);

      // przypisuj TYLKO gdy rozmiar realnie się zmienił — każde przypisanie
      // canvas.width/height czyści canvas, co powodowało mignięcie drobinek
      // przy nawigacji (ResizeObserver odpalał resize mimo tego samego okna)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (lights.length === 0) initLights();
    }

    function drawLight(m: Light, t: number): void {
      if (m.fade <= 0.001) return; // uśpiona i niewidoczna — pomiń
      const sway = Math.sin(t * m.swF + m.ph) * m.swA * (1 - pull);
      const px = (m.x + sway) * W;
      const py = m.y * H;
      const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * m.tw + m.ph));
      // krycie × fade (pula płynnie wchodzi/wychodzi) × rozjaśnienie w leju
      const a = (0.25 + 0.75 * m.depth) * tw * m.fade * (1 + pull * 0.8);
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

      const ph = phaseRef.current;

      // start leja: świeży, równomierny rozrzut po CAŁYM ekranie (dom).
      // dotyczy też puli — żeby po fade-in wpojawiła się rozsiana, nie w punkcie.
      if (ph === "exiting" && prevPhase !== "exiting") {
        for (const m of lights) {
          m.hx = Math.random();
          m.hy = Math.random();
          if (m.dormant) {
            // ustaw uśpioną na świeżej pozycji, by wjechała z całego ekranu
            m.x = Math.random();
            m.y = Math.random();
            m.vx = 0;
            m.vy = 0;
          }
        }
      }
      prevPhase = ph;

      // ssanie: pełne przy wyjściu, zero w spoczynku i przy uspokajaniu
      const target = ph === "exiting" ? 1 : 0;
      pull += (target - pull) * Math.min(1, dt * RAMP);
      const friction =
        ph === "exiting" ? 0.995 : ph === "settling" ? 0.8 : 0.86;

      // dodatkowa pula: widoczna gdy trwa lej (exiting/settling), inaczej znika
      const dormantTarget = ph === "idle" ? 0 : 1;

      const cx = 0.5 * W;
      const cy = 0.5 * H;

      ctx.clearRect(0, 0, W, H);

      for (const m of lights) {
        // płynne pojawianie / znikanie dodatkowych drobinek
        if (m.dormant) {
          m.fade += (dormantTarget - m.fade) * Math.min(1, dt * FADE_SPEED);
        }

        // --- lej: prędkość w px/s, siła do środka + styczna (wir) ---
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

        // tarcie + pęd
        m.vx *= friction;
        m.vy *= friction;
        m.x += (m.vx * dt) / W;
        m.y += (m.vy * dt) / H;

        // uspokajanie: delikatny powrót na świeży rozrzut (homing)
        if (ph === "settling") {
          const k = Math.min(1, dt * RETURN);
          m.x += (m.hx - m.x) * k;
          m.y += (m.hy - m.y) * k;
        }

        // unoszenie — tylko stałe drobinki w spoczynku
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
  }, [density, burstFactor, rise, hues]);

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
