import { Video } from "@remotion/media";
import React from "react";
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
  readonly style?: React.CSSProperties;
};

/** Headline line that slides up from behind a mask. */
export const MaskLine: React.FC<MaskProps> = ({
  children,
  delay,
  size,
  color = C.white,
  weight = 900,
  name,
  dur = 11,
  style,
}) => {
  const p = useIn(delay, dur);
  return (
    <Interactive.Div
      name={name}
      style={{
        overflow: "hidden",
        paddingBottom: size * 0.14,
        paddingTop: size * 0.04,
        direction: "rtl",
        textAlign: "center",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.12,
        color,
        ...style,
      }}
    >
      <div style={{ translate: `0px ${(1 - p) * 115}%`, opacity: p > 0 ? 1 : 0, whiteSpace: "nowrap" }}>{children}</div>
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
  readonly style?: React.CSSProperties;
}> = ({ children, bg = C.white, color = C.seaDark, size = 52, style }) => (
  <div
    style={{
      direction: "rtl",
      fontFamily: FONT,
      fontWeight: 800,
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
