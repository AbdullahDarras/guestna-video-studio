import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE } from "../../brand";
import { clamp, Floaters, MaskLine, Ring, usePop } from "../../kit";
import { at } from "./timing";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = usePop(2, 13);
  const underline = interpolate(frame, [at(1, 0, 12), at(1, 0, 26)], [0, 1], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill name="Hook" style={{ backgroundColor: C.sea }}>
      <Ring speed={0.7} opacity={0.16} top={120} />
      <Floaters />

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 260,
          display: "flex",
          justifyContent: "center",
          scale: 0.6 + pop * 0.4,
          opacity: Math.min(1, pop),
        }}
      >
        <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 380 }} />
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 650,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MaskLine name="Line 1" delay={at(1, 0)} size={200}>
          التعليم
        </MaskLine>
        <div style={{ position: "relative" }}>
          <MaskLine name="Line 2" delay={at(1, 0, 6)} size={200} color={C.desert}>
            بالترفيه
          </MaskLine>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 6,
              height: 16,
              width: 530 * underline,
              borderRadius: 8,
              backgroundColor: C.white,
            }}
          />
        </div>
        <MaskLine name="Line 3" delay={at(1, 1)} size={116} weight={700} style={{ marginTop: 30 }}>
          هو المستقبل
        </MaskLine>
      </div>
    </AbsoluteFill>
  );
};
