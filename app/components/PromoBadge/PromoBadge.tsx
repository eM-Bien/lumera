import styles from "./PromoBadge.module.css";

type PromoBadgeProps = {
  /** Tekst plakietki — domyślnie „Promocja". */
  label?: string;
  /** Dodatkowa klasa do pozycjonowania w miejscu użycia. */
  className?: string;
};

/**
 * Uniwersalna złota plakietka. Domyślnie „Promocja", ale można nadać
 * dowolny tekst (np. „Nowość", „Bestseller") i dołożyć klasę pozycjonującą.
 */
export default function PromoBadge({
  label = "Promocja",
  className,
}: PromoBadgeProps) {
  return (
    <span className={`${styles.badge} ${className ?? ""}`}>{label}</span>
  );
}
