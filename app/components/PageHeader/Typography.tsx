import type { ElementType, ReactNode } from "react";
import styles from "./PageHeader.module.css";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

/** Główny tytuł podstrony (Playfair). Domyślnie <h1>, można zmienić przez `as`. */
export function PageHeading({
  children,
  className = "",
  as: As = "h1",
}: BaseProps & { as?: ElementType }) {
  return <As className={`${styles.title} ${className}`}>{children}</As>;
}

/** Ozdobny podtytuł (Parisienne). */
export function DecorativeSubtitle({ children, className = "" }: BaseProps) {
  return <p className={`${styles.subtitle} ${className}`}>{children}</p>;
}

/** Akapit opisu/wprowadzenia (Montserrat). */
export function Description({ children, className = "" }: BaseProps) {
  return <p className={`${styles.description} ${className}`}>{children}</p>;
}
