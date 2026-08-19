"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InkBackground from "../InkBackground/InkBackground";

/**
 * Globalny „pył" za kursorem (InkBackground) na wszystkich podstronach.
 * Wyjątki: strona główna ma własny wariant, koszyk jest wyłączony,
 * a na urządzeniach dotykowych / mobile efekt się nie pojawia.
 */
export default function CursorInk() {
  const pathname = usePathname();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!desktop) return null;
  if (pathname === "/") return null; // strona główna ma własny InkBackground
  if (pathname?.startsWith("/koszyk")) return null;

  return (
    <InkBackground
      zIndex={1}
      blendMode="screen"
      ink={[0.95, 0.82, 0.55]}
      intensity={0.7}
      dissipation={1.1}
    />
  );
}
