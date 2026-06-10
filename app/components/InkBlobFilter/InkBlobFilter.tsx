/**
 * InkBlobFilter — definicja filtra SVG dla "atramentowego" brzegu plamy w NavButton.
 * Umieść JEDEN RAZ na stronie (np. w layout.tsx, tuż po <body>).
 * Filtr nic nie renderuje wizualnie — to tylko <defs> dla CSS `url(#lumera-ink-blob)`.
 *
 * feTurbulence generuje szum, feDisplacementMap zniekształca nim plamę,
 * a animacja baseFrequency sprawia, że brzeg powoli "faluje" jak rozlany atrament.
 */
export default function InkBlobFilter() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <filter
          id="lumera-ink-blob"
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.02"
            numOctaves={2}
            seed={7}
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="16s"
              values="0.014 0.02; 0.022 0.013; 0.014 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={36}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
