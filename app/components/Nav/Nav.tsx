import styles from "./Nav.module.css";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
