import Arrow from "../Arrow/Arrow";
import styles from "./Nav.module.css";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/about" className={`${styles.navButton}`}>
        <span className={styles.blob} aria-hidden="true" />
        <span className={styles.label}>O Lumera</span>
        <Arrow />
      </Link>
      <Link href="/test" className={`${styles.navButton}`}>
        <span className={styles.blob} aria-hidden="true" />
        <span className={styles.label}>Zabiegi</span>
        <Arrow />
      </Link>
    </nav>
  );
}
