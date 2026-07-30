import type { ReactNode } from "react";
import { PageHeading, DecorativeSubtitle, Description } from "./Typography";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  className?: string;
};

/**
 * Wspólny nagłówek podstrony: tytuł + ozdobny podtytuł + opis.
 * Pomija te elementy, których nie przekażesz. Rozmiary/fonty pochodzą
 * z tokenów w globals.css (--page-title-*, --page-subtitle-*, --page-desc-*).
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      {title != null && <PageHeading>{title}</PageHeading>}
      {subtitle != null && <DecorativeSubtitle>{subtitle}</DecorativeSubtitle>}
      {description != null && <Description>{description}</Description>}
    </header>
  );
}
