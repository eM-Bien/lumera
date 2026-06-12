"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type TransitionPhase = "idle" | "exiting" | "settling";

type Ctx = { phase: TransitionPhase; navigate: (href: string) => void };

const TransitionContext = createContext<Ctx | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition musi być w TransitionProvider");
  return ctx;
}

const EXIT_MS = 850; // zagęszczanie + wirowanie zanim zmieni się trasa
const SETTLE_MS = 1100; // uspokajanie na nowej stronie

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const router = useRouter();
  const pathname = usePathname();
  const pendingRef = useRef(false); // czy czekamy na zmianę trasy

  const navigate = (href: string) => {
    if (phase !== "idle") return; // blokada podwójnego kliknięcia
    setPhase("exiting");
    pendingRef.current = true;
    setTimeout(() => router.push(href), EXIT_MS);
  };

  // gdy trasa faktycznie się zmieni po zainicjowanym wyjściu → uspokajanie
  useEffect(() => {
    if (!pendingRef.current) return; // pomija pierwszy mount
    pendingRef.current = false;
    setPhase("settling");
    const t = setTimeout(() => setPhase("idle"), SETTLE_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ phase, navigate }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionPhase(): TransitionPhase {
  const ctx = useContext(TransitionContext);
  return ctx?.phase ?? "idle";
}
