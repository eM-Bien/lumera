"use client";
import LightsBackground from "./LightsBackground";

export default function TestBg() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        {/* <source src="/lumera-tlo.webm" type="video/webm" /> */}
        {/* <source src="/lumera-tlo.mp4" type="video/mp4" /> */}
        {/* <source src="test-bg.mp4" type="video/mp4" /> */}
      </video>

      <LightsBackground style={{ zIndex: 1 }} />
    </section>
  );
}
