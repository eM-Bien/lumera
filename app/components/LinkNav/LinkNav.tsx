import styles from "./LinkNav.module.css";
import Link from "next/link";
import { useTransition } from "@/app/transition/TransitionProvider";
import Arrow from "../Arrow/Arrow";

type LinkNavProps = {
  href: string;
  name: string;
  onClick?: () => void;
};

export default function LinkNav({ href, name, onClick }: LinkNavProps) {
  const { navigate } = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
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
