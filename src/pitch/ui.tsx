import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { C, EASE, FONT } from "../brand";
import { useFrame } from "../clock";
import { clamp, Disc, Floaters, Glow, Ring, usePop } from "../kit";

/** A paper sheet that drops in with a wobble. Used for the "chaos" of manual trip management. */
export const Paper: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly delay: number;
  readonly w?: number;
  readonly h?: number;
  readonly from?: { readonly x: number; readonly y: number };
  readonly calm?: number;
}> = ({ x, y, rot, delay, w = 300, h = 380, from, calm = 0 }) => {
  const f = useFrame();
  const p = usePop(delay, 10);
  const k = Math.min(1, p);
  const shake = (1 - calm) * 1;
  const ox = from ? (1 - k) * (from.x - x) : 0;
  const oy = from ? (1 - k) * (from.y - y) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2 + ox + Math.sin(f / 6 + x) * 5 * shake,
        top: y - h / 2 + oy + Math.cos(f / 7 + y) * 5 * shake,
        width: w,
        height: h,
        borderRadius: 20,
        backgroundColor: C.white,
        padding: 30,
        rotate: `${rot * (1 - calm * 0.9) + Math.sin(f / 9 + y) * 3 * shake}deg`,
        scale: Math.max(0, p) * (1 - calm * 0.1),
        opacity: Math.min(1, p * 1.6),
        boxShadow: "0 22px 44px rgba(10,40,90,0.35)",
      }}
    >
      {[0.7, 0.92, 0.55, 0.85, 0.6, 0.78].map((wd, i) => (
        <div key={i} style={{ height: 14, borderRadius: 7, width: `${wd * 100}%`, backgroundColor: i === 0 ? C.sea : "#D1DEED", marginBottom: i === 0 ? 30 : 22 }} />
      ))}
    </div>
  );
};

/** Phone frame. Children are laid out inside a 512x1062 screen. */
export const Phone: React.FC<{ readonly children?: React.ReactNode; readonly style?: React.CSSProperties; readonly screen?: string }> = ({ children, style, screen = "#F4F8FD" }) => (
  <div style={{ position: "absolute", width: 540, height: 1090, borderRadius: 96, backgroundColor: "#0B2A52", padding: 14, boxShadow: "0 50px 90px rgba(5,25,60,0.55), inset 0 0 0 3px rgba(255,255,255,0.12)", ...style }}>
    <div style={{ position: "relative", width: 512, height: 1062, borderRadius: 82, backgroundColor: screen, overflow: "hidden", fontFamily: FONT, direction: "rtl" }}>
      {children}
      <div style={{ position: "absolute", top: 16, left: 181, width: 150, height: 38, borderRadius: 19, backgroundColor: "#0B2A52" }} />
    </div>
  </div>
);

/** Animated check mark in a coloured circle. */
export const Check: React.FC<{ readonly size?: number; readonly delay: number; readonly color?: string }> = ({ size = 84, delay, color = C.desert }) => {
  const f = useFrame();
  const pop = usePop(delay, 11);
  const draw = interpolate(f, [delay + 3, delay + 14], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "center", scale: Math.max(0, pop), flexShrink: 0 }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 64 64">
        <path d="M12 34 L27 48 L52 16" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - draw)} />
      </svg>
    </div>
  );
};

/** Press button: dips when pressed at `pressAt` and sends a ripple. */
export const PressButton: React.FC<{
  readonly label: string;
  readonly delay: number;
  readonly pressAt: number;
  readonly width?: number;
  readonly height?: number;
  readonly size?: number;
  readonly bg?: string;
  readonly color?: string;
}> = ({ label, delay, pressAt, width = 560, height = 170, size = 70, bg = C.desert, color = C.white }) => {
  const f = useFrame();
  const pop = usePop(delay, 11);
  const dip = interpolate(f, [pressAt - 4, pressAt, pressAt + 6, pressAt + 12], [1, 0.93, 1.03, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const rip = interpolate(f, [pressAt, pressAt + 26], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ position: "relative", width, height, scale: Math.max(0, pop) * dip, opacity: Math.min(1, pop * 1.4) }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: height / 2,
          backgroundColor: bg,
          boxShadow: `0 ${f >= pressAt && f < pressAt + 8 ? 6 : 22}px 44px rgba(238,139,34,0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          color,
          direction: "rtl",
        }}
      >
        {label}
      </div>
      {f >= pressAt ? (
        <div style={{ position: "absolute", left: width / 2 - 60, top: height / 2 - 60, width: 120, height: 120, borderRadius: 60, border: `8px solid ${bg}`, scale: 1 + rip * 7, opacity: (1 - rip) * 0.8 }} />
      ) : null}
    </div>
  );
};

export type Word = { readonly t: string; readonly w?: number; readonly c?: string };

/** Words that rise one after another (word-level stagger: safe for Arabic joining). */
export const BigWords: React.FC<{
  readonly words: readonly Word[];
  readonly delay: number;
  readonly size: number;
  readonly gap?: number;
  readonly stagger?: number;
  readonly color?: string;
  readonly weight?: number;
  readonly width?: number;
  readonly dur?: number;
}> = ({ words, delay, size, gap = 0.28, stagger = 4, color = C.white, weight = 900, width = 900, dur = 9 }) => {
  const f = useFrame();
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: "center", direction: "rtl", columnGap: size * gap, fontFamily: FONT, lineHeight: 1.18 }}>
      {words.map((word, i) => {
        const p = interpolate(f, [delay + i * stagger, delay + i * stagger + dur], [0, 1], { ...clamp, easing: EASE });
        const wWeight = word.w ?? weight;
        const fs = Math.min(size, Math.floor(fitText({ text: word.t, withinWidth: width, fontFamily: FONT, fontWeight: wWeight }).fontSize));
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: fs * 0.28, marginBottom: -fs * 0.16, paddingTop: fs * 0.1, marginTop: -fs * 0.06, clipPath: "inset(0px -300px 0px -300px)" }}>
            <div style={{ fontSize: fs, fontWeight: wWeight, color: word.c ?? color, translate: `0px ${(1 - p) * 120}%`, opacity: p > 0 ? 1 : 0, whiteSpace: "nowrap" }}>{word.t}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Number counting up (design frames). */
export const CountUp: React.FC<{ readonly from: number; readonly to: number; readonly start: number; readonly dur: number; readonly size: number; readonly color?: string; readonly weight?: number; readonly suffix?: string }> = ({ from, to, start, dur, size, color = C.white, weight = 900, suffix }) => {
  const f = useFrame();
  const v = Math.round(interpolate(f, [start, start + dur], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <div style={{ direction: "ltr", fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
      {v}
      {suffix}
    </div>
  );
};

/** Frosted glass card. */
export const Glass: React.FC<{ readonly children?: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 48, backgroundColor: "rgba(255,255,255,0.14)", border: "2px solid rgba(255,255,255,0.28)", boxShadow: "0 24px 60px rgba(5,25,60,0.35)", backdropFilter: "blur(14px)", ...style }}>{children}</div>
);

/** A trip row for the app screens: icon, title, tag. */
export const TripRow: React.FC<{ readonly icon: string; readonly title: string; readonly tag: string; readonly delay: number; readonly selected?: boolean; readonly selectAt?: number }> = ({ icon, title, tag, delay, selected, selectAt = 0 }) => {
  const f = useFrame();
  const pop = usePop(delay, 12);
  const sel = selected ? interpolate(f, [selectAt, selectAt + 8], [0, 1], clamp) : 0;
  return (
    <div
      style={{
        height: 150,
        borderRadius: 38,
        backgroundColor: sel > 0.5 ? "#FFF1E1" : C.white,
        border: `4px solid ${sel > 0.5 ? C.desert : "#E4ECF6"}`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 22px",
        direction: "rtl",
        fontFamily: FONT,
        opacity: Math.min(1, pop * 1.5),
        translate: `${(1 - Math.min(1, pop)) * 80}px 0px`,
        scale: 1 + sel * 0.03,
        boxShadow: sel > 0.5 ? "0 14px 30px rgba(238,139,34,0.25)" : "0 8px 20px rgba(18,66,124,0.08)",
      }}
    >
      <Disc icon={icon} size={96} bg="#D1DEED" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.seaDark, whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 400, color: C.sea, marginTop: 4 }}>{tag}</div>
      </div>
    </div>
  );
};

export const LogoWhite: React.FC<{ readonly width?: number }> = ({ width = 360 }) => <Img src={staticFile("logos/white-horizontal.svg")} style={{ width }} />;
export const LogoColor: React.FC<{ readonly width?: number }> = ({ width = 560 }) => <Img src={staticFile("logos/original-horizontal.svg")} style={{ width }} />;

/** Branded background: gradient, soft glows, rotating ring and drifting diamonds. */
export const Backdrop: React.FC<{ readonly variant?: "sea" | "deep"; readonly ring?: boolean; readonly floaters?: boolean; readonly warm?: number }> = ({ variant = "sea", ring = true, floaters = true, warm = 0.18 }) => (
  <>
    <AbsoluteFill style={{ background: variant === "sea" ? `linear-gradient(180deg, ${C.sea} 0%, #174F94 100%)` : `linear-gradient(180deg, ${C.seaDark} 0%, #0B2D57 100%)` }} />
    <Glow warm={warm} />
    {ring ? <Ring speed={0.5} opacity={0.12} top={150} /> : null}
    {floaters ? <Floaters /> : null}
  </>
);

/** Slowly rotating conic rays (sunrise feel) centred at (cx, cy). */
export const Rays: React.FC<{ readonly cx: number; readonly cy: number; readonly size?: number; readonly opacity?: number; readonly color?: string }> = ({ cx, cy, size = 1800, opacity = 0.5, color = "238,139,34" }) => {
  const f = useFrame();
  const stops = Array.from({ length: 12 }, (_, i) => `rgba(${color},${i % 2 === 0 ? 0.26 : 0}) ${(i * 100) / 12}%`).join(", ");
  return (
    <div style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2, width: size, height: size, borderRadius: size / 2, background: `conic-gradient(${stops}, rgba(${color},0.32) 100%)`, rotate: `${f * 0.35}deg`, opacity, maskImage: "radial-gradient(circle, transparent 14%, black 34%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, transparent 14%, black 34%, transparent 70%)" }} />
  );
};

/** Circular progress ring that draws itself. */
export const RingProgress: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly start: number; readonly dur: number; readonly color?: string; readonly thickness?: number }> = ({ cx, cy, r, start, dur, color = C.desert, thickness = 26 }) => {
  const f = useFrame();
  const p = interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={thickness} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-90 ${cx} ${cy})`} />
    </svg>
  );
};
