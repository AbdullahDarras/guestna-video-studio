import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Burst, Disc, Dolly, MaskLine, Pic, usePop } from "../../kit";
import { at, dur } from "./timing";

const CARDS = [
  { icon: "learning", label: "داخل المدرسة" },
  { icon: "planetarium", label: "مراكز ترفيه وتعليم" },
  { icon: "walking", label: "زيارات" },
  { icon: "car", label: "داخل المدينة" },
  { icon: "camping", label: "خارج المدينة" },
];

const Card: React.FC<{ readonly i: number; readonly delay: number }> = ({ i, delay }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay, 12);
  const k = Math.min(1, p);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 520 + i * 200, height: 170, perspective: 1400 }}>
      <Interactive.Div
        name={`Card ${i + 1}`}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 48,
          backgroundColor: C.white,
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "0 30px",
          fontFamily: FONT,
          opacity: Math.min(1, p * 1.5),
          translate: `0px ${(1 - k) * 150 + Math.sin(frame / 20 + i) * 3}px`,
          rotate: `x ${(1 - k) * 38}deg`,
          scale: 0.9 + p * 0.1,
          transformOrigin: "50% 100%",
          boxShadow: "0 18px 40px rgba(18,66,124,0.35)",
        }}
      >
        <Disc icon={CARDS[i].icon} size={120} bg="#D1DEED" />
        <div style={{ flex: 1, fontSize: 64, fontWeight: 700, color: C.seaDark, whiteSpace: "nowrap" }}>{CARDS[i].label}</div>
        <div style={{ fontSize: 46, fontWeight: 300, color: C.sea, direction: "ltr" }}>{`0${i + 1}`}</div>
      </Interactive.Div>
    </div>
  );
};

export const ProgramsScene: React.FC = () => (
  <AbsoluteFill name="Programs" style={{ backgroundColor: C.seaDark }}>
    <Dolly total={dur(2)}>
      <Pic src="media/edu/ai/riyadh.jpg" total={dur(2)} from={1.02} to={1.16} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(18,66,124,0.86) 0%, rgba(25,89,166,0.78) 100%)" }} />

      <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
        <MaskLine name="Title" delay={at(2, 0)} size={170} weight={900}>
          أنشطة
        </MaskLine>
      </div>
      {CARDS.map((_, i) => (
        <Card key={i} i={i} delay={at(2, i, i === 0 ? 4 : 0)} />
      ))}
      <Burst at={at(2, 4, 4)} x={540} y={1400} />
    </Dolly>
  </AbsoluteFill>
);
