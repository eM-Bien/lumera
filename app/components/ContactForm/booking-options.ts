import { BOOKING_FROM_PRICING } from "../Pricing/pricing-data";

export type BookingOption = {
  id: string;
  title: string;
  group: string;
};

// Opcje zabiegów wprost z cennika (PRICING) — jedno źródło prawdy, więc
// lista w formularzu zawsze zgadza się z linkami „Umów" z cennika.
export const BOOKING_OPTIONS: BookingOption[] = BOOKING_FROM_PRICING;

export const CONSULTATION_VALUE = "konsultacja";

/** Zwraca id zabiegu, jeśli istnieje w katalogu; inaczej wartość konsultacji. */
export function resolveBookingId(id: string | null | undefined): string {
  if (id && BOOKING_OPTIONS.some((o) => o.id === id)) return id;
  return CONSULTATION_VALUE;
}

/** Czytelna nazwa zabiegu po id (do maila/podsumowania). */
export function bookingTitle(id: string): string {
  if (id === CONSULTATION_VALUE) return "Konsultacja / nie wiem jeszcze";
  return BOOKING_OPTIONS.find((o) => o.id === id)?.title ?? id;
}
