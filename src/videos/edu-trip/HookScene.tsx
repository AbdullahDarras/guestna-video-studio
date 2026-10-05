import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { clamp, Disc, Dolly, Floaters, MaskLine, Ring, Sweep, usePop } from "../../kit";
import { at, dur } from "./timing";

// "كل شي للرحلة المدرسية، تلقاه عندنا": weights contrast (Black huge, Light, Bold) and a light sweep on the key phrase.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = usePop(2, 13);
  const tag = usePop(at(1, 1), 11);
  const underline = interpolate(frame, [at(1, 0, 14), at(1, 0, 30)], [0, 1], { ...clamp, easing: EASE });
  const icons = ["bus", "ticket", "meals", "staff"];

  return (
    <AbsoluteFill name="Hook" style={{ backgroundColor: C.sea }}>
      <Dolly total={dur(1)}>
        <Ring speed={0.7} opacity={0.16} top={120} />
        <Floaters />

        <Interactive.Div
          name="Logo"
          style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", scale: 0.6 + logo * 0.4, opacity: Math.min(1, logo) }}
        >
          <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 400 }} />
        </Interactive.Div>

        <div style={{ position: "absolute", left: 90, right: 90, top: 560 }}>
          <MaskLine name="Big" delay={at(1, 0)} size={270} weight={900}>
            كل شي
          </MaskLine>
          <MaskLine name="Light" delay={at(1, 0, 6)} size={104} weight={300} style={{ marginTop: -10 }}>
            للرحلة المدرسية
          </MaskLine>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <div style={{ height: 8, width: 520 * underline, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>

        <Interactive.Div
          name="Tag"
          style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center", scale: 0.6 + tag * 0.4, opacity: Math.min(1, tag) }}
        >
          <div
            style={{
              position: "relative",
              direction: "rtl",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 104,
              color: C.white,
              backgroundColor: C.desert,
              padding: "28px 84px 40px",
              borderRadius: 200,
            }}
          >
            تلقاه عندنا
            <Sweep at={at(1, 1, 8)} radius={200} />
          </div>
        </Interactive.Div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", justifyContent: "center", gap: 34 }}>
          {icons.map((icon, i) => (
            <PopIcon key={icon} icon={icon} delay={at(1, 1, 10 + i * 4)} />
          ))}
        </div>
      </Dolly>
    </AbsoluteFill>
  );
};

const PopIcon: React.FC<{ readonly icon: string; readonly delay: number }> = ({ icon, delay }) => {
  const p = usePop(delay, 12);
  return (
    <div style={{ scale: 0.4 + p * 0.6, opacity: Math.min(1, p * 1.4) }}>
      <Disc icon={icon} size={130} />
    </div>
  );
};
