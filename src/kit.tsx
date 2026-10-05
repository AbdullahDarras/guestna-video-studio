import { fitText } from "@remotion/layout-utils";
import { Video } from "@remotion/media";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE, FONT } from "./brand";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0 to 1 progress starting at `start` frame (local). */
export const useIn = (start: number, dur = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });
};

/** Overshooting pop, 0 to about 1. */
export const usePop = (start: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness: 260, mass: 0.6 } });
};

type MaskProps = {
  readonly children: React.ReactNode;
  readonly delay: number;
  readonly size: number;
  readonly color?: string;
  readonly weight?: number;
  readonly name?: string;
  readonly dur?: number;
  /** Max text width in px. The font shrinks to fit, so text is never cut at the edges. Default 900 (90px margins). */
  readonly fit?: number;
  readonly style?: React.CSSProperties;
};

/** Headline line that slides up from behind a mask. Auto-fits its width; the mask only clips vertically. */
export const MaskLine: React.FC<MaskProps> = ({
  children,
  delay,
  size,
  color = C.white,
  weight = 900,
  name,
  dur = 11,
  fit = 900,
  style,
}) => {
  const p = useIn(delay, dur);
  const text = typeof children === "string" ? children : null;
  const fontSize = useMemo(
    () => (text ? Math.min(size, Math.floor(fitText({ text, withinWidth: fit, fontFamily: FONT, fontWeight: weight }).fontSize)) : size),
    [text, size, fit, weight],
  );
  return (
    <Interactive.Div
      name={name}
      style={{
        clipPath: "inset(0px -1200px 0px -1200px)",
        paddingBottom: fontSize * 0.3,
        marginBottom: -fontSize * 0.16,
        paddingTop: fontSize * 0.12,
        marginTop: -fontSize * 0.08,
        direction: "rtl",
        textAlign: "center",
        fontFamily: FONT,
        fontSize,
        fontWeight: weight,
        lineHeight: 1.12,
        color,
        ...style,
      }}
    >
      <div style={{ translate: `0px ${(1 - p) * 125}%`, opacity: p > 0 ? 1 : 0, whiteSpace: "nowrap" }}>{children}</div>
    </Interactive.Div>
  );
};

/** Big rotating brand ring behind everything. */
export const Ring: React.FC<{
  readonly speed?: number;
  readonly opacity?: number;
  readonly top?: number;
  readonly size?: number;
}> = ({ speed = 0.3, opacity = 0.14, top = 160, size = 1700 }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Ring watermark"
      style={{
        position: "absolute",
        left: (1080 - size) / 2,
        top,
        width: size,
        height: size,
        opacity,
        rotate: `${frame * speed}deg`,
      }}
    >
      <Img src={staticFile("patterns/primary-ring-white.svg")} style={{ width: "100%", height: "100%" }} />
    </Interactive.Div>
  );
};

/** Full-bleed stock clip with slow push-in. */
export const Clip: React.FC<{
  readonly src: string;
  readonly total: number;
  readonly zoomFrom?: number;
  readonly zoomTo?: number;
  readonly trimBefore?: number;
  readonly style?: React.CSSProperties;
}> = ({ src, total, zoomFrom = 1.05, zoomTo = 1.2, trimBefore, style }) => {
  const frame = useCurrentFrame();
  return (
    <Video
      src={staticFile(src)}
      muted
      loop
      trimBefore={trimBefore}
      objectFit="cover"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        scale: interpolate(frame, [0, total], [zoomFrom, zoomTo], clamp),
        ...style,
      }}
    />
  );
};

/** Brand diamond wipe: cover on the way in, uncover on the way out. Cut happens at local frame 8 of 16. */
export const DiamondWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const inout = (s: number) =>
    interpolate(frame, [s, s + 5, s + 8, s + 13], [0, 1, 1, 0], {
      ...clamp,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
  const layer = (color: string, s: number, shift: number) => (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 2500,
        height: 2500,
        marginLeft: -1250,
        marginTop: -1250,
        borderRadius: 220,
        backgroundColor: color,
        rotate: "45deg",
        scale: inout(s) * (1 + shift),
      }}
    />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {layer(C.white, 0, 0.06)}
      {layer(C.desert, 2, 0)}
    </AbsoluteFill>
  );
};

/** Brand diamonds drifting upward for constant gentle motion behind content. */
export const Floaters: React.FC<{ readonly tone?: "light" | "dark" }> = ({ tone = "light" }) => {
  const frame = useCurrentFrame();
  const items = [
    { x: 90, s: 70, sp: 1.4, o: 0 },
    { x: 330, s: 46, sp: 2.1, o: 260 },
    { x: 560, s: 90, sp: 1.1, o: 520 },
    { x: 790, s: 54, sp: 1.9, o: 120 },
    { x: 960, s: 76, sp: 1.5, o: 700 },
    { x: 200, s: 38, sp: 2.4, o: 900 },
    { x: 700, s: 42, sp: 2.2, o: 380 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((it, i) => {
        const y = 2100 - ((frame * it.sp * 3 + it.o) % 2300);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: it.x,
              top: y,
              width: it.s,
              height: it.s,
              borderRadius: it.s * 0.28,
              rotate: `${45 + frame * (i % 2 === 0 ? 1.5 : -1.5)}deg`,
              backgroundColor: tone === "light" ? "rgba(255,255,255,0.16)" : "rgba(25,89,166,0.18)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Still image with a push-in. */
export const Pic: React.FC<{
  readonly src: string;
  readonly total: number;
  readonly from?: number;
  readonly to?: number;
  readonly position?: string;
}> = ({ src, total, from = 1.0, to = 1.18, position = "50% 50%" }) => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: position,
        scale: interpolate(frame, [0, total], [from, to], clamp),
      }}
    />
  );
};

/** Little burst of brand diamonds. */
export const Burst: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly colors?: string[];
}> = ({ at, x, y, colors: palette }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 26], [0, 1], { ...clamp, easing: EASE });
  const colors = palette ?? [C.desert, C.white, "#A3BCDB", C.desert, C.white, "#F8D0A7"];
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + (i % 2) * 0.2;
        const r = 120 + (i % 3) * 90;
        const s = 26 + (i % 4) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * r * t - s / 2,
              top: y + Math.sin(a) * r * t - s / 2,
              width: s,
              height: s,
              borderRadius: s * 0.28,
              backgroundColor: colors[i % colors.length],
              rotate: `${45 + t * 160}deg`,
              opacity: t === 0 ? 0 : 1 - t * t,
            }}
          />
        );
      })}
    </>
  );
};

/** Official icon on a white disc. */
export const Disc: React.FC<{
  readonly icon: string;
  readonly size?: number;
  readonly bg?: string;
}> = ({ icon, size = 140, bg = C.white }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Img src={staticFile(`icons/${icon}.svg`)} style={{ width: size * 0.62, height: size * 0.62 }} />
  </div>
);

/** Brand chip / pill. */
export const Pill: React.FC<{
  readonly children: React.ReactNode;
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
  readonly weight?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, bg = C.white, color = C.seaDark, size = 52, weight = 800, style }) => (
  <div
    style={{
      direction: "rtl",
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      color,
      backgroundColor: bg,
      padding: `${size * 0.32}px ${size * 0.8}px`,
      borderRadius: size * 2,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Cinematic push for a whole scene: it settles in from a slight zoom with a soft blur (the incoming scene under the
 * wipe) and pushes through right before the cut (the outgoing scene). Wrap the scene content in it.
 */
export const Dolly: React.FC<{
  readonly total: number;
  readonly children: React.ReactNode;
  readonly inFrames?: number;
  readonly outFrames?: number;
}> = ({ total, children, inFrames = 14, outFrames = 8 }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, inFrames], [0, 1], { ...clamp, easing: EASE });
  const outP = interpolate(frame, [total - outFrames, total], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const blur = (1 - inP) * 10 + outP * 8;
  return <AbsoluteFill style={{ scale: 1.07 - inP * 0.07 + outP * 0.06, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>;
};

/** A bar of light that sweeps once across its parent (the parent needs position: relative). */
export const Sweep: React.FC<{ readonly at: number; readonly dur?: number; readonly radius?: number }> = ({ at, dur = 22, radius = 0 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [at, at + dur], [-45, 125], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: radius, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -30,
          bottom: -30,
          width: "34%",
          left: `${x}%`,
          background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.6), rgba(255,255,255,0))",
          transform: "skewX(-18deg)",
        }}
      />
    </div>
  );
};

/** Hand-drawn style underline that draws itself and ends with a small brand diamond. Replaces plain rules. */
export const Swoosh: React.FC<{
  readonly at: number;
  readonly width?: number;
  readonly color?: string;
  readonly thickness?: number;
  readonly dur?: number;
}> = ({ at, width = 460, color = C.desert, thickness = 12, dur = 16 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE });
  const end = spring({ frame: frame - (at + dur - 2), fps, config: { damping: 9, stiffness: 240, mass: 0.5 } });
  const h = 70;
  return (
    <svg width={width + 30} height={h} viewBox={`0 0 ${width + 30} ${h}`} style={{ overflow: "visible" }}>
      <path
        d={`M8 44 C ${width * 0.2} 10, ${width * 0.52} 66, ${width - 6} 22`}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
      <rect x={width + 4} y={10} width={thickness * 1.7} height={thickness * 1.7} rx={thickness * 0.5} fill={color} transform={`rotate(45 ${width + 4 + thickness * 0.85} ${10 + thickness * 0.85}) scale(${Math.max(0, end)})`} style={{ transformOrigin: `${width + 4 + thickness * 0.85}px ${10 + thickness * 0.85}px` }} />
    </svg>
  );
};

/** Soft drifting colour glows for depth behind the content. */
export const Glow: React.FC<{ readonly warm?: number; readonly cool?: number }> = ({ warm = 0.2, cool = 0.35 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: -260 + Math.sin(frame / 55) * 70, top: 1000 + Math.cos(frame / 70) * 60, width: 1100, height: 1100, borderRadius: 550, background: `radial-gradient(circle, rgba(238,139,34,${warm}) 0%, rgba(238,139,34,0) 62%)` }} />
      <div style={{ position: "absolute", left: 300 + Math.cos(frame / 60) * 80, top: -250 + Math.sin(frame / 65) * 60, width: 1100, height: 1100, borderRadius: 550, background: `radial-gradient(circle, rgba(120,170,230,${cool}) 0%, rgba(120,170,230,0) 62%)` }} />
    </AbsoluteFill>
  );
};
