import styles from "./Footer.module.css";

const AUTHOR_EMAIL = "m.lena.bienkowska@gmail.com";

/**
 * Ogólna stopka każdej strony (renderowana raz w layoucie): duży znak
 * LUMÉRA i dolny pasek z prawami autorskimi. Formularz, litera L i dane
 * kontaktowe są na stronie /kontakt.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.wordmark} aria-hidden="true">
        LUMÉRA
      </div>

      <div className={styles.bottom}>
        <span>&copy; {year} Lumera · Wszelkie prawa zastrzeżone</span>
        <span>
          created by{" "}
          <a className={styles.author} href={`mailto:${AUTHOR_EMAIL}`}>
            mad-eline
          </a>
        </span>
      </div>
    </footer>
  );
}
