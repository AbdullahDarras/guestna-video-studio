import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import { C, FONT } from "../../brand";
import { Disc, Floaters, Glow, MaskLine, Ring, Sweep, Swoosh, usePop } from "../../kit";
import { at } from "./tt";

// "كل شي للرحلة المدرسية، تلقاه عندنا": balanced sizes, weight contrast, a drawn swoosh instead of a plain rule.
const PopIcon: React.FC<{ readonly icon: string; readonly delay: number }> = ({ icon, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ scale: 0.4 + p * 0.6, opacity: Math.min(1, p * 1.4) }}>
      <Disc icon={icon} size={104} />
    </div>
  );
};

export const HookScene: React.FC = () => {
  const logo = usePop(2, 13);
  const tag = usePop(at(1, 1, -2), 11);
  const icons = ["bus", "ticket", "meals", "staff"];

  return (
    <AbsoluteFill name="Hook" style={{ backgroundColor: C.sea }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.sea} 0%, #174F94 100%)` }} />
      <Glow />
      <Ring speed={0.7} opacity={0.14} top={120} />
      <Floaters />

      <Interactive.Div
        name="Logo"
        style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", scale: 0.6 + logo * 0.4, opacity: Math.min(1, logo) }}
      >
        <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 340 }} />
      </Interactive.Div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 560 }}>
        <MaskLine name="Big" delay={at(1, 0)} dur={9} size={210} weight={900}>
          كل شي
        </MaskLine>
        <MaskLine name="Light" delay={at(1, 0, 4)} dur={9} size={78} weight={300} style={{ marginTop: 6 }}>
          للرحلة المدرسية
        </MaskLine>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginLeft: -30 }}>
          <Swoosh at={at(1, 0, 14)} width={420} thickness={11} color="rgba(255,255,255,0.8)" />
        </div>
      </div>

      <Interactive.Div
        name="Tag"
        style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", scale: 0.6 + tag * 0.4, opacity: Math.min(1, tag) }}
      >
        <div style={{ position: "relative", direction: "rtl", fontFamily: FONT, fontWeight: 700, fontSize: 68, color: C.white, backgroundColor: C.desert, padding: "22px 70px 32px", borderRadius: 200, boxShadow: "0 18px 40px rgba(238,139,34,0.35)" }}>
          تلقاه عندنا
          <Sweep at={at(1, 1, 6)} radius={200} />
        </div>
      </Interactive.Div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", gap: 30 }}>
        {icons.map((icon, i) => (
          <PopIcon key={icon} icon={icon} delay={at(1, 1, 6 + i * 3)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
