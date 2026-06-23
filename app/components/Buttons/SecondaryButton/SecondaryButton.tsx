"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "./SecondaryButton.module.css";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export default function SecondaryButton({
  children,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${fullWidth ? styles.fullWidth : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
