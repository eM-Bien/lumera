import styles from "./TextColumn.module.css";
import ScrollReveal from "../../ScrollReveal/ScrollReveal";

type Props = {
  align?: "left" | "right";
  paragraphs: string[];
  wide?: boolean;
};

export default function TextColumn({
  align = "left",
  paragraphs,
  wide = false,
}: Props) {
  return (
    <section
      className={`${styles.block} ${styles[align]} ${wide ? styles.wide : ""}`}
    >
      <div className={styles.column}>
        {paragraphs.map((text, i) => (
          <ScrollReveal key={i} as="p" className={styles.p} text={text} />
        ))}
      </div>
    </section>
  );
}
