import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Burst, MaskLine, Pill, Swoosh, Sweep, usePop } from "../../kit";
import { at } from "./tt";

// Calm white outro: one faint pattern ring, headline, the logo with a light sweep, badge and URL. Nothing else.
export const TripOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(at(6, 2, -2), 12);
  const badge = usePop(at(6, 3, 0), 11);
  const url = usePop(at(6, 3, 12), 12);
  const ring = usePop(2, 16);
  const breathe = 1 + 0.01 * Math.sin(frame / 14);

  return (
    <AbsoluteFill name="Outro" style={{ backgroundColor: C.white }}>
      <Interactive.Div
        name="Ring"
        style={{ position: "absolute", left: -310, top: 120, width: 1700, height: 1700, opacity: 0.17 * Math.min(1, ring), rotate: `${frame * 0.4}deg`, scale: 0.85 + ring * 0.15 }}
      >
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 46%, rgba(255,255,255,0) 80%)" }} />

      <div style={{ position: "absolute", left: 90, right: 90, top: 350 }}>
        <MaskLine name="Line 1" delay={at(6, 0, -8)} dur={9} size={80} weight={500} color={C.seaDark}>
          من التخطيط للعودة
        </MaskLine>
        <MaskLine name="Line 2" delay={at(6, 1)} dur={9} size={140} weight={900} color={C.desert} style={{ marginTop: 10 }}>
          بنجهزها لك
        </MaskLine>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10, marginLeft: -30 }}>
          <Swoosh at={at(6, 1, 12)} width={440} thickness={11} color={C.sea} />
        </div>
      </div>
      <Burst at={at(6, 1)} x={540} y={510} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

      <Interactive.Div
        name="Logo"
        style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", scale: (0.55 + logo * 0.45) * breathe, opacity: Math.min(1, logo) }}
      >
        <div style={{ position: "relative", width: 560 }}>
          <Img src={staticFile("logos/original-horizontal.svg")} style={{ width: 560 }} />
          <Sweep at={at(6, 2, 6)} dur={28} />
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Schools badge"
        style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center", scale: 0.55 + badge * 0.45, opacity: Math.min(1, badge) }}
      >
        <div style={{ position: "relative" }}>
          <Pill bg={C.desert} color={C.white} size={62} weight={700}>
            للمدارس
          </Pill>
          <Sweep at={at(6, 3, 6)} radius={130} />
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Website"
        style={{ position: "absolute", left: 0, right: 0, top: 1370, display: "flex", justifyContent: "center", scale: 0.6 + url * 0.4, opacity: Math.min(1, url) }}
      >
        <div style={{ direction: "ltr", fontFamily: FONT, fontWeight: 500, fontSize: 56, letterSpacing: 2, color: C.sea }}>guestna-edu.com</div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
