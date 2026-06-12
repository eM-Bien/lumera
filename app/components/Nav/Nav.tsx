"use client";

import { usePathname } from "next/navigation";
import LinkNav from "../LinkNav/LinkNav";
import styles from "./Nav.module.css";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", name: "O Lumera" },
  { href: "/zabiegi", name: "Zabiegi" },
  { href: "/kontakt", name: "Kontakt" },
];

const HOME_DELAY = 4200;

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [show, setShow] = useState(() => pathname !== "/");

  useEffect(() => {
    if (!isHome) return;
    const seen = sessionStorage.getItem("lumera_intro_seen") === "true";
    const delay = seen ? 0 : HOME_DELAY;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [isHome]);

  return (
    <nav className={`${styles.nav} ${show ? styles.visible : ""}`}>
      {links.map(({ href, name }) => (
        <LinkNav key={href} href={href} name={name} />
      ))}
      {!isHome && <LinkNav href="/" name="powrót" />}
    </nav>
  );
}
