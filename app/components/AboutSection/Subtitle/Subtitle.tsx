import styles from "./Subtitle.module.css";

export default function Subtitle({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.subtitleWrapper}>
      <p className={styles.subtitle}>{children}</p>
    </section>
  );
}
