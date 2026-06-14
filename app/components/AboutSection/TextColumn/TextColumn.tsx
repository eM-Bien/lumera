// TextColumn.tsx
import styles from "./TextColumn.module.css";
import ScrollReveal from "../../ScrollReveal/ScrollReveal";

type Props = {
  align?: "left" | "right";
  paragraphs: string[];
};

export default function TextColumn({ align = "left", paragraphs }: Props) {
  return (
    <section className={`${styles.block} ${styles[align]}`}>
      <div className={styles.column}>
        {paragraphs.map((text, i) => (
          <ScrollReveal key={i} as="p" className={styles.p} text={text} />
        ))}
      </div>
    </section>
  );
}
