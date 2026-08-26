"use client";

/**
 * Wejście na nową stronę obsługuje TransitionOverlay, a nie animacja opacity
 * całego poddrzewa strony.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
