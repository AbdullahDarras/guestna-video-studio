import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { Burst, clamp, MaskLine, Pill, usePop } from "../../kit";
import { at } from "./timing";

// White outro with the original-colour logo and the official colour patterns.
// Scene starts at 50.95s. Voice: "Guest Na للمدارس" 51.2s, "رحلة مدرسية" 53.1s, "ما تتكرر" 54.3s
export const EduOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(at(9, 0, -2), 12);
  const badge = usePop(at(9, 0, 14), 11);
  const url = usePop(at(9, 2, 14), 12);
  const line = interpolate(frame, [at(9, 2), at(9, 2, 20)], [0, 1], { ...clamp, easing: EASE });
  
  return (
    <AbsoluteFill name="Outro" style={{ backgroundColor: C.white }}>
      <Interactive.Div
        name="Ring"
        style={{
          position: "absolute",
          left: -310,
          top: 90,
          width: 1700,
          height: 1700,
          opacity: 0.3,
          rotate: `${frame * 0.9}deg`,
        }}
      >
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>
      {/* keeps text areas calm over the pattern */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 45%, rgba(255,255,255,0) 78%)" }} />

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 290,
          display: "flex",
          justifyContent: "center",
          scale: 0.5 + logo * 0.5,
          opacity: Math.min(1, logo),
        }}
      >
        <Img src={staticFile("logos/original-horizontal.svg")} style={{ width: 720 }} />
      </Interactive.Div>

      <Interactive.Div
        name="Schools badge"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          display: "flex",
          justifyContent: "center",
          scale: 0.5 + badge * 0.5,
          opacity: Math.min(1, badge),
        }}
      >
        <Pill bg={C.desert} color={C.white} size={78}>
          للمدارس
        </Pill>
      </Interactive.Div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 860 }}>
        <MaskLine name="Line 1" delay={at(9, 1)} size={150} color={C.seaDark}>
          رحلة مدرسية
        </MaskLine>
        <div style={{ position: "relative" }}>
          <MaskLine name="Line 2" delay={at(9, 2)} size={170} color={C.desert}>
            ما تتكرر
          </MaskLine>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ height: 14, width: 560 * line, borderRadius: 7, backgroundColor: C.sea }} />
          </div>
        </div>
      </div>
      <Burst at={at(9, 2)} x={540} y={1180} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />
      <Burst at={at(9, 2, 14)} x={540} y={1480} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

      <Interactive.Div
        name="Website"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          display: "flex",
          justifyContent: "center",
          scale: (0.6 + url * 0.4) * (1 + 0.018 * Math.sin(frame / 6)),
          opacity: Math.min(1, url),
        }}
      >
        <div
          style={{
            direction: "ltr",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 70,
            letterSpacing: 2,
            color: C.white,
            backgroundColor: C.sea,
            padding: "30px 64px",
            borderRadius: 120,
          }}
        >
          guestna-edu.com
        </div>
      </Interactive.Div>

    </AbsoluteFill>
  );
};
