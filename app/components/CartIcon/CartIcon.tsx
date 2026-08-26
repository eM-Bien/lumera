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
  const { totalCount, hydrated } = useCart();

  const handleClick = () => {
    onClick?.();
    navigate("/koszyk");
  };

  const showBadge = hydrated && totalCount > 0;

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleClick}
      style={style}
      aria-label={`Koszyk${showBadge ? `, ${totalCount} w środku` : ""}`}
    >
      <span className={styles.icon} aria-hidden="true" />
      {showBadge && (
        <span className={styles.badge} aria-hidden="true">
          {totalCount}
        </span>
      )}
    </button>
  );
}
