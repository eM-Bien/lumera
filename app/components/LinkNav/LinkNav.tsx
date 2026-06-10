import styles from "./LinkNav.module.css";
import Link from "next/link";
import Arrow from "../Arrow/Arrow";
import { on } from "events";

type LinkNavProps = {
  href: string;
  name: string;
  onNavigate?: (href: string) => void;
};

export default function LinkNav({ href, name, onNavigate }: LinkNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <Link href={href} className={`${styles.navButton}`} onClick={handleClick}>
      <span className={styles.blob} aria-hidden="true" />
      <span className={styles.label}>{name}</span>
      <Arrow />
    </Link>
  );
}
