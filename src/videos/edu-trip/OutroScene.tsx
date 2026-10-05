import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { Burst, clamp, Dolly, MaskLine, Pill, Sweep, usePop } from "../../kit";
import { at, dur } from "./timing";

// White outro with the original-colour logo (same closing as the other schools reel).
export const TripOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(at(6, 2, -2), 12);
  const badge = usePop(at(6, 3, 0), 11);
  const url = usePop(at(6, 3, 14), 12);
  const line = interpolate(frame, [at(6, 1), at(6, 1, 20)], [0, 1], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill name="Outro" style={{ backgroundColor: C.white }}>
      <Dolly total={dur(6)} outFrames={1}>
        <Interactive.Div name="Ring" style={{ position: "absolute", left: -310, top: 90, width: 1700, height: 1700, opacity: 0.3, rotate: `${frame * 0.9}deg` }}>
          <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
        </Interactive.Div>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 45%, rgba(255,255,255,0) 78%)" }} />

        <div style={{ position: "absolute", left: 60, right: 60, top: 330 }}>
          <MaskLine name="Line 1" delay={at(6, 0)} size={112} weight={500} color={C.seaDark}>
            من التخطيط للعودة
          </MaskLine>
          <div style={{ position: "relative" }}>
            <MaskLine name="Line 2" delay={at(6, 1)} size={168} weight={900} color={C.desert}>
              بنجهزها لك
            </MaskLine>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ height: 14, width: 620 * line, borderRadius: 7, backgroundColor: C.sea }} />
            </div>
          </div>
        </div>
        <Burst at={at(6, 1)} x={540} y={640} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

        <Interactive.Div name="Logo" style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", scale: 0.5 + logo * 0.5, opacity: Math.min(1, logo) }}>
          <Img src={staticFile("logos/original-horizontal.svg")} style={{ width: 720 }} />
        </Interactive.Div>
        <Interactive.Div name="Schools badge" style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", scale: 0.5 + badge * 0.5, opacity: Math.min(1, badge) }}>
          <div style={{ position: "relative" }}>
            <Pill bg={C.desert} color={C.white} size={78} weight={700}>
              للمدارس
            </Pill>
            <Sweep at={at(6, 3, 6)} radius={160} />
          </div>
        </Interactive.Div>
        <Burst at={at(6, 3)} x={540} y={1330} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

        <Interactive.Div
          name="Website"
          style={{ position: "absolute", left: 0, right: 0, top: 1470, display: "flex", justifyContent: "center", scale: (0.6 + url * 0.4) * (1 + 0.018 * Math.sin(frame / 6)), opacity: Math.min(1, url) }}
        >
          <div style={{ direction: "ltr", fontFamily: FONT, fontWeight: 600, fontSize: 70, letterSpacing: 2, color: C.white, backgroundColor: C.sea, padding: "30px 64px", borderRadius: 120 }}>guestna-edu.com</div>
        </Interactive.Div>
      </Dolly>
    </AbsoluteFill>
  );
};
