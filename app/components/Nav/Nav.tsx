"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTransition } from "@/app/transition/TransitionProvider";
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
  const { navigate } = useTransition();
  const isHome = pathname === "/";
  const [show, setShow] = useState(() => pathname !== "/");
  const [open, setOpen] = useState(false);

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    navigate("/");
  };

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
      {/* księżyc z logo w lewym górnym rogu — link do strony głównej (nie na stronie głównej) */}
      {!isHome && (
        <Link
          href="/"
          className={styles.homeMoon}
          onClick={goHome}
          aria-label="Strona główna"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moon.svg" alt="Lumera — strona główna" />
        </Link>
      )}

      {/* koszyk zawsze widoczny obok hamburgera — tylko mobile */}
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
            <LinkNav
              href={href}
              name={name}
              onClick={() => setOpen(false)}
            />
          </span>
        ))}
      </div>

      {/* koszyk — poza pastylką, przypięty do prawej; tylko desktop */}
      <span className={`${styles.linkItem} ${styles.cartDesktop}`}>
        <CartIcon onClick={() => setOpen(false)} />
      </span>
    </nav>
  );
}
