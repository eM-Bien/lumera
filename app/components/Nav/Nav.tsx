import LinkNav from "../LinkNav/LinkNav";
import styles from "./Nav.module.css";

type NavProps = {
  show?: boolean;
  onNavigate?: (href: string) => void;
};

const links = [
  { href: "/about", name: "O Lumera" },
  { href: "/zabiegi", name: "Zabiegi" },
  { href: "/kontakt", name: "Kontakt" },
];

export default function Nav({ show = false, onNavigate }: NavProps) {
  return (
    <nav className={`${styles.nav} ${show ? styles.visible : ""}`}>
      {links.map(({ href, name }) => (
        <LinkNav key={href} href={href} name={name} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}
