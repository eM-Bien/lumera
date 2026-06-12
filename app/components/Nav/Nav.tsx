"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LinkNav from "../LinkNav/LinkNav";
import styles from "./Nav.module.css";

const links = [
  { href: "/about", name: "O Lumera" },
  { href: "/zabiegi", name: "Zabiegi" },
  { href: "/kontakt", name: "Kontakt" },
];

const HOME_DELAY_MS = 4200;

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [show, setShow] = useState(() => pathname !== "/");
  const [open, setOpen] = useState(false); // hamburger na mobile

  useEffect(() => {
    if (!isHome) return;
    const seen = sessionStorage.getItem("lumera_intro_seen") === "true";
    const t = setTimeout(() => setShow(true), seen ? 0 : HOME_DELAY_MS);
    return () => clearTimeout(t);
  }, [isHome]);

  const visibleLinks = links.filter((link) => link.href !== pathname);

  return (
    <nav className={`${styles.nav} ${show ? styles.visible : ""}`}>
      <button
        type="button"
        className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
        aria-label={open ? "Zamknij menu" : "Otwórz menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
        {visibleLinks.map(({ href, name }, i) => (
          <span
            key={href}
            className={styles.linkItem}
            style={{ "--i": i } as React.CSSProperties}
          >
            <LinkNav href={href} name={name} onClick={() => setOpen(false)} />
          </span>
        ))}
        {!isHome && (
          <LinkNav
            href="/"
            name="Powrót"
            onClick={() => setOpen(false)}
            style={{ "--i": visibleLinks.length } as React.CSSProperties}
          />
        )}
      </div>
    </nav>
  );
}
