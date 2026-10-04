import React from "react";
import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import { C, FONT } from "../../brand";
import { Clip, MaskLine, Pill, usePop } from "../../kit";
import { at, dur } from "./timing";

// AI-generated opening: Saudi schoolboys boarding a school bus (Veo 3.1 Fast).
export const BusScene: React.FC = () => {
  const logo = usePop(at(2, 2), 12);
  const chip1 = usePop(at(2, 3), 12);
  const chip2 = usePop(at(2, 4), 12);

  return (
    <AbsoluteFill name="Bus" style={{ backgroundColor: C.seaDark }}>
      <Clip src="media/edu/ai-bus.mp4" total={dur(2)} zoomFrom={1.04} zoomTo={1.16} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(18,66,124,0.62) 0%, rgba(18,66,124,0.12) 30%, rgba(18,66,124,0) 50%, rgba(18,66,124,0.5) 100%)",
        }}
      />

      <div style={{ position: "absolute", left: 90, right: 90, top: 290 }}>
        <MaskLine name="Line 1" delay={at(2, 0)} size={146}>
          خارج الفصل
        </MaskLine>
        <MaskLine name="Line 2" delay={at(2, 1)} size={146} color={C.desert}>
          تبدأ المغامرة
        </MaskLine>
      </div>

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          scale: 0.7 + logo * 0.3,
          opacity: Math.min(1, logo),
          filter: "drop-shadow(0 8px 28px rgba(8,30,66,0.65))",
        }}
      >
        <div style={{ direction: "rtl", fontFamily: FONT, fontWeight: 700, fontSize: 48, color: C.white }}>مع</div>
        <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 520 }} />
      </Interactive.Div>

      <Interactive.Div
        name="Ready programs"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1360,
          display: "flex",
          justifyContent: "center",
          scale: 0.6 + chip1 * 0.4,
          opacity: Math.min(1, chip1),
        }}
      >
        <Pill bg={C.desert} color={C.white} size={50}>
          برامج مدرسية جاهزة
        </Pill>
      </Interactive.Div>
      <Interactive.Div
        name="Custom programs"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1470,
          display: "flex",
          justifyContent: "center",
          scale: 0.6 + chip2 * 0.4,
          opacity: Math.min(1, chip2),
        }}
      >
        <Pill bg={C.white} color={C.seaDark} size={50}>
          أو نصمّمها ونخطّطها معك
        </Pill>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
