"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "./PrimaryButton.module.css";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export default function PrimaryButton({
  children,
  fullWidth = false,
  className = "",
  type = "button",
  ...rest
}: PrimaryButtonProps) {
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
