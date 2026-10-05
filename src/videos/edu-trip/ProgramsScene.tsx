import React from "react";
import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import { C, FONT } from "../../brand";
import { Burst, Disc, Glow, MaskLine, Pic, usePop } from "../../kit";
import { at, sceneDur } from "./tt";

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
    <div style={{ position: "absolute", left: 130, right: 130, top: 500 + i * 198, height: 164, perspective: 1400 }}>
      <Interactive.Div
        name={`Card ${i + 1}`}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 52,
          backgroundColor: "rgba(255,255,255,0.96)",
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 28px",
          fontFamily: FONT,
          opacity: Math.min(1, p * 1.5),
          translate: `0px ${(1 - k) * 140 + Math.sin(frame / 20 + i) * 3}px`,
          rotate: `x ${(1 - k) * 38}deg`,
          scale: 0.9 + p * 0.1,
          transformOrigin: "50% 100%",
          boxShadow: "0 22px 50px rgba(10,40,90,0.4)",
        }}
      >
        <Disc icon={CARDS[i].icon} size={108} bg="#D1DEED" />
        <div style={{ flex: 1, fontSize: 54, fontWeight: i % 2 === 0 ? 700 : 500, color: C.seaDark, whiteSpace: "nowrap" }}>{CARDS[i].label}</div>
        <div style={{ fontSize: 38, fontWeight: 300, color: C.sea, direction: "ltr" }}>{`0${i + 1}`}</div>
      </Interactive.Div>
    </div>
  );
};

export const ProgramsScene: React.FC = () => (
  <AbsoluteFill name="Programs" style={{ backgroundColor: C.seaDark }}>
    <Pic src="media/edu/ai/riyadh.jpg" total={sceneDur(2)} from={1.02} to={1.16} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(18,66,124,0.9) 0%, rgba(25,89,166,0.8) 100%)" }} />
    <Glow warm={0.16} cool={0.2} />

    <div style={{ position: "absolute", left: 90, right: 90, top: 270 }}>
      <MaskLine name="Title" delay={at(2, 0, -8)} dur={9} size={128} weight={900}>
        أنشطة
      </MaskLine>
    </div>
    {CARDS.map((_, i) => (
      <Card key={i} i={i} delay={at(2, i, i === 0 ? 3 : 0)} />
    ))}
    <Burst at={at(2, 4, 4)} x={540} y={1470} />
  </AbsoluteFill>
);
