import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import { C } from "../../brand";
import { Burst, Disc, Floaters, MaskLine, Pill, Ring, usePop } from "../../kit";

/**
 * Brand smoke test: font, logo, official pattern, official icons and the motion kit, without any external media.
 * Copy this folder (`npm run new:video -- my-video`) to start a new video.
 */
export const BrandDemo: React.FC = () => {
  const logo = usePop(4, 13);
  const pill = usePop(60, 12);

  return (
    <AbsoluteFill name="Brand demo" style={{ backgroundColor: C.sea }}>
      <Ring speed={0.7} opacity={0.16} top={120} />
      <Floaters />

      <Interactive.Div
        name="Logo"
        style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center", scale: 0.6 + logo * 0.4, opacity: Math.min(1, logo) }}
      >
        <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 420 }} />
      </Interactive.Div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 680 }}>
        <MaskLine name="Line 1" delay={14} size={150}>
          كل شي جاهز
        </MaskLine>
        <MaskLine name="Line 2" delay={24} size={110} color={C.desert}>
          الخط والهوية والحركة
        </MaskLine>
      </div>

      <Interactive.Div
        name="Icons"
        style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", gap: 36 }}
      >
        <Disc icon="bus" size={170} />
        <Disc icon="hotel" size={170} />
        <Disc icon="camping" size={170} />
      </Interactive.Div>

      <Interactive.Div
        name="Pill"
        style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", justifyContent: "center", scale: 0.6 + pill * 0.4, opacity: Math.min(1, pill) }}
      >
        <Pill bg={C.desert} color={C.white} size={52}>
          بيئة الإنتاج تعمل
        </Pill>
      </Interactive.Div>
      <Burst at={60} x={540} y={1430} />
    </AbsoluteFill>
  );
};
