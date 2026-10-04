import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import {
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

// GuestNa official palette (tokens.json)
export const C = {
  nature: "#037474",
  natureDark: "#005756",
  nature20: "#CCE3E3",
  sea20: "#D1DEED",
  sea: "#1959A6",
  seaDark: "#12427C",
  desert: "#EE8B22",
  ink: "#202626",
  white: "#FFFFFF",
};

export const FONT = "Somar Sans";

// One easing curve for the whole film (ease-out for entrances)
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const WEIGHTS = [
  ["Light", "300"],
  ["Regular", "400"],
  ["Medium", "500"],
  ["SemiBold", "600"],
  ["Bold", "700"],
  ["Black", "900"],
] as const;

export const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("Loading Somar Sans"));

  useEffect(() => {
    Promise.all(
      WEIGHTS.map(([name, weight]) =>
        loadFont({
          family: FONT,
          url: staticFile(`fonts/SomarSans-${name}.otf`),
          weight,
        }),
      ),
    )
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle]);
};

type RevealProps = {
  readonly delay: number;
  readonly duration?: number;
  readonly rise?: number;
  readonly name?: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
};

/** Fade + gentle slide up, 500ms by default. */
export const Reveal: React.FC<RevealProps> = ({
  delay,
  duration = 15,
  rise = 36,
  name,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: p * (style?.opacity === undefined ? 1 : Number(style.opacity)),
        translate: `0px ${(1 - p) * rise}px`,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

/** Opacity window: fades in at `from`, fades out at `to` (pass Infinity to stay). */
export const useWindow = (from: number, to: number, fade = 8) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [from, from + fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = Number.isFinite(to)
    ? interpolate(frame, [to - fade, to], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return Math.min(fadeIn, fadeOut);
};

/** Cross-fade-in so a scene can sit on top of the previous one. */
export const SceneFade: React.FC<{
  readonly frames?: number;
  readonly children: React.ReactNode;
}> = ({ frames = 10, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, frames], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <Interactive.Div
      name="Scene fade"
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {children}
    </Interactive.Div>
  );
};

/** Slow Ken Burns on a real photo. */
export const Photo: React.FC<{
  readonly src: string;
  readonly total: number;
  readonly zoomFrom?: number;
  readonly zoomTo?: number;
  readonly position?: string;
  readonly opacity?: number;
}> = ({ src, total, zoomFrom = 1.04, zoomTo = 1.16, position = "50% 50%", opacity = 1 }) => {
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
        opacity,
        scale: interpolate(frame, [0, total], [zoomFrom, zoomTo], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

/** Official icon inside a white disc (icons are teal + desert on white). */
export const IconDisc: React.FC<{
  readonly icon: string;
  readonly size?: number;
  readonly bg?: string;
}> = ({ icon, size = 150, bg = C.white }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Img
      src={staticFile(`icons/${icon}.svg`)}
      style={{ width: size * 0.62, height: size * 0.62 }}
    />
  </div>
);
