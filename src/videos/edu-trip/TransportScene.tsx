import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../brand";
import { Burst, clamp, Disc, Floaters, Glow, MaskLine, Pill, Ring, usePop } from "../../kit";
import { buildRoute, pointAt, toPoints } from "./route";
import { at } from "./tt";

const STATIONS = [
  { x: 770, y: 700, icon: "bus", label: "الباصات" },
  { x: 310, y: 940, icon: "ticket", label: "الطيران" },
  { x: 770, y: 1180, icon: "staff", label: "المشرفين" },
  { x: 310, y: 1420, icon: "meeting-point", label: "خطط واضحة" },
];
const ROUTE = buildRoute(STATIONS);

const Station: React.FC<{ readonly i: number }> = ({ i }) => {
  const s = STATIONS[i];
  const pop = usePop(at(3, i + 1, -2), 12);
  return (
    <div style={{ position: "absolute", left: s.x - 62, top: s.y - 62, width: 124, display: "flex", flexDirection: "column", alignItems: "center", scale: 0.4 + pop * 0.6, opacity: Math.min(1, pop * 1.4) }}>
      <Disc icon={s.icon} size={124} />
      <div style={{ marginTop: 18 }}>
        <Pill size={40} weight={600}>
          {s.label}
        </Pill>
      </div>
    </div>
  );
};

export const TransportScene: React.FC = () => {
  const frame = useCurrentFrame();
  const arrive = [1, 2, 3, 4].map((k) => at(3, k, 4));
  const u = interpolate(frame, arrive, ROUTE.stationIdx, { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bus = pointAt(ROUTE.points, u);
  const busPop = usePop(at(3, 1, -8), 12);
  const traveled = ROUTE.points.slice(0, Math.floor(u) + 1).concat([bus]);
  // the dotted track draws itself while the title is spoken, so the scene is never empty
  const drawU = interpolate(frame, [at(3, 0, 6), at(3, 0, 40)], [0, ROUTE.points.length - 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const track = ROUTE.points.slice(0, Math.floor(drawU) + 1).concat([pointAt(ROUTE.points, drawU)]);

  return (
    <AbsoluteFill name="Transport" style={{ backgroundColor: C.sea }}>
        <Glow />
        <Ring speed={0.7} opacity={0.12} top={200} />
        <Floaters />

        <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
          <MaskLine name="Title" delay={at(3, 0, -8)} dur={9} size={104} weight={900}>
            نقل وترتيب كامل
          </MaskLine>
        </div>

        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <polyline points={toPoints(track)} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={10} strokeDasharray="2 26" strokeLinecap="round" />
          <polyline points={toPoints(traveled)} fill="none" stroke={C.desert} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={busPop} />
        </svg>

        {STATIONS.map((_, i) => (
          <Station key={i} i={i} />
        ))}

        <div style={{ position: "absolute", left: bus.x - 55, top: bus.y - 55, scale: busPop, opacity: Math.min(1, busPop) }}>
          <div style={{ borderRadius: 55, boxShadow: `0 0 0 9px ${C.desert}` }}>
            <Disc icon="bus" size={110} />
          </div>
        </div>
        <Burst at={at(3, 4, 4)} x={STATIONS[3].x} y={STATIONS[3].y} />
    </AbsoluteFill>
  );
};
