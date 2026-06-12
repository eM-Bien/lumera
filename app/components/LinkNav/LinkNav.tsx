import styles from "./LinkNav.module.css";
import Link from "next/link";
import { useTransition } from "@/app/transition/TransitionProvider";
import Arrow from "../Arrow/Arrow";

type LinkNavProps = {
  href: string;
  name: string;
};

export default function LinkNav({ href, name }: LinkNavProps) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} className={`${styles.navButton}`} onClick={handleClick}>
      <span className={styles.blob} aria-hidden="true" />
      <span className={styles.label}>{name}</span>
      <Arrow />
    </Link>
  );
}
