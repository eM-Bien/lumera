"use client";

/**
 * Wejście na nową stronę obsługuje TransitionOverlay (tanie wygaszanie
 * jednolitej nakładki), a nie animacja opacity całego poddrzewa strony.
 * Animowanie opacity na poddrzewie z backdrop-filter/blur potrafiło zacinać
 * przejście — nowa strona i tak maluje się „pod" nieprzezroczystą nakładką,
 * którą potem tanio wygaszamy.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
