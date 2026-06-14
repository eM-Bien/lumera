import styles from "./SectionHeading.module.css";
import ScrollReveal from "../../ScrollReveal/ScrollReveal";

type Props = {
  text: string;
  align?: "left" | "right";
};

export default function SectionHeading({ text, align = "left" }: Props) {
  return (
    <section className={`${styles.header} ${styles[align]}`}>
      <ScrollReveal as="h2" className={styles.title} text={text} />
    </section>
  );
}
