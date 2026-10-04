import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { Burst, clamp, Disc, Floaters, MaskLine, Pill, Ring, useIn, usePop } from "../../kit";
import { at } from "./timing";

const Row: React.FC<{ readonly top: number; readonly delay: number; readonly icon: string; readonly label: string }> = ({ top, delay, icon, label }) => {
  const pop = usePop(delay, 13);
  const tick = usePop(delay + 9, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top,
        height: 190,
        borderRadius: 48,
        backgroundColor: C.white,
        direction: "rtl",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "0 40px",
        fontFamily: FONT,
        scale: 0.85 + pop * 0.15,
        opacity: Math.min(1, pop * 1.3),
        translate: `${(1 - Math.min(1, pop)) * 120}px 0px`,
      }}
    >
      <Disc icon={icon} size={126} bg="#D1DEED" />
      <div style={{ flex: 1, fontSize: 64, fontWeight: 900, color: C.seaDark, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ width: 86, height: 86, borderRadius: 43, backgroundColor: C.desert, display: "flex", alignItems: "center", justifyContent: "center", scale: tick }}>
        <svg width={50} height={50} viewBox="0 0 64 64">
          <path d="M12 34 L27 48 L52 16" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export const LogisticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const routeAt = at(8, 3);
  const route = interpolate(frame, [routeAt + 4, routeAt + 24], [0, 1], { ...clamp, easing: EASE });
  const pins = useIn(routeAt, 8);
  const trackX0 = 880;
  const trackX1 = 200;
  const busX = trackX0 + (trackX1 - trackX0) * route;
  const routeY = 1110;

  return (
    <AbsoluteFill name="Logistics" style={{ backgroundColor: C.sea }}>
      <Ring speed={0.7} opacity={0.12} top={200} />
      <Floaters />

      <Row top={270} delay={at(8, 0)} icon="bus" label="النقل والباصات" />
      <Row top={490} delay={at(8, 1)} icon="staff" label="المشرفين" />
      <Row top={710} delay={at(8, 2)} icon="meals" label="الوجبات" />

      <svg width={1080} height={400} style={{ position: "absolute", left: 0, top: routeY - 200 }}>
        <line x1={trackX0} y1={200} x2={trackX1} y2={200} stroke="rgba(255,255,255,0.28)" strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" opacity={pins} />
        <line x1={trackX0} y1={200} x2={busX} y2={200} stroke={C.desert} strokeWidth={12} strokeLinecap="round" opacity={pins} />
        <circle cx={trackX0} cy={200} r={26} fill={C.white} opacity={pins} />
        <circle cx={trackX1} cy={200} r={26} fill={route > 0.97 ? C.desert : C.white} opacity={pins} />
      </svg>
      <div style={{ position: "absolute", left: busX - 75, top: routeY - 81, opacity: pins }}>
        <Disc icon="bus" size={150} />
      </div>
      <div style={{ position: "absolute", top: routeY + 100, right: 1080 - trackX0 - 100, opacity: pins }}>
        <Pill size={42} bg="rgba(255,255,255,0.18)" color={C.white}>
          التخطيط
        </Pill>
      </div>
      <div style={{ position: "absolute", top: routeY + 100, left: trackX1 - 100, opacity: pins }}>
        <Pill size={42} bg="rgba(255,255,255,0.18)" color={C.white}>
          العودة
        </Pill>
      </div>

      <div style={{ position: "absolute", left: 90, right: 90, top: 1380 }}>
        <MaskLine name="Ready" delay={at(8, 4)} size={146} color={C.desert}>
          بنجهزها لك
        </MaskLine>
      </div>
      <Burst at={at(8, 4)} x={540} y={1470} />
    </AbsoluteFill>
  );
};
