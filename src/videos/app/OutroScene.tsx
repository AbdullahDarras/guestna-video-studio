import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, Reveal, SceneFade } from "../../brand";

// Scene starts at 25.4s; CTA voice at 25.7s
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade>
      <AbsoluteFill name="Outro" style={{ backgroundColor: C.sea }}>
        <Interactive.Div
          name="Ring watermark"
          style={{
            position: "absolute",
            left: -260,
            top: 200,
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

        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 300,
            direction: "rtl",
            textAlign: "center",
            fontFamily: FONT,
            color: C.white,
          }}
        >
          <Reveal name="CTA line 1" delay={8} style={{ fontSize: 140, fontWeight: 900, lineHeight: 1.15 }}>
            حمّل جستنا
          </Reveal>
          <Reveal
            name="CTA line 2"
            delay={22}
            style={{ fontSize: 108, fontWeight: 700, lineHeight: 1.25, color: C.desert }}
          >
            وابدأ رحلتك
          </Reveal>
        </div>

        <Reveal
          name="Logo"
          delay={60}
          style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}
        >
          <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 560 }} />
        </Reveal>

        <Reveal
          name="Store badges"
          delay={84}
          style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", justifyContent: "center" }}
        >
          <Img src={staticFile("logos/app-download-white.svg")} style={{ width: 640 }} />
        </Reveal>

        <Reveal
          name="Website"
          delay={104}
          style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center" }}
        >
          <Img src={staticFile("logos/web-white.svg")} style={{ width: 560 }} />
        </Reveal>
      </AbsoluteFill>
    </SceneFade>
  );
};
