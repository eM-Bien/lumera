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
    onClick?.(); // np. zamknięcie menu na mobile
    navigate("/koszyk");
  };

  // licznik dopiero po hydratacji — inaczej SSR(0) vs client(N) = mismatch
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
