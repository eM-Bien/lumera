import styles from "./VideoBackground.module.css";

export default function VideoBackground() {
  return (
    <>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster="/about/poster.jpg"
        aria-hidden="true"
      >
        <source src="/about/tlo.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} aria-hidden="true" />
    </>
  );
}
