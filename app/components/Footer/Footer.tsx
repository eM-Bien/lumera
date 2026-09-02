import styles from "./Footer.module.css";

const AUTHOR_EMAIL = "m.lena.bienkowska@gmail.com";

/**
 * Wąski pasek autorski na dole każdej strony (renderowany raz w layoucie).
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.credit}>
          created by{" "}
          <a className={styles.name} href={`mailto:${AUTHOR_EMAIL}`}>
            Magda Bieńkowska
          </a>{" "}
          &copy; {year}
        </span>
      </div>
    </footer>
  );
}
