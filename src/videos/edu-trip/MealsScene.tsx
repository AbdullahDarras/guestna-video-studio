import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../brand";
import { Burst, clamp, Disc, Glow, MaskLine, usePop } from "../../kit";
import { at } from "./tt";

const ORBIT = ["healthy-food", "breakfast", "snacks", "juice", "local-cuisine", "meal-service"];
const CX = 540;
const CY = 990;
const R = 310;

const Pulse: React.FC<{ readonly start: number; readonly offset: number }> = ({ start, offset }) => {
  const frame = useCurrentFrame();
  const t = ((frame - start + offset) % 64) / 64;
  const on = frame >= start;
  return (
    <div
      style={{
        position: "absolute",
        left: CX - 160,
        top: CY - 160,
        width: 320,
        height: 320,
        borderRadius: 160,
        border: "6px solid rgba(255,255,255,0.7)",
        scale: 1 + t * 1.35,
        opacity: on ? (1 - t) * 0.7 : 0,
      }}
    />
  );
};

const Orbiter: React.FC<{ readonly i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const p = usePop(at(4, 1, i * 3), 12);
  const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.012;
  const r = R * Math.min(1, p);
  return (
    <div style={{ position: "absolute", left: CX + Math.cos(a) * r - 70, top: CY + Math.sin(a) * r - 70, scale: 0.3 + p * 0.7, opacity: Math.min(1, p * 1.4) }}>
      <Disc icon={ORBIT[i]} size={140} />
    </div>
  );
};

export const MealsScene: React.FC = () => {
  const pop = usePop(at(4, 0, 2), 11);
  const check = usePop(at(4, 0, 16), 10);
  const cap = interpolate(useCurrentFrame(), [at(4, 1), at(4, 1, 12)], [0, 1], clamp);
  return (
    <AbsoluteFill name="Meals" style={{ backgroundColor: C.seaDark }}>
        <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 52%, rgba(25,89,166,0.9) 0%, rgba(18,66,124,0) 64%)" }} />
        <Glow warm={0.14} cool={0.2} />

        <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
          <MaskLine name="Title" delay={at(4, 0, -8)} dur={9} size={108} weight={900}>
            وجبات مضمونة
          </MaskLine>
        </div>

        {[0, 22, 44].map((o) => (
          <Pulse key={o} start={at(4, 0, 4)} offset={o} />
        ))}
        <Interactive.Div name="Center plate" style={{ position: "absolute", left: CX - 125, top: CY - 125, scale: 0.4 + pop * 0.6, opacity: Math.min(1, pop * 1.4) }}>
          <Disc icon="meals" size={250} />
        </Interactive.Div>
        {ORBIT.map((_, i) => (
          <Orbiter key={i} i={i} />
        ))}

        <div style={{ position: "absolute", left: CX + 60, top: CY - 165, width: 96, height: 96, borderRadius: 48, backgroundColor: C.desert, display: "flex", alignItems: "center", justifyContent: "center", scale: check, boxShadow: "0 0 0 10px rgba(255,255,255,0.9)" }}>
          <svg width={54} height={54} viewBox="0 0 64 64">
            <path d="M12 34 L27 48 L52 16" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <Burst at={at(4, 0, 16)} x={CX + 108} y={CY - 117} />

        <div style={{ position: "absolute", left: 90, right: 90, top: 1500, opacity: cap }}>
          <MaskLine name="Options" delay={at(4, 1)} dur={9} size={66} weight={300}>
            بخيارات غذائية متنوعة
          </MaskLine>
        </div>
    </AbsoluteFill>
  );
};
