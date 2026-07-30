import { OFFERS } from "../OfferExplorer/offer-types";
import { TRYCHO_TREATMENTS } from "../OfferExplorer/trycho-types";

export type BookingOption = {
  id: string;
  title: string;
  group: "Twarz i ciało" | "Trychologia";
};

// Wszystkie zabiegi, które można wybrać w formularzu — połączone z obu katalogów.
export const BOOKING_OPTIONS: BookingOption[] = [
  ...OFFERS.map((o) => ({
    id: o.id,
    title: o.title,
    group: "Twarz i ciało" as const,
  })),
  ...TRYCHO_TREATMENTS.map((t) => ({
    id: t.id,
    title: t.title,
    group: "Trychologia" as const,
  })),
];

// Wartość dla „nie wiem / konsultacja" — także fallback, gdy id z linku nie pasuje.
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
