import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { clamp, Floaters, MaskLine, Pic, Pill, Ring, useIn, usePop } from "../../kit";
import { at, dur } from "./timing";

const R = 150;
const CIRC = 2 * Math.PI * R;

const DayRing: React.FC<{
  readonly delay: number;
  readonly fraction: number;
  readonly label: string;
  readonly color: string;
  readonly segments?: number;
}> = ({ delay, fraction, label, color, segments }) => {
  const pop = usePop(delay, 13);
  const fill = useIn(delay + 2, 18);
  const arcs = segments ?? 1;
  const gap = segments ? 26 : 0;
  const seg = (CIRC - gap * arcs) / arcs;
  return (
    <Interactive.Div
      name="Day ring"
      style={{ width: 280, height: 280, position: "relative", scale: 0.5 + pop * 0.5, opacity: Math.min(1, pop) }}
    >
      <svg width={280} height={280} viewBox="0 0 420 420" style={{ rotate: "-90deg" }}>
        <circle cx={210} cy={210} r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={44} />
        {segments ? (
          Array.from({ length: arcs }).map((_, i) => {
            const part = interpolate(fill, [i / arcs, (i + 1) / arcs], [0, 1], clamp);
            return (
              <circle
                key={i}
                cx={210}
                cy={210}
                r={R}
                fill="none"
                stroke={i % 2 === 0 ? color : C.white}
                strokeWidth={44}
                strokeDasharray={`${seg * part} ${CIRC}`}
                strokeDashoffset={-(i * (seg + gap))}
              />
            );
          })
        ) : (
          <circle
            cx={210}
            cy={210}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={44}
            strokeLinecap="round"
            strokeDasharray={`${CIRC * fraction * fill} ${CIRC}`}
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 50,
          lineHeight: 1.05,
          textAlign: "center",
          color: C.white,
          whiteSpace: "pre-line",
        }}
      >
        {label}
      </div>
    </Interactive.Div>
  );
};

const Tile: React.FC<{ readonly delay: number; readonly label: string; readonly src: string; readonly total: number; readonly position?: string }> = ({
  delay,
  label,
  src,
  total,
  position,
}) => {
  const pop = usePop(delay, 12);
  return (
    <Interactive.Div
      name={`Tile ${label}`}
      style={{
        position: "relative",
        width: 458,
        height: 300,
        borderRadius: 44,
        overflow: "hidden",
        backgroundColor: C.seaDark,
        scale: 0.55 + pop * 0.45,
        rotate: `${(1 - Math.min(1, pop)) * -7}deg`,
        opacity: Math.min(1, pop * 1.4),
      }}
    >
      <Pic src={src} total={total} from={1.0} to={1.2} position={position} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, display: "flex", justifyContent: "center" }}>
        <Pill size={42}>{label}</Pill>
      </div>
    </Interactive.Div>
  );
};

export const ProgramsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const total = dur(5);
  const moveAt = at(5, 3, -22);
  const stageAt = at(5, 7);
  const ringsOut = interpolate(frame, [stageAt - 12, stageAt], [1, 0], clamp);
  const stage = useIn(stageAt, 12);
  const cap = useIn(at(5, 3), 10);
  const ringMove = interpolate(frame, [moveAt, moveAt + 22], [0, 1], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill name="Programs" style={{ backgroundColor: C.sea }}>
      <Ring speed={0.7} opacity={0.12} top={40} />
      <Floaters />

      {/* Half day, full day, multi-day */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 600,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          direction: "rtl",
          opacity: ringsOut,
          transformOrigin: "50% 0%",
          translate: `0px ${ringMove * -330 + (1 - ringsOut) * -40}px`,
          scale: 1.05 - ringMove * 0.2,
        }}
      >
        <DayRing delay={at(5, 0)} fraction={0.5} label={"نصف\nيوم"} color={C.white} />
        <DayRing delay={at(5, 1)} fraction={1} label={"يوم\nكامل"} color={C.desert} />
        <DayRing delay={at(5, 2)} fraction={1} label={"متعددة\nالأيام"} color={C.desert} segments={3} />
      </div>

      {/* Stage banner */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 300, textAlign: "center", opacity: stage }}>
        <MaskLine name="Stage text" delay={stageAt} size={100}>
          لكل مرحلة دراسية
        </MaskLine>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 22, height: 220, marginTop: 20 }}>
          {[70, 120, 170, 220].map((h, i) => {
            const g = interpolate(frame, [stageAt + 4 + i * 4, stageAt + 16 + i * 4], [0, 1], { ...clamp, easing: EASE });
            return <div key={h} style={{ width: 84, height: h * g, borderRadius: 22, backgroundColor: i === 3 ? C.desert : C.white }} />;
          })}
        </div>
      </div>

      {/* Activities (AI images, Saudi students) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", opacity: cap }}>
        <Pill bg={C.desert} color={C.white} size={48}>
          أنشطة متنوعة
        </Pill>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 960,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          direction: "rtl",
        }}
      >
        <Tile delay={at(5, 3, 8)} label="رياضية" src="media/edu/ai/sports.jpg" total={total} position="55% 60%" />
        <Tile delay={at(5, 4)} label="علمية" src="media/edu/ai/science.jpg" total={total} position="50% 50%" />
        <Tile delay={at(5, 5)} label="فنية" src="media/edu/ai/art.jpg" total={total} position="50% 45%" />
        <Tile delay={at(5, 6)} label="ترفيهية" src="media/edu/ai/fun.jpg" total={total} position="50% 50%" />
      </div>
    </AbsoluteFill>
  );
};
