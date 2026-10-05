import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Burst, Disc, Floaters, MaskLine, Pill, Swoosh, Sweep, usePop } from "../../kit";
import { at } from "./tt";

const CX = 540;
const CY = 935;
const ORBIT = ["bus", "ticket", "meals", "staff"];
const RX = 390;
const RY = 215;

const Ripple: React.FC<{ readonly start: number; readonly offset: number; readonly color: string }> = ({ start, offset, color }) => {
  const frame = useCurrentFrame();
  const t = ((frame - start + offset) % 90) / 90;
  return (
    <div
      style={{
        position: "absolute",
        left: CX - 200,
        top: CY - 200,
        width: 400,
        height: 400,
        borderRadius: 200,
        border: `5px solid ${color}`,
        scale: 0.8 + t * 2.4,
        opacity: frame >= start ? (1 - t) * 0.55 : 0,
      }}
    />
  );
};

const Orbiter: React.FC<{ readonly i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const p = usePop(at(6, 2, i * 3), 12);
  const a = (i / ORBIT.length) * Math.PI * 2 + frame * 0.028;
  const depth = (Math.sin(a) + 1) / 2;
  const s = (0.8 + depth * 0.32) * Math.min(1, p);
  const r = Math.min(1, p);
  return (
    <div
      style={{
        position: "absolute",
        left: CX + Math.cos(a) * RX * r - 52,
        top: CY + Math.sin(a) * RY * r - 52,
        scale: s,
        opacity: Math.min(1, p * 1.4) * (0.75 + depth * 0.25),
        zIndex: depth > 0.5 ? 3 : 1,
        filter: "drop-shadow(0 14px 22px rgba(18,66,124,0.28))",
      }}
    >
      <Disc icon={ORBIT[i]} size={104} />
    </div>
  );
};

// White premium outro: stacked rotating pattern rings, brand ripples, the trip icons orbiting the logo, drawn swoosh.
export const TripOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(at(6, 2, -2), 12);
  const badge = usePop(at(6, 3, 0), 11);
  const url = usePop(at(6, 3, 14), 12);
  const rings = usePop(2, 16);
  const breathe = 1 + 0.012 * Math.sin(frame / 12);

  return (
    <AbsoluteFill name="Outro" style={{ backgroundColor: C.white }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F1F6FC 100%)" }} />
      <Interactive.Div name="Ring A" style={{ position: "absolute", left: -310, top: 120, width: 1700, height: 1700, opacity: 0.26 * Math.min(1, rings), rotate: `${frame * 0.45}deg`, scale: 0.8 + rings * 0.2 }}>
        <Img src={staticFile("patterns/primary-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>
      <Interactive.Div name="Ring B" style={{ position: "absolute", left: -20, top: 385, width: 1120, height: 1120, opacity: 0.2 * Math.min(1, rings), rotate: `${-frame * 0.8}deg`, scale: 0.7 + rings * 0.3 }}>
        <Img src={staticFile("patterns/heritage-ring-color.svg")} style={{ width: "100%", height: "100%" }} />
      </Interactive.Div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 72%)" }} />
      <Floaters tone="dark" />

      {[0, 30, 60].map((o, i) => (
        <Ripple key={o} start={at(6, 2, -2)} offset={o} color={[C.desert, C.sea, C.nature][i]} />
      ))}

      <div style={{ position: "absolute", left: 90, right: 90, top: 280 }}>
        <MaskLine name="Line 1" delay={at(6, 0, -8)} dur={9} size={84} weight={500} color={C.seaDark}>
          من التخطيط للعودة
        </MaskLine>
        <MaskLine name="Line 2" delay={at(6, 1)} dur={9} size={150} weight={900} color={C.desert} style={{ marginTop: 6 }}>
          بنجهزها لك
        </MaskLine>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4, marginLeft: -30 }}>
          <Swoosh at={at(6, 1, 12)} width={470} thickness={12} color={C.sea} />
        </div>
      </div>
      <Burst at={at(6, 1)} x={540} y={520} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

      <Interactive.Div name="Logo" style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center", scale: (0.5 + logo * 0.5) * breathe, opacity: Math.min(1, logo), zIndex: 2 }}>
        <div style={{ position: "relative", width: 600 }}>
          <Img src={staticFile("logos/original-horizontal.svg")} style={{ width: 600 }} />
          <Sweep at={at(6, 2, 6)} dur={28} />
        </div>
      </Interactive.Div>

      {ORBIT.map((_, i) => (
        <Orbiter key={i} i={i} />
      ))}

      <Interactive.Div name="Schools badge" style={{ position: "absolute", left: 0, right: 0, top: 1285, display: "flex", justifyContent: "center", scale: 0.5 + badge * 0.5, opacity: Math.min(1, badge) }}>
        <div style={{ position: "relative" }}>
          <Pill bg={C.desert} color={C.white} size={68} weight={700}>
            للمدارس
          </Pill>
          <Sweep at={at(6, 3, 6)} radius={140} />
        </div>
      </Interactive.Div>
      <Burst at={at(6, 3)} x={540} y={1370} colors={[C.desert, C.sea, C.nature, C.desert, "#A31E22", C.sea]} />

      <Interactive.Div
        name="Website"
        style={{ position: "absolute", left: 0, right: 0, top: 1470, display: "flex", justifyContent: "center", scale: (0.6 + url * 0.4) * (1 + 0.015 * Math.sin(frame / 7)), opacity: Math.min(1, url) }}
      >
        <div style={{ position: "relative", direction: "ltr", fontFamily: FONT, fontWeight: 600, fontSize: 60, letterSpacing: 2, color: C.white, backgroundColor: C.sea, padding: "26px 58px", borderRadius: 120, boxShadow: "0 18px 40px rgba(25,89,166,0.35)" }}>
          guestna-edu.com
          <Sweep at={at(6, 3, 22)} radius={120} />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
