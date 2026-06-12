"use client";

import { useEffect, useRef } from "react";

export interface InkBackgroundProps {
  /** Kolor atramentu jako RGB 0–1. Domyślnie ciepły bronz LUMERA. */
  ink?: [number, number, number];
  /** Siła barwnika przy ruchu (0–1). */
  intensity?: number;
  /** Jak szybko atrament znika (większe = szybciej). */
  dissipation?: number;
  /** Wielkość plamy spod kursora. */
  splatRadius?: number;
  /** Warstwa canvasu. Daj wartość WYŻSZĄ niż tło/zdjęcie, by atrament był widoczny. */
  zIndex?: number;
  /** Tryb mieszania, np. 'screen' rozjaśnia ciemne tło jak świetlne smugi. */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Klasa CSS na canvasie. */
  className?: string;
}

/**
 * InkBackground — pełnoekranowa symulacja cieczy (WebGL2).
 * Atrament płynie i rozmywa się za kursorem na całej stronie.
 * Odpowiednik efektu tła z immersive-g.com, w palecie LUMERA.
 *
 * Użycie: umieść raz, np. w layout.tsx, jako tło pod treścią.
 *   <InkBackground />
 * Canvas ma pointer-events: none, więc nie blokuje klikania w treść.
 */
export default function InkBackground({
  ink = [0.42, 0.3, 0.15],
  intensity = 0.32,
  dissipation = 1.1,
  splatRadius = 0.15,
  zIndex = 0,
  blendMode = "normal",
  className,
}: InkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const CONFIG = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: dissipation,
      VELOCITY_DISSIPATION: 0.3,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 18,
      SPLAT_RADIUS: splatRadius,
      SPLAT_FORCE: 5500,
      INK: ink,
      INTENSITY: intensity,
    };

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.warn("InkBackground: WebGL2 niedostępne");
      return;
    }
    gl.getExtension("EXT_color_buffer_float");
    const supportLinear = !!gl.getExtension("OES_texture_float_linear");

    // ----- shadery -----
    const baseVertex = `#version 300 es
    precision highp float;
    in vec2 aPosition; out vec2 vUv, vL, vR, vT, vB; uniform vec2 texelSize;
    void main(){ vUv = aPosition*0.5+0.5;
      vL=vUv-vec2(texelSize.x,0.); vR=vUv+vec2(texelSize.x,0.);
      vT=vUv+vec2(0.,texelSize.y); vB=vUv-vec2(0.,texelSize.y);
      gl_Position=vec4(aPosition,0.,1.); }`;
    const clearShader = `#version 300 es
    precision highp float; in vec2 vUv; uniform sampler2D uTexture; uniform float value; out vec4 o;
    void main(){ o = value * texture(uTexture, vUv); }`;
    const splatShader = `#version 300 es
    precision highp float; in vec2 vUv; uniform sampler2D uTarget;
    uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; out vec4 o;
    void main(){ vec2 p = vUv - point.xy; p.x *= aspectRatio;
      vec3 splat = exp(-dot(p,p)/radius) * color;
      vec3 base = texture(uTarget, vUv).xyz; o = vec4(base + splat, 1.0); }`;
    const advectionShader = `#version 300 es
    precision highp float; in vec2 vUv; uniform sampler2D uVelocity, uSource;
    uniform vec2 texelSize; uniform float dt; uniform float dissipation; out vec4 o;
    void main(){ vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
      o = texture(uSource, coord) / (1.0 + dissipation * dt); }`;
    const divergenceShader = `#version 300 es
    precision highp float; in vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity; out vec4 o;
    void main(){ float L=texture(uVelocity,vL).x; float R=texture(uVelocity,vR).x;
      float T=texture(uVelocity,vT).y; float B=texture(uVelocity,vB).y;
      vec2 C=texture(uVelocity,vUv).xy;
      if(vL.x<0.0) L=-C.x; if(vR.x>1.0) R=-C.x; if(vT.y>1.0) T=-C.y; if(vB.y<0.0) B=-C.y;
      o = vec4(0.5*(R-L+T-B),0.,0.,1.); }`;
    const curlShader = `#version 300 es
    precision highp float; in vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity; out vec4 o;
    void main(){ float L=texture(uVelocity,vL).y; float R=texture(uVelocity,vR).y;
      float T=texture(uVelocity,vT).x; float B=texture(uVelocity,vB).x;
      o = vec4(0.5*(R-L-T+B),0.,0.,1.); }`;
    const vorticityShader = `#version 300 es
    precision highp float; in vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity, uCurl;
    uniform float curl; uniform float dt; out vec4 o;
    void main(){ float L=texture(uCurl,vL).x; float R=texture(uCurl,vR).x;
      float T=texture(uCurl,vT).x; float B=texture(uCurl,vB).x; float C=texture(uCurl,vUv).x;
      vec2 force = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
      force /= length(force)+0.0001; force *= curl * C; force.y *= -1.0;
      vec2 vel = texture(uVelocity,vUv).xy; vel += force*dt;
      vel = clamp(vel,-1000.0,1000.0); o = vec4(vel,0.,1.); }`;
    const pressureShader = `#version 300 es
    precision highp float; in vec2 vUv, vL, vR, vT, vB; uniform sampler2D uPressure, uDivergence; out vec4 o;
    void main(){ float L=texture(uPressure,vL).x; float R=texture(uPressure,vR).x;
      float T=texture(uPressure,vT).x; float B=texture(uPressure,vB).x;
      float div=texture(uDivergence,vUv).x; o = vec4((L+R+B+T-div)*0.25,0.,0.,1.); }`;
    const gradientShader = `#version 300 es
    precision highp float; in vec2 vUv, vL, vR, vT, vB; uniform sampler2D uPressure, uVelocity; out vec4 o;
    void main(){ float L=texture(uPressure,vL).x; float R=texture(uPressure,vR).x;
      float T=texture(uPressure,vT).x; float B=texture(uPressure,vB).x;
      vec2 vel=texture(uVelocity,vUv).xy; vel -= vec2(R-L,T-B); o = vec4(vel,0.,1.); }`;
    const displayShader = `#version 300 es
    precision highp float; in vec2 vUv; uniform sampler2D uTexture; out vec4 o;
    void main(){ vec3 c=texture(uTexture,vUv).rgb;
      c = c / (1.0 + c);                              // tonemap — koniec z prześwietleniem
      float a = clamp(max(c.r,max(c.g,c.b)), 0.0, 1.0);
      o = vec4(c, a); }`;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (
        !gl!.getShaderParameter(s, gl!.COMPILE_STATUS) &&
        !gl!.isContextLost()
      ) {
        console.error("InkBackground shader:", gl!.getShaderInfoLog(s));
      }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, baseVertex);
    function program(fragSrc: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, vs);
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, fragSrc));
      gl!.linkProgram(p);
      if (
        !gl!.getProgramParameter(p, gl!.LINK_STATUS) &&
        !gl!.isContextLost()
      ) {
        console.error("InkBackground program:", gl!.getProgramInfoLog(p));
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const n = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const name = gl!.getActiveUniform(p, i)!.name;
        uniforms[name] = gl!.getUniformLocation(p, name);
      }
      return { program: p, uniforms };
    }

    const programs = {
      clear: program(clearShader),
      splat: program(splatShader),
      advection: program(advectionShader),
      divergence: program(divergenceShader),
      curl: program(curlShader),
      vorticity: program(vorticityShader),
      pressure: program(pressureShader),
      gradient: program(gradientShader),
      display: program(displayShader),
    };

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW,
    );
    const ebuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    type FBO = ReturnType<typeof createFBO>;
    function createFBO(
      w: number,
      h: number,
      internal: number,
      format: number,
      type: number,
      filter: number,
    ) {
      gl!.activeTexture(gl!.TEXTURE0);
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        tex,
        0,
      );
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return {
        texture: tex,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, tex);
          return id;
        },
      };
    }
    function createDoubleFBO(
      w: number,
      h: number,
      internal: number,
      format: number,
      type: number,
      filter: number,
    ) {
      let a = createFBO(w, h, internal, format, type, filter);
      let b = createFBO(w, h, internal, format, type, filter);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        get read() {
          return a;
        },
        set read(v: FBO) {
          a = v;
        },
        get write() {
          return b;
        },
        set write(v: FBO) {
          b = v;
        },
        swap() {
          const t = a;
          a = b;
          b = t;
        },
      };
    }

    const filtering = supportLinear ? gl.LINEAR : gl.NEAREST;
    let dye: ReturnType<typeof createDoubleFBO>;
    let velocity: ReturnType<typeof createDoubleFBO>;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressure: ReturnType<typeof createDoubleFBO>;

    function getResolution(res: number) {
      let aspect = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(res),
        max = Math.round(res * aspect);
      return gl!.drawingBufferWidth > gl!.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }
    function initFramebuffers() {
      const s = getResolution(CONFIG.SIM_RESOLUTION);
      const d = getResolution(CONFIG.DYE_RESOLUTION);
      const t = gl!.HALF_FLOAT;
      dye = createDoubleFBO(
        d.width,
        d.height,
        gl!.RGBA16F,
        gl!.RGBA,
        t,
        filtering,
      );
      velocity = createDoubleFBO(
        s.width,
        s.height,
        gl!.RG16F,
        gl!.RG,
        t,
        filtering,
      );
      divergence = createFBO(
        s.width,
        s.height,
        gl!.R16F,
        gl!.RED,
        t,
        gl!.NEAREST,
      );
      curlFBO = createFBO(s.width, s.height, gl!.R16F, gl!.RED, t, gl!.NEAREST);
      pressure = createDoubleFBO(
        s.width,
        s.height,
        gl!.R16F,
        gl!.RED,
        t,
        gl!.NEAREST,
      );
    }

    function blit(target: FBO | null) {
      if (target == null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function setCanvasSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas!.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      const changed = canvas!.width !== w || canvas!.height !== h;
      canvas!.width = w;
      canvas!.height = h;
      // canvas!.style.width = window.innerWidth + "px";
      // canvas!.style.height = window.innerHeight + "px";
      return changed;
    }
    function resize() {
      if (setCanvasSize()) initFramebuffers();
    }
    setCanvasSize();
    initFramebuffers(); // zawsze twórz bufory dla bieżącego montażu
    window.addEventListener("resize", resize);

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      gl!.useProgram(programs.curl.program);
      gl!.uniform2f(
        programs.curl.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl!.useProgram(programs.vorticity.program);
      gl!.uniform2f(
        programs.vorticity.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(
        programs.vorticity.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl!.uniform1i(programs.vorticity.uniforms.uCurl, curlFBO.attach(1));
      gl!.uniform1f(programs.vorticity.uniforms.curl, CONFIG.CURL);
      gl!.uniform1f(programs.vorticity.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(programs.divergence.program);
      gl!.uniform2f(
        programs.divergence.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(
        programs.divergence.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      blit(divergence);

      gl!.useProgram(programs.clear.program);
      gl!.uniform1i(programs.clear.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(programs.clear.uniforms.value, CONFIG.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      gl!.useProgram(programs.pressure.program);
      gl!.uniform2f(
        programs.pressure.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(
        programs.pressure.uniforms.uDivergence,
        divergence.attach(0),
      );
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(
          programs.pressure.uniforms.uPressure,
          pressure.read.attach(1),
        );
        blit(pressure.write);
        pressure.swap();
      }

      gl!.useProgram(programs.gradient.program);
      gl!.uniform2f(
        programs.gradient.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(
        programs.gradient.uniforms.uPressure,
        pressure.read.attach(0),
      );
      gl!.uniform1i(
        programs.gradient.uniforms.uVelocity,
        velocity.read.attach(1),
      );
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(programs.advection.program);
      gl!.uniform2f(
        programs.advection.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
      gl!.uniform1i(
        programs.advection.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl!.uniform1i(
        programs.advection.uniforms.uSource,
        velocity.read.attach(0),
      );
      gl!.uniform1f(programs.advection.uniforms.dt, dt);
      gl!.uniform1f(
        programs.advection.uniforms.dissipation,
        CONFIG.VELOCITY_DISSIPATION,
      );
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(
        programs.advection.uniforms.uVelocity,
        velocity.read.attach(0),
      );
      gl!.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
      gl!.uniform2f(
        programs.advection.uniforms.texelSize,
        dye.texelSizeX,
        dye.texelSizeY,
      );
      gl!.uniform1f(
        programs.advection.uniforms.dissipation,
        CONFIG.DENSITY_DISSIPATION,
      );
      blit(dye.write);
      dye.swap();
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: number[],
    ) {
      gl!.useProgram(programs.splat.program);
      gl!.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(
        programs.splat.uniforms.aspectRatio,
        canvas!.width / canvas!.height,
      );
      gl!.uniform2f(programs.splat.uniforms.point, x, y);
      gl!.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0);
      gl!.uniform1f(
        programs.splat.uniforms.radius,
        CONFIG.SPLAT_RADIUS / 100.0,
      );
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(
        programs.splat.uniforms.color,
        color[0],
        color[1],
        color[2],
      );
      blit(dye.write);
      dye.swap();
    }

    function renderToScreen() {
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.useProgram(programs.display.program);
      gl!.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false };
    function updatePointer(clientX: number, clientY: number) {
      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight;
      pointer.dx = (x - pointer.x) * CONFIG.SPLAT_FORCE;
      pointer.dy = (y - pointer.y) * CONFIG.SPLAT_FORCE;
      pointer.x = x;
      pointer.y = y;
      pointer.moved = pointer.dx !== 0 || pointer.dy !== 0;
    }
    const onPointer = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length)
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("touchmove", onTouch, { passive: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.016);
      last = now;
      if (pointer.moved) {
        pointer.moved = false;
        // Ilość barwnika zależna od PRĘDKOŚCI ruchu (0–1):
        // wolny ruch = ślad, szybki = pełny. Eliminuje kumulację w jednym punkcie.
        const dist = Math.hypot(pointer.dx, pointer.dy) / CONFIG.SPLAT_FORCE;
        const speedScale = Math.min(dist * 80.0, 1.0);
        const k = CONFIG.INTENSITY * speedScale;
        const c = [CONFIG.INK[0] * k, CONFIG.INK[1] * k, CONFIG.INK[2] * k];
        splat(pointer.x, pointer.y, pointer.dx, pointer.dy, c);
      }
      step(dt);
      renderToScreen();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      // UWAGA: celowo NIE wołamy loseContext(). W trybie deweloperskim
      // React (Strict Mode) montuje efekt dwukrotnie: montuje → sprząta →
      // montuje ponownie. Zniszczenie kontekstu w sprzątaniu sprawia, że ten
      // sam <canvas> przy drugim montażu zwraca utracony kontekst, a shadery
      // "kompilują się" na martwym kontekście → błędy na starcie. Pętla i
      // słuchacze są zatrzymane powyżej; kontekst zwolni GC przy odmontowaniu.
    };
  }, [ink, intensity, dissipation, splatRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex,
        mixBlendMode: blendMode,
      }}
      aria-hidden="true"
    />
  );
}
