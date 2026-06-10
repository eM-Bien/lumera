import styles from "./LinkNav.module.css";
import Link from "next/link";
import Arrow from "../Arrow/Arrow";

type LinkNavProps = {
  href: string;
  name: string;
};

export default function LinkNav({ href, name }: LinkNavProps) {
  return (
    <Link href={href} className={`${styles.navButton}`}>
      <span className={styles.blob} aria-hidden="true" />
      <span className={styles.label}>{name}</span>
      <Arrow />
    </Link>
  );
}
