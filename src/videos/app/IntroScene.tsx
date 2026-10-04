import React from "react";
import {
  AbsoluteFill,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, EASE, FONT, Reveal } from "../../brand";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Logo: symbol side appears first, wordmark follows in reading direction (right to left)
  const logoIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const logoReveal = interpolate(frame, [8, 40], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  // Logo lifts up when the tagline arrives
  const logoLift = interpolate(frame, [44, 66], [0, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <AbsoluteFill name="Intro" style={{ backgroundColor: C.sea }}>
      <Interactive.Div
        name="Ring watermark"
        style={{
          position: "absolute",
          left: -260,
          top: 300,
          width: 1600,
          height: 1600,
          opacity: 0.14,
          rotate: interpolate(frame, [0, 100], ["0deg", "16.2deg"]),
        }}
      >
        <Img
          src={staticFile("patterns/primary-ring-white.svg")}
          style={{ width: "100%", height: "100%" }}
        />
      </Interactive.Div>

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 780,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          translate: `0px ${logoLift}px`,
        }}
      >
        <Img
          src={staticFile("logos/white-horizontal.svg")}
          style={{
            width: 640,
            clipPath: `inset(0 0 0 ${logoReveal}%)`,
          }}
        />
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 900,
          direction: "rtl",
          textAlign: "center",
          fontFamily: FONT,
          color: C.white,
        }}
      >
        <Reveal
          name="Tagline line 1"
          delay={48}
          style={{ fontSize: 132, fontWeight: 900, lineHeight: 1.15 }}
        >
          شوف المملكة
        </Reveal>
        <Reveal
          name="Tagline line 2"
          delay={58}
          style={{
            fontSize: 132,
            fontWeight: 900,
            lineHeight: 1.15,
            color: C.desert,
          }}
        >
          بعيون جستنا
        </Reveal>
        <Reveal
          name="Subtitle"
          delay={78}
          style={{
            fontSize: 48,
            fontWeight: 500,
            marginTop: 40,
            opacity: 0.92,
          }}
        >
          أنشطة سياحية، تجارب، مغامرات وأكثر
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
