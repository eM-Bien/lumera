type SprigProps = {
  /** pozycja nasady względem kontenera, w % */
  left: string;
  top: string;
  /** rozmiar w px */
  size?: number | string;
  /** obrót bazowy w stopniach */
  rotate?: number;
  /** czas jednego wahnięcia [s] i opóźnienie [s] — różnicuj między gałązkami */
  sway?: number;
  delay?: number;
  /** lustrzane odbicie w poziomie */
  flip?: boolean;
  color?: string;
  flowerScale?: number;
};

export default function Spring({
  left,
  top,
  size = 90,
  rotate = 0,
  sway = 6,
  delay = 0,
  flip = false,
  color = "#d8c1a0",
  flowerScale = 1,
}: SprigProps) {
  const dim = typeof size === "number" ? `${size}px` : size;

  return (
    <span
      style={{
        position: "absolute",
        left,
        top,
        width: dim,
        height: `calc(${dim} * 1.6)`,
        // nasada na dole-środku: kołysanie obraca się stąd, jak prawdziwa łodyga
        transformOrigin: "50% 100%",
        transform: `translate(-50%, -100%) rotate(${rotate}deg) scaleX(${flip ? -1 : 1})`,
        pointerEvents: "none",
        opacity: 0.85,
        animation: `sprigSway ${sway}s ease-in-out ${delay}s infinite`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 60 100" width="100%" height="100%" fill="none">
        {/* łodyga */}
        <path
          d="M30 100 C 30 70, 28 50, 30 20"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* listki wzdłuż łodygi */}
        <g transform="translate(30 50) scale(0.7) translate(-30 -50)">
          <path
            d="M30 72 C 18 66, 12 56, 16 48 C 26 52, 31 62, 30 72 Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M30 58 C 42 52, 48 42, 44 34 C 34 38, 29 48, 30 58 Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M30 44 C 20 38, 15 30, 18 23 C 27 27, 31 35, 30 44 Z"
            fill={color}
            opacity="0.45"
          />
        </g>
        {/* kwiatki na szczycie */}
        {/* kwiat: 5 płatków wokół środka */}
        <g
          transform={`translate(30 18) scale(${flowerScale}) translate(-30 -18)`}
        >
          <circle cx="30" cy="18" r="3.2" fill={color} opacity="0.75" />
          <circle cx="24" cy="22" r="2.4" fill={color} opacity="0.6" />
          <circle cx="36" cy="22" r="2.4" fill={color} opacity="0.6" />
        </g>
      </svg>
    </span>
  );
}
