import LinkNav from "../LinkNav/LinkNav";
import styles from "./Nav.module.css";

const links = [
  { href: "/about", name: "O Lumera" },
  { href: "/zabiegi", name: "Zabiegi" },
  { href: "/kontakt", name: "Kontakt" },
];

export default function Nav({ show = false }: { show?: boolean }) {
  return (
    <nav className={`${styles.nav} ${show ? styles.visible : ""}`}>
      {links.map(({ href, name }) => (
        <LinkNav key={href} href={href} name={name} />
      ))}
    </nav>
  );
}
