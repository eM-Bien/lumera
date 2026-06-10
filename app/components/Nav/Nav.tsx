import LinkNav from "../LinkNav/LinkNav";
import styles from "./Nav.module.css";

const links = [
  { href: "/about", name: "O Lumera" },
  { href: "/zabiegi", name: "Zabiegi" },
];

export default function Nav() {
  return (
    <nav className={styles.nav}>
      {links.map(({ href, name }) => (
        <LinkNav key={href} href={href} name={name} />
      ))}
    </nav>
  );
}
