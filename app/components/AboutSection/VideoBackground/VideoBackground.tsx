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
        preload="auto"
        poster="/about/bg-clouds-poster.jpg"
        aria-hidden="true"
      >
        {/* WebM preferowany (mniejszy), MP4 jako fallback */}
        <source src="/about/bg-clouds.webm" type="video/webm" />
        <source src="/about/bg-clouds.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} aria-hidden="true" />
    </>
  );
}
