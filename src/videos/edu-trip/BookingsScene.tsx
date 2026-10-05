import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, FONT } from "../../brand";
import { clamp, Floaters, Glow, MaskLine, Ring, Sweep, usePop } from "../../kit";
import { at } from "./tt";

const Row: React.FC<{ readonly i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const pop = usePop(at(5, 0, 8 + i * 6), 12);
  const tickAt = at(5, 0, 18 + i * 8);
  const tick = interpolate(frame, [tickAt, tickAt + 9], [0, 1], { ...clamp, easing: EASE });
  const widths = [0.62, 0.5, 0.7, 0.44];
  return (
    <div style={{ height: 112, display: "flex", alignItems: "center", gap: 28, direction: "rtl", opacity: Math.min(1, pop * 1.4), translate: `${(1 - Math.min(1, pop)) * 90}px 0px` }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, border: `6px solid ${tick > 0.2 ? C.desert : "#D1DEED"}`, backgroundColor: tick > 0.2 ? C.desert : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width={44} height={44} viewBox="0 0 64 64">
          <path d="M12 34 L27 48 L52 16" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - tick)} />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ height: 26, borderRadius: 13, backgroundColor: "#D1DEED", width: `${widths[i] * 100}%` }} />
        <div style={{ height: 18, borderRadius: 9, backgroundColor: "#E8EEF6", width: `${widths[i] * 62}%`, marginTop: 14 }} />
      </div>
    </div>
  );
};

export const BookingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = usePop(at(5, 0, 2), 13);
  const live = usePop(at(5, 1, 7), 11);
  const fill = interpolate(frame, [at(5, 1, 11), at(5, 1, 37)], [0, 1], { ...clamp, easing: EASE });
  const pulse = ((frame - at(5, 1, 7)) % 36) / 36;

  return (
    <AbsoluteFill name="Bookings" style={{ backgroundColor: C.sea }}>
        <Glow />
        <Ring speed={0.7} opacity={0.12} top={160} />
        <Floaters />

        <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
          <MaskLine name="Line 1" delay={at(5, 0, -8)} dur={9} size={118} weight={900}>
            إدارة كاملة
          </MaskLine>
          <MaskLine name="Line 2" delay={at(5, 0, -3)} dur={9} size={88} weight={300} color={C.desert}>
            للحجوزات
          </MaskLine>
        </div>

        <Interactive.Div
          name="Dashboard card"
          style={{ position: "absolute", left: 140, right: 140, top: 630, height: 720, borderRadius: 60, backgroundColor: C.white, padding: "40px 44px", scale: 0.86 + card * 0.14, opacity: Math.min(1, card * 1.3), boxShadow: "0 30px 60px rgba(18,66,124,0.4)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl", height: 90 }}>
            <div style={{ height: 34, width: 280, borderRadius: 17, backgroundColor: C.seaDark }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16, scale: 0.7 + live * 0.3, opacity: Math.min(1, live * 1.5) }}>
              <div style={{ position: "relative", width: 26, height: 26 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 13, backgroundColor: C.desert }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 13, border: `4px solid ${C.desert}`, scale: 1 + pulse * 1.8, opacity: live > 0.05 ? 1 - pulse : 0 }} />
              </div>
              <div style={{ fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.seaDark, direction: "rtl" }}>أونلاين</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            {[0, 1, 2, 3].map((i) => (
              <Row key={i} i={i} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 44, right: 44, bottom: 40, height: 26, borderRadius: 13, backgroundColor: "#D1DEED", overflow: "hidden", direction: "rtl" }}>
            <div style={{ height: "100%", width: `${fill * 100}%`, borderRadius: 13, backgroundColor: C.desert }} />
          </div>
          <Sweep at={at(5, 1, 33)} radius={60} />
        </Interactive.Div>

        <div style={{ position: "absolute", left: 90, right: 90, top: 1440 }}>
          <MaskLine name="Follow" delay={at(5, 1, 7)} dur={9} size={72} weight={500}>
            والمتابعة أونلاين
          </MaskLine>
        </div>
    </AbsoluteFill>
  );
};
