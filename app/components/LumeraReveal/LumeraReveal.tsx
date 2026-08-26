"use client";

import { useEffect, useRef, useState } from "react";
import { Cinzel } from "next/font/google";
import { useTransitionPhase } from "@/app/transition/TransitionProvider";
import styles from "./LumeraReveal.module.css";
import LightsBackground from "../LightsBackground";

const cinzel = Cinzel({
  subsets: ["latin-ext"],
  weight: "500",
  display: "swap",
});

/* =====================================================================
   Silnik animacji: drobinki światła dryfują, po czym łukami zlatują się
   do pikseli logo i "stygną" do złota (#d8c1a0). Po złożeniu drobinki
   ZNIKAJĄ (haloGlow = 0), a na wierzch wjeżdża OSTRE, prawdziwe SVG logo.
   Czysty Canvas 2D, bez zależności.

   Użycie (poza Reactem):
     const r = createLumeraReveal(canvasEl, { src: '/lumera.svg' });
     r.replay();   // ponowne odtworzenie
     r.destroy();  // sprzątanie (RAF + listenery)
   ===================================================================== */

type RGB = [number, number, number];

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LumeraOptions {
  src?: string;
  gold?: RGB;
  hues?: RGB[];
  sampleRes?: number;
  sampleStep?: number;
  maxParticles?: number;
  logoFrac?: number;
  aspect?: number;
  gather?: number;
  stagger?: number;
  settleGlow?: number;
  ambientDensity?: number;
  autoplay?: boolean;
  loop?: boolean;
  loopDelay?: number;
  haloGlow?: number;
  haloFade?: number;
  onComplete?: (() => void) | null;
  onLayout?: ((box: Box) => void) | null;
  onReplay?: (() => void) | null;
}

type LumeraConfig = Required<LumeraOptions>;

export interface LumeraRevealApi {
  readonly ready: Promise<void>;
  start(): void;
  stop(): void;
  replay(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  getBox(): Box;
  readonly config: LumeraConfig;
}

interface Target {
  nx: number;
  ny: number;
}

interface Particle extends Target {
  sx: number;
  sy: number;
  delay: number;
  dur: number;
  arc: number;
  arcDir: number;
  hue: number;
  tw: number;
  ph: number;
  base: number;
  depth: number;
  orbR: number;
  orbF: number;
  orbP: number;
}

interface AmbientMote {
  x: number;
  y: number;
  depth: number;
  hue: number;
  rise: number;
  swA: number;
  swF: number;
  tw: number;
  ph: number;
  base: number;
}

export function createLumeraReveal(
  canvas: HTMLCanvasElement,
  options: LumeraOptions = {},
): LumeraRevealApi {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("LumeraReveal: brak kontekstu 2D na canvasie");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const defaults: LumeraConfig = {
    src: "/lumera.svg",
    gold: [216, 193, 160],
    hues: [
      [80, 235, 235],
      [80, 160, 255],
      [170, 110, 235],
      [120, 255, 200],
      [200, 230, 255],
    ],
    sampleRes: 380,
    sampleStep: 3,
    maxParticles: 3000,
    logoFrac: 0.6,
    aspect: 1,
    gather: 2.8,
    stagger: 1.4,
    settleGlow: 1.0,
    ambientDensity: 30000,
    autoplay: true,
    loop: false,
    loopDelay: 2.4,
    haloGlow: 0,
    haloFade: 0.4,
    onComplete: null,
    onLayout: null,
    onReplay: null,
  };
  const cfg: LumeraConfig = { ...defaults, ...options };

  const rand = (a: number, b: number): number => a + Math.random() * (b - a);
  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const smooth = (e0: number, e1: number, x: number): number => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const SPR = 48;
  function glowSprite(c: RGB): HTMLCanvasElement {
    const s = document.createElement("canvas");
    s.width = s.height = SPR;
    const g = s.getContext("2d")!;
    const r = SPR / 2;
    const rg = g.createRadialGradient(r, r, 0, r, r, r);
    rg.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.85)`);
    rg.addColorStop(0.28, `rgba(${c[0]},${c[1]},${c[2]},0.32)`);
    rg.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    g.fillStyle = rg;
    g.beginPath();
    g.arc(r, r, r, 0, 6.2832);
    g.fill();
    return s;
  }
  function coreSprite(): HTMLCanvasElement {
    const s = document.createElement("canvas");
    s.width = s.height = SPR;
    const g = s.getContext("2d")!;
    const r = SPR / 2;
    const rg = g.createRadialGradient(r, r, 0, r, r, r * 0.5);
    rg.addColorStop(0, "rgba(255,255,255,0.95)");
    rg.addColorStop(0.6, "rgba(255,255,255,0.25)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(r, r, r * 0.5, 0, 6.2832);
    g.fill();
    return s;
  }
  const hueSprites: HTMLCanvasElement[] = cfg.hues.map(glowSprite);
  const goldSprite = glowSprite(cfg.gold);
  const core = coreSprite();

  let W = 0;
  let H = 0;
  let dpr = 1;
  let raf: number | null = null;
  let running = false;
  let targets: Target[] = [];
  let parts: Particle[] = [];
  const ambient: AmbientMote[] = [];
  let box: Box = { x: 0, y: 0, w: 0, h: 0 };
  let startTime = 0;
  let completed = false;
  let completeAt = 0;
  let t0 = 0;
  let pauseStamp = 0;

  function computeBox(): void {
    const size = Math.min(W, H) * cfg.logoFrac;
    const a = cfg.aspect > 0 ? cfg.aspect : 1;
    const w = a >= 1 ? size : size * a;
    const h = a >= 1 ? size / a : size;
    box = { x: (W - w) / 2, y: (H - h) / 2, w, h };
  }
  const TX = (n: number): number => box.x + n * box.w;
  const TY = (n: number): number => box.y + n * box.h;

  function makeAmbient(seedY?: number): AmbientMote {
    return {
      x: rand(0, 1),
      y: seedY != null ? seedY : rand(0, 1),
      depth: rand(0.3, 1),
      hue: (Math.random() * cfg.hues.length) | 0,
      rise: rand(0.004, 0.018),
      swA: rand(0.004, 0.02),
      swF: rand(0.3, 1.0),
      tw: rand(0.7, 2.0),
      ph: rand(0, 6.28),
      base: rand(1.0, 2.6),
    };
  }
  function initAmbient(): void {
    ambient.length = 0;
    const n = Math.round((W * H) / cfg.ambientDensity);
    for (let i = 0; i < n; i++) ambient.push(makeAmbient());
  }

  function buildParticles(): void {
    parts = targets.map((t): Particle => {
      const ang = rand(0, Math.PI * 2);
      const radius = rand(0.45, 0.95) * Math.max(W, H);
      const sx = W / 2 + Math.cos(ang) * radius + rand(-W * 0.2, W * 0.2);
      const sy = H / 2 + Math.sin(ang) * radius + rand(-H * 0.2, H * 0.2);
      return {
        nx: t.nx,
        ny: t.ny,
        sx,
        sy,
        delay: rand(0, cfg.stagger),
        dur: cfg.gather + rand(-0.4, 0.6),
        arc: rand(-0.22, 0.22) * Math.min(W, H),
        arcDir: rand(0, Math.PI * 2),
        hue: (Math.random() * cfg.hues.length) | 0,
        tw: rand(1.2, 3.0),
        ph: rand(0, 6.28),
        base: rand(0.9, 2.0),
        depth: rand(0.55, 1),
        orbR: rand(0.4, 1.6),
        orbF: rand(0.4, 1.2),
        orbP: rand(0, 6.28),
      };
    });
  }

  function drawAmbient(t: number): void {
    ctx!.globalCompositeOperation = "lighter";
    for (const m of ambient) {
      if (!reduce) {
        m.y -= m.rise * (1 / 60);
        if (m.y < -0.04) Object.assign(m, makeAmbient(1.04));
      }
      const sway = Math.sin(t * m.swF + m.ph) * m.swA;
      const px = (m.x + sway) * W;
      const py = m.y * H;
      const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * m.tw + m.ph));
      const a = (0.1 + 0.28 * m.depth) * tw;
      const r = m.base * (0.6 + m.depth) * 4;
      ctx!.globalAlpha = a;
      ctx!.drawImage(hueSprites[m.hue], px - r, py - r, r * 2, r * 2);
    }
  }

  function drawParticles(t: number, elapsed: number): void {
    const halo = completed
      ? 1 - (1 - cfg.haloGlow) * smooth(0, cfg.haloFade, elapsed - completeAt)
      : 1;
    if (completed && halo <= 0.001) return;

    ctx!.globalCompositeOperation = "lighter";
    for (const p of parts) {
      let lt = (elapsed - p.delay) / p.dur;
      if (lt < 0) lt = 0;
      const settled = lt >= 1;
      let px: number;
      let py: number;
      let warm: number;
      let scale: number;

      if (!settled) {
        const e = easeInOutCubic(lt);
        const tx = TX(p.nx);
        const ty = TY(p.ny);
        px = p.sx + (tx - p.sx) * e;
        py = p.sy + (ty - p.sy) * e;
        const bow = Math.sin(e * Math.PI) * p.arc;
        px += Math.cos(p.arcDir) * bow;
        py += Math.sin(p.arcDir) * bow;
        warm = smooth(0.55, 1, lt);
        scale = 0.7 + 0.5 * e;
      } else {
        const orb = reduce ? 0 : p.orbR;
        px = TX(p.nx) + Math.cos(t * p.orbF + p.orbP) * orb;
        py = TY(p.ny) + Math.sin(t * p.orbF * 1.3 + p.orbP) * orb;
        warm = 1;
        scale = 1;
      }

      const tw = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph));
      const a =
        (0.3 + 0.55 * p.depth) * tw * (settled ? cfg.settleGlow * halo : 1);
      const r = p.base * (0.7 + p.depth) * scale * 4;

      if (warm < 0.98) {
        ctx!.globalAlpha = a * (1 - warm);
        ctx!.drawImage(hueSprites[p.hue], px - r, py - r, r * 2, r * 2);
      }
      if (warm > 0.02) {
        ctx!.globalAlpha = a * warm;
        ctx!.drawImage(goldSprite, px - r, py - r, r * 2, r * 2);
      }
      const cr = p.base * scale * 1.6;
      ctx!.globalAlpha = a * 0.9;
      ctx!.drawImage(core, px - cr, py - cr, cr * 2, cr * 2);
    }
    ctx!.globalAlpha = 1;
  }

  function frame(now: number): void {
    if (!running) return;
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) / 1000;
    const t = now / 1000 - t0;

    ctx!.clearRect(0, 0, W, H);
    drawAmbient(t);
    drawParticles(t, elapsed);

    const total = cfg.gather + cfg.stagger + 0.15;
    if (!completed && elapsed >= total) {
      completed = true;
      completeAt = elapsed;
      cfg.onComplete?.();
    }
    if (completed && cfg.loop && elapsed >= total + cfg.loopDelay) {
      buildParticles();
      startTime = now;
      completed = false;
      completeAt = 0;
      cfg.onReplay?.();
    }

    raf = requestAnimationFrame(frame);
  }

  function loadLogo(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const S = cfg.sampleRes;
        const off = document.createElement("canvas");
        off.width = off.height = S;
        const oc = off.getContext("2d")!;
        try {
          oc.drawImage(img, 0, 0, S, S);
        } catch (e) {
          reject(e);
          return;
        }
        let data: Uint8ClampedArray;
        try {
          data = oc.getImageData(0, 0, S, S).data;
        } catch (e) {
          reject(e);
          return;
        }
        const pts: Array<[number, number]> = [];
        for (let y = 0; y < S; y += cfg.sampleStep)
          for (let x = 0; x < S; x += cfg.sampleStep)
            if (data[(y * S + x) * 4 + 3] > 100) pts.push([x / S, y / S]);
        for (let i = pts.length - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [pts[i], pts[j]] = [pts[j], pts[i]];
        }
        targets = pts
          .slice(0, cfg.maxParticles)
          .map(([nx, ny]) => ({ nx, ny }));
        resolve(targets.length);
      };
      img.onerror = () =>
        reject(new Error("Nie udało się wczytać logo: " + cfg.src));
      img.src = cfg.src;
    });
  }

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeBox();
    initAmbient();
    cfg.onLayout?.({ ...box });
  }

  function start(): void {
    if (running) return;
    running = true;
    startTime = 0;
    completed = false;
    t0 = performance.now() / 1000;
    raf = requestAnimationFrame(frame);
  }
  function stop(): void {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }
  function replay(): void {
    buildParticles();
    startTime = 0;
    completed = false;
    completeAt = 0;
    cfg.onReplay?.();
    if (!running) start();
  }
  function pause(): void {
    if (!running) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    pauseStamp = performance.now();
  }
  function resume(): void {
    if (running) return;
    running = true;
    if (pauseStamp) {
      const delta = performance.now() - pauseStamp;
      if (startTime) startTime += delta;
      t0 += delta / 1000;
      pauseStamp = 0;
    }
    raf = requestAnimationFrame(frame);
  }

  const onResize = (): void => resize();
  window.addEventListener("resize", onResize);

  resize();
  const ready: Promise<void> = loadLogo().then(() => {
    buildParticles();
    if (cfg.autoplay) start();
  });

  return {
    ready,
    start,
    stop,
    replay,
    pause,
    resume,
    destroy() {
      stop();
      window.removeEventListener("resize", onResize);
    },
    getBox() {
      return { ...box };
    },
    get config() {
      return cfg;
    },
  };
}

export interface LumeraRevealProps {
  src?: string;
  gather?: number;
  stagger?: number;
  maxParticles?: number;
  logoFrac?: number;
  haloGlow?: number;
  loop?: boolean;
  className?: string;
  background?: string;
  video?: string;
  poster?: string;
  scrim?: number;
  tagline?: string;
  onComplete?: () => void;
  exiting?: boolean;
  skipIntro?: boolean;
  parallax?: boolean;
}

export default function LumeraReveal({
  src = "/lumera-logo.svg",
  gather = 2.2,
  stagger = 0.7,
  maxParticles = 3000,
  logoFrac = 0.6,
  haloGlow = 0,
  loop = false,
  className = "",
  background,
  video,
  poster,
  scrim = 0.5,
  tagline = "Harmonia twarzy i ciała",
  onComplete,
  exiting = false,
  skipIntro = false,
  parallax = false,
}: LumeraRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<LumeraRevealApi | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const phase = useTransitionPhase();
  useEffect(() => {
    if (phase !== "idle") return;
    videoRef.current?.play().catch(() => {});
  }, [phase]);

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const useParallax = parallax && !isMobile;

  useEffect(() => {
    if (!useParallax) return;
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 1.2)));
      stage.style.setProperty("--p", String(p));
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
  }, [useParallax]);

  const logoSrc = isMobile ? "/lumera-top.svg" : src;
  const logoAspect = isMobile ? 266.4 / 321.57 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const tag = tagRef.current;
    if (!canvas) return;

    const layout = (box: Box): void => {
      if (img) {
        img.style.left = `${box.x}px`;
        img.style.top = `${box.y}px`;
        img.style.width = `${box.w}px`;
        img.style.height = `${box.h}px`;
      }
      if (tag) {
        const cx = box.x + box.w / 2;
        tag.style.left = `${cx}px`;
        if (isMobile) {
          tag.style.top = `${box.y + box.h + box.h * 0.04}px`;
          tag.style.whiteSpace = "normal";
          tag.style.width = "min(80vw, 22rem)";
          tag.style.fontSize = `${Math.max(box.w * 0.06, 15)}px`;
          tag.dataset.anchor = "top";
        } else {
          tag.style.top = `${box.y + box.h * 0.85}px`;
          tag.style.whiteSpace = "nowrap";
          tag.style.width = "auto";
          tag.style.fontSize = `${box.w * 0.04}px`;
          tag.dataset.anchor = "center";
        }
      }
    };

    const reveal = createLumeraReveal(canvas, {
      src: logoSrc,
      aspect: logoAspect,
      gather,
      stagger,
      maxParticles,
      logoFrac,
      haloGlow,
      loop,
      autoplay: !skipIntro,
      onLayout: layout,
      onReplay: () => {
        img?.classList.remove(styles.show);
        tag?.classList.remove(styles.show);
      },
      onComplete: () => {
        img?.classList.add(styles.show);
        tag?.classList.add(styles.show);
        onComplete?.();
      },
    });
    apiRef.current = reveal;

    let pauseIO: IntersectionObserver | null = null;
    let pauseSync: (() => void) | null = null;

    reveal.ready
      .then(() => {
        layout(reveal.getBox());
        if (skipIntro) {
          img?.classList.add(styles.show);
          tag?.classList.add(styles.show);
          onComplete?.();
          return;
        }
        const stage = stageRef.current;
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (stage && !reduceMotion) {
          let onScreen = true;
          pauseSync = () => {
            if (onScreen && !document.hidden) reveal.resume();
            else reveal.pause();
          };
          pauseIO = new IntersectionObserver(
            ([e]) => {
              onScreen = e.isIntersecting;
              pauseSync?.();
            },
            { threshold: 0 },
          );
          pauseIO.observe(stage);
          document.addEventListener("visibilitychange", pauseSync);
        }
      })
      .catch((e: unknown) => console.error("[LumeraReveal]", e));

    return () => {
      pauseIO?.disconnect();
      if (pauseSync) document.removeEventListener("visibilitychange", pauseSync);
      reveal.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    logoSrc,
    logoAspect,
    gather,
    stagger,
    maxParticles,
    logoFrac,
    haloGlow,
    loop,
    skipIntro,
  ]);

  return (
    <div
      ref={stageRef}
      className={`${styles.stage} ${className} ${exiting ? styles.exiting : ""} ${
        useParallax ? styles.parallax : ""
      }`}
    >
      {video ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            className={styles.bg}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-hidden="true"
          >
            {video.endsWith(".mp4") && (
              <source
                src={video.replace(/\.mp4$/, ".webm")}
                type="video/webm"
              />
            )}
            <source
              src={video}
              type={video.endsWith(".webm") ? "video/webm" : "video/mp4"}
            />
          </video>
          <div
            className={styles.scrim}
            style={{ background: `rgba(8, 6, 24, ${scrim})` }}
            aria-hidden="true"
          />
        </>
      ) : background ? (
        <>
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${background})` }}
            aria-hidden="true"
          />
          <div
            className={styles.scrim}
            style={{ background: `rgba(8, 6, 24, ${scrim})` }}
            aria-hidden="true"
          />
        </>
      ) : null}
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.foreground}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={logoSrc}
          alt="LUMERA"
          className={styles.logo}
          aria-hidden="true"
        />
        <span ref={tagRef} className={`${styles.tagline} ${cinzel.className}`}>
          {tagline}
        </span>
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <LightsBackground />
    </div>
  );
}
