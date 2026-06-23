import styles from "./LinkNav.module.css";
import Link from "next/link";
import { useTransition } from "@/app/transition/TransitionProvider";
import Arrow from "../Arrow/Arrow";

type LinkNavProps = {
  href: string;
  name: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  icon?: string; // ścieżka do SVG w /public; brak = strzałka (Arrow)
};

export default function LinkNav({
  href,
  name,
  onClick,
  style,
  icon,
}: LinkNavProps) {
  const { navigate } = useTransition();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
    navigate(href);
  };
  return (
    <Link
      href={href}
      className={styles.navButton}
      onClick={handleClick}
      style={style}
    >
      <span className={styles.blob} aria-hidden="true" />
      <span className={styles.label}>{name}</span>
      {icon ? (
        <span
          className={styles.icon}
          aria-hidden="true"
          style={{ ["--icon-url" as string]: `url(${icon})` }}
        />
      ) : (
        <Arrow />
      )}
    </Link>
  );
}
