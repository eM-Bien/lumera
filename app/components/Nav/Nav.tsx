"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LinkNav from "../LinkNav/LinkNav";
import CartIcon from "../CartIcon/CartIcon";
import styles from "./Nav.module.css";

const links = [
  { href: "/o-lumera", name: "O Lumera" },
  { href: "/oferta", name: "Oferta" },
  { href: "/ebooki", name: "Ebooki" },
  { href: "/kontakt", name: "Kontakt" },
];

const HOME_DELAY_MS = 4200;

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isLight = pathname === "/oferta";
  const [show, setShow] = useState(() => pathname !== "/");
  const [open, setOpen] = useState(false); // hamburger na mobile

  useEffect(() => {
    if (!isHome) return;
    const seen = sessionStorage.getItem("lumera_intro_seen") === "true";
    const t = setTimeout(() => setShow(true), seen ? 0 : HOME_DELAY_MS);
    return () => clearTimeout(t);
  }, [isHome]);

  const visibleLinks = links.filter((link) => link.href !== pathname);

  // kolejny indeks animacji po linkach (i ewentualnym linku "Strona główna")
  const cartIndex = visibleLinks.length + (isHome ? 0 : 1);

  return (
    <nav
      className={`${styles.nav} ${show ? styles.visible : ""} ${isLight ? styles.light : ""}`}
    >
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
            name="Strona główna"
            onClick={() => setOpen(false)}
            style={{ "--i": visibleLinks.length } as React.CSSProperties}
          />
        )}
        <span
          className={styles.linkItem}
          style={{ "--i": cartIndex } as React.CSSProperties}
        >
          <CartIcon onClick={() => setOpen(false)} />
        </span>
      </div>
    </nav>
  );
}
