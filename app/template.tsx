"use client";

import { useEffect, useState } from "react";
import styles from "./template.module.css";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [entered, setEntered] = useState(isHome);

  useEffect(() => {
    if (isHome) return;

    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`${styles.enter} ${entered ? styles.entered : ""}`}>
      {children}
    </div>
  );
}
