"use client";

import { useTransition } from "@/app/transition/TransitionProvider";
import { useCart } from "@/app/components/Ebooks/Cart/CartContext";
import styles from "./CartIcon.module.css";

type CartIconProps = {
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function CartIcon({ onClick, style }: CartIconProps) {
  const { navigate } = useTransition();
  const { totalCount } = useCart();

  const handleClick = () => {
    onClick?.(); // np. zamknięcie menu na mobile
    navigate("/koszyk");
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleClick}
      style={style}
      aria-label={`Koszyk${totalCount > 0 ? `, ${totalCount} w środku` : ""}`}
    >
      <span className={styles.icon} aria-hidden="true" />
      {totalCount > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {totalCount}
        </span>
      )}
    </button>
  );
}
