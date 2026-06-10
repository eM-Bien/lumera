import styles from "./page.module.css";
import ScrollReveal from "./ScrollReveal";

export default function About() {
  return (
    <main className={styles.about}>
      <section className={styles.hero}>
        <ScrollReveal as="h1" className={styles.h1} text="O Lumera" />
      </section>

      <section className={styles.block}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae ornare leo. Sed nisi odio, laoreet blandit efficitur nec, rhoncus eget mi. Sed ac nunc ac orci semper faucibus sed sed purus. Vestibulum fermentum mi neque, id auctor diam laoreet id. Integer molestie ut nibh eu semper. Integer consectetur massa sit amet diam volutpat, in consequat elit maximus. Ut eu mauris sit amet ex pulvinar posuere tempor eget orci. Aenean scelerisque a eros sit amet laoreet. Aliquam laoreet arcu id bibendum suscipit. Curabitur vel sapien tortor. Vivamus commodo dignissim turpis in fermentum. Curabitur faucibus lorem risus, feugiat placerat dolor tempus id. Sed et tempor mauris, eu venenatis diam. Aenean ut pulvinar nisi. Proin tincidunt nulla sit amet turpis mattis, sit amet ultrices eros finibus. Nam varius magna eget tortor tincidunt, a sagittis elit placerat."
        />
      </section>

      <section className={styles.block}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Sed do eiusmod tempor incididunt ut labore et dolore magna"
        />
      </section>

      <section className={styles.block}>
        <ScrollReveal
          as="h2"
          className={styles.h2}
          text="Ut enim ad minim veniam quis nostrud exercitation ullamco"
        />
      </section>

      <div className={styles.spacer} />
    </main>
  );
}
