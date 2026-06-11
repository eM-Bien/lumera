"use client";

import { useEffect, useRef } from "react";

export type LetterBox = {
  /** środek litery w poziomie [px] */
  cx: number;
  /** środek litery w pionie [px] */
  cy: number;
  /** przybliżona szerokość litery [px] */
  w: number;
  /** przybliżona wysokość litery (cap-height) [px] */
  h: number;
};

type WaterLetterProps = {
  letter?: string;
  /** Rodzina fontu — przekaż cinzel.style.fontFamily z next/font. */
  fontFamily?: string;
  /** Waga fontu do załadowania (musi zgadzać się z tą z next/font). */
  fontWeight?: number | string;
  /** Kolor litery [r,g,b] 0..255. Domyślnie złoto LUMERA. */
  gold?: [number, number, number];
  /** Wysokość litery jako ułamek wysokości ekranu. Mniej = mniejsza litera. */
  letterFrac?: number;
  /** Pozycja lustra wody (0..1 od dołu). */
  waterline?: number;
  /** Wołane po zbudowaniu/zmianie litery — zwraca jej realny box w px. */
  onLayout?: (box: LetterBox) => void;
  className?: string;
};

export default function WaterLetter({
  letter = "L",
  fontFamily = "Cinzel, serif",
  fontWeight = 600,
  gold = [216, 193, 160],
  letterFrac = 0.45,
  waterline = 0.42,
  onLayout,
  className = "",
}: WaterLetterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: true,
    });
    if (!gl) {
      console.error("[WaterLetter] brak WebGL");
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ---- shadery ----
    const vsSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }`;

    const fsSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTex;
      uniform float uTime;
      uniform float uWater;
      void main() {
        vec2 uv = vUv;
        vec4 col = vec4(0.0);
        if (uv.y >= uWater) {
          // górna część — litera bez zniekształceń
          col = texture2D(uTex, uv);
        } else {
          // odbicie: współrzędną lustrzamy względem linii wody
          float depth = uWater - uv.y;        // 0 przy tafli, rośnie w dół
          float t = uTime;
          // sumowane fale o różnych częstotliwościach = naturalna woda
          float wave = sin(uv.x * 22.0 + t * 1.3) * 0.4
                     + sin(uv.x * 9.0  - t * 0.9) * 0.6
                     + sin((uv.x + uv.y) * 40.0 + t * 2.1) * 0.2;
          float k = smoothstep(0.0, 0.05, depth); // złagodź tuż przy tafli
          vec2 ruv;
          ruv.x = uv.x + wave * 0.010 * (0.4 + depth * 1.5) * k;
          ruv.y = uWater + depth + sin(uv.x * 30.0 + t * 1.7) * 0.006 * depth * k;
          vec4 refl = texture2D(uTex, ruv);
          float fade = exp(-depth * 3.2);       // odbicie gaśnie z głębią
          refl.rgb *= 0.55;                      // i jest ciemniejsze
          col = refl * fade;
        }
        // delikatny błysk na linii wody (tylko tam gdzie jest litera)
        float surf = smoothstep(0.012, 0.0, abs(uv.y - uWater));
        col.rgb += vec3(0.95, 0.84, 0.62) * surf * col.a * 0.6;
        gl_FragColor = col;
      }`;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        console.error("[WaterLetter] shader:", gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // pełnoekranowy trójkąt
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(prog, "uTex");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uWater = gl.getUniformLocation(prog, "uWater");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // teksturę „w górę" jak w GL

    // ---- rysowanie litery na offscreen 2D i upload jako tekstura ----
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;
    let W = 0;
    let H = 0;
    let dpr = 1;

    const buildTexture = () => {
      off.width = Math.floor(W * dpr);
      off.height = Math.floor(H * dpr);
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, W, H);

      const fontPx = H * letterFrac;
      octx.font = `${fontWeight} ${fontPx}px ${fontFamily}`;
      octx.textAlign = "center";
      octx.textBaseline = "alphabetic";
      const [r, g, b] = gold;
      octx.fillStyle = `rgb(${r},${g},${b})`;
      // poświata
      octx.shadowColor = `rgba(${r},${g},${b},0.55)`;
      octx.shadowBlur = fontPx * 0.12;
      const baselineY = H * (1 - waterline); // litera „stoi" na tafli
      octx.fillText(letter, W / 2, baselineY);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);

      // policz przybliżony box litery i zgłoś w górę (px w przestrzeni ekranu)
      const cap = fontPx * 0.7; // przybliżona wysokość wersaliki
      const top = baselineY - cap;
      onLayout?.({
        cx: W / 2,
        cy: top + cap / 2,
        w: cap * 0.6, // przybliżona szerokość — dostrój pod konkretny font/literę
        h: cap,
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // mierz z okna — clientWidth/Height na skalowanym/filtrowanym rodzicu
      // potrafi zwrócić aspekt inny niż wyświetlany → spłaszczenie litery
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // DEBUG: porównaj aspekt bufora z aspektem wyświetlania
      const r = canvas.getBoundingClientRect();
      console.log(
        "[WaterLetter] buffer",
        W,
        "x",
        H,
        "| display",
        Math.round(r.width),
        "x",
        Math.round(r.height),
        "| aspect buf",
        (W / H).toFixed(3),
        "disp",
        (r.width / r.height).toFixed(3),
      );

      buildTexture();
    };

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = reduce ? 0 : (now - t0) / 1000;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1i(uTex, 0);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uWater, waterline);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    // czekamy aż font będzie gotowy, potem przebudowujemy teksturę
    resize();
    if (document.fonts) {
      document.fonts.ready.then(() => buildTexture());
    }
    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [letter, fontFamily, fontWeight, gold, letterFrac, waterline, onLayout]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
