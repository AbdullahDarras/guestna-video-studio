import React from "react";
import { AbsoluteFill, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { clamp, Disc, Floaters, MaskLine, Pill, Ring, usePop } from "../../kit";
import { at } from "./timing";

const Card: React.FC<{
  readonly top: number;
  readonly delay: number;
  readonly tidyAt: number;
  readonly icon: string;
  readonly label: string;
  readonly tilt: number;
  readonly shift: number;
}> = ({ top, delay, tidyAt, icon, label, tilt, shift }) => {
  const frame = useCurrentFrame();
  const pop = usePop(delay, 12);
  // Messy until Guest Na speeds it up, then snaps straight
  const tidy = interpolate(frame, [tidyAt, tidyAt + 12], [0, 1], { ...clamp, easing: EASE });
  const wobble = Math.sin(frame / 4 + tilt) * (1 - tidy) * 1.4;
  return (
    <Interactive.Div
      name={`Card ${label}`}
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top,
        height: 190,
        borderRadius: 46,
        backgroundColor: C.white,
        direction: "rtl",
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 40px",
        fontFamily: FONT,
        scale: 0.6 + pop * 0.4,
        opacity: Math.min(1, pop * 1.3),
        rotate: `${(tilt + wobble) * (1 - tidy)}deg`,
        translate: `${shift * (1 - tidy)}px 0px`,
      }}
    >
      <Disc icon={icon} size={124} bg="#D1DEED" />
      <div style={{ fontSize: 66, fontWeight: 900, color: C.seaDark, whiteSpace: "nowrap" }}>{label}</div>
    </Interactive.Div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const speedAt = at(3, 3);
  const fast = interpolate(frame, [speedAt, speedAt + 10], [0, 1], { ...clamp, easing: EASE });
  const angle = frame * 4 + fast * Math.max(0, frame - speedAt) * 26;
  const logo = usePop(speedAt, 12);
  const pill = usePop(speedAt + 6, 12);
  const clock = usePop(at(3, 1), 14);
  const chev = (frame * 0.16) % 1;

  return (
    <AbsoluteFill name="Problem" style={{ backgroundColor: C.sea }}>
      <Ring speed={0.7} opacity={0.12} top={160} />
      <Floaters />

      <div style={{ position: "absolute", left: 100, right: 100, top: 290 }}>
        <MaskLine name="Title" delay={at(3, 0)} size={74} weight={800}>
          من المشاكل اللي نحلها
        </MaskLine>
      </div>

      <Card top={470} delay={at(3, 1)} tidyAt={speedAt} icon="meeting-point" label="التخطيط" tilt={-5} shift={46} />
      <Card top={700} delay={at(3, 2)} tidyAt={speedAt} icon="camping" label="تصميم الرحلات" tilt={4} shift={-52} />

      <Interactive.Div
        name="Clock"
        style={{
          position: "absolute",
          left: 540 - 105,
          top: 960,
          width: 210,
          height: 210,
          scale: 0.4 + clock * 0.6,
          opacity: Math.min(1, clock),
        }}
      >
        <svg width={210} height={210} viewBox="0 0 240 240">
          <circle cx={120} cy={120} r={108} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={14} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={120}
              y1={22}
              x2={120}
              y2={i % 3 === 0 ? 40 : 32}
              stroke="#fff"
              strokeWidth={i % 3 === 0 ? 7 : 4}
              strokeLinecap="round"
              transform={`rotate(${i * 30} 120 120)`}
            />
          ))}
          <line x1={120} y1={120} x2={120} y2={44} stroke={C.desert} strokeWidth={10} strokeLinecap="round" transform={`rotate(${angle} 120 120)`} />
          <circle cx={120} cy={120} r={11} fill="#fff" />
        </svg>
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1005,
          display: "flex",
          justifyContent: "center",
          gap: 170,
          opacity: fast,
        }}
      >
        {[0, 1].map((side) => (
          <svg key={side} width={130} height={90} viewBox="0 0 150 100" style={{ scale: side === 0 ? "1 1" : "-1 1" }}>
            {[0, 1, 2].map((k) => {
              const o = Math.max(0.2, 1 - Math.abs(((chev * 3) % 3) - k) * 0.5);
              return (
                <path
                  key={k}
                  d={`M${10 + k * 42} 15 L${48 + k * 42} 50 L${10 + k * 42} 85`}
                  fill="none"
                  stroke={C.desert}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={o}
                />
              );
            })}
          </svg>
        ))}
      </div>

      <Interactive.Div
        name="Speed pill"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1250,
          display: "flex",
          justifyContent: "center",
          scale: 0.6 + pill * 0.4,
          opacity: Math.min(1, pill),
        }}
      >
        <Pill bg={C.desert} color={C.white} size={58}>
          تسرّعها لك
        </Pill>
      </Interactive.Div>
      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          display: "flex",
          justifyContent: "center",
          scale: 0.6 + logo * 0.4,
          opacity: Math.min(1, logo),
        }}
      >
        <Img src={staticFile("logos/white-horizontal.svg")} style={{ width: 400 }} />
      </Interactive.Div>
    </AbsoluteFill>
  );
};
