"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LinkNav from "../LinkNav/LinkNav";
import CartIcon from "../CartIcon/CartIcon";
import styles from "./Nav.module.css";

const links = [
  { href: "/o-lumera", name: "Kim jesteśmy?" },
  { href: "/oferta", name: "Zabiegi" },
  { href: "/ebooki", name: "Ebooki" },
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

  const offset = isHome ? 0 : 1;

  return (
    <nav className={`${styles.nav} ${show ? styles.visible : ""}`}>
      <span className={styles.cartMobile}>
        <CartIcon onClick={() => setOpen(false)} />
      </span>

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
        {/* Strona główna zawsze pierwsza (jeśli nie jesteśmy na niej) */}
        {!isHome && (
          <span
            className={styles.linkItem}
            style={{ "--i": 0 } as React.CSSProperties}
          >
            <LinkNav
              href="/"
              name="Strona główna"
              onClick={() => setOpen(false)}
            />
          </span>
        )}

        {visibleLinks.map(({ href, name }, i) => (
          <span
            key={href}
            className={styles.linkItem}
            style={{ "--i": i + offset } as React.CSSProperties}
          >
            <LinkNav href={href} name={name} onClick={() => setOpen(false)} />
          </span>
        ))}

        {/* koszyk na końcu rzędu linków — tylko desktop */}
        <span className={`${styles.linkItem} ${styles.cartDesktop}`}>
          <CartIcon onClick={() => setOpen(false)} />
        </span>
      </div>
    </nav>
  );
}
