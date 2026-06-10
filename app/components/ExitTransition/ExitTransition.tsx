import Image from "next/image";
import styles from "./ExitTransition.module.css";

type ExitTransitionProps = {
  exiting?: boolean;
  /** Ścieżka do logo — domyślnie to samo co w LumeraReveal. */
  logoSrc?: string;
};

export default function ExitTransition({
  exiting = false,
  logoSrc = "/lumera-logo.svg",
}: ExitTransitionProps) {
  return (
    <>
      {/* zaciemnienie — zamyka się od krawędzi */}
      <div
        className={`${styles.fade} ${exiting ? styles.fadeActive : ""}`}
        aria-hidden="true"
      />
      {/* logo — rośnie nad zaciemnieniem */}
      <div
        className={`${styles.logo} ${exiting ? styles.logoActive : ""}`}
        aria-hidden="true"
      >
        <Image src={logoSrc} alt="" fill style={{ objectFit: "contain" }} />
      </div>
    </>
  );
}
