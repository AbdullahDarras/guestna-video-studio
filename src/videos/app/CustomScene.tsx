import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, IconDisc, Reveal, SceneFade } from "../../brand";

export const CustomScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade>
      <AbsoluteFill name="Custom" style={{ backgroundColor: C.sea }}>
        <Interactive.Div
          name="Ring watermark"
          style={{
            position: "absolute",
            left: -260,
            top: 250,
            width: 1600,
            height: 1600,
            opacity: 0.13,
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
            top: 520,
            direction: "rtl",
            textAlign: "center",
            fontFamily: FONT,
            color: C.white,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Reveal name="Ready icon" delay={6} style={{ marginBottom: 36 }}>
            <IconDisc icon="ticket" size={170} />
          </Reveal>
          <Reveal name="Ready" delay={10} style={{ fontSize: 124, fontWeight: 900, lineHeight: 1.15 }}>
            تجربة جاهزة
          </Reveal>

          <Reveal name="Or" delay={42} style={{ fontSize: 64, fontWeight: 500, margin: "44px 0", opacity: 0.85 }}>
            أو
          </Reveal>

          <Reveal name="Custom icon" delay={52} style={{ marginBottom: 36 }}>
            <IconDisc icon="camping" size={170} />
          </Reveal>
          <Reveal
            name="Custom"
            delay={57}
            style={{ fontSize: 124, fontWeight: 900, lineHeight: 1.15, color: C.desert }}
          >
            خصّص مغامرتك
          </Reveal>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
