import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C } from "./brand";
import { clamp } from "./kit";
import { useFrame } from "./clock";

export type TransitionKind = "zoom" | "rise" | "iris" | "whip" | "bloom";

/**
 * Soft scene transitions that overlap two scenes (instead of a hard wipe).
 * The incoming scene's Shell runs `enter` over its first `overlap` frames, the outgoing scene's Shell runs `exit`
 * over its last `overlap` frames. Put the incoming scene later in the DOM so it sits on top.
 *   zoom   push-through: the old scene swells, the new one settles in from slightly smaller with a soft blur
 *   rise   the new scene glides up over the old one, which dims and eases back
 *   iris   the new scene opens as a circle from `origin`, with a brand ring on the edge
 *   whip   the new scene whips in from the side with motion blur
 *   bloom  like iris, from the centre, for the white outro
 */
export const Shell: React.FC<{
  readonly total: number;
  readonly children: React.ReactNode;
  readonly enter?: TransitionKind;
  readonly exit?: TransitionKind;
  readonly overlap?: number;
  readonly origin?: { readonly x: number; readonly y: number };
}> = ({ total, children, enter, exit, overlap = 20, origin = { x: 540, y: 960 } }) => {
  const frame = useFrame();
  const pin = enter ? interpolate(frame, [0, overlap], [0, 1], { ...clamp, easing: Easing.bezier(0.6, 0, 0.25, 1) }) : 1;
  const pout = exit ? interpolate(frame, [total - overlap, total], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;

  let scale = 1;
  let tx = 0;
  let ty = 0;
  let blur = 0;
  let opacity = 1;
  let brightness = 1;
  let clip: string | undefined;
  let ringR = 0;

  if (enter === "zoom") {
    scale *= 0.88 + 0.12 * pin;
    blur += (1 - pin) * 14;
    opacity = Math.min(1, pin * 1.7);
  } else if (enter === "rise") {
    ty += (1 - pin) * 1920;
  } else if (enter === "whip") {
    tx += (1 - pin) * -1080;
    blur += (1 - pin) * 16;
  } else if (enter === "iris" || enter === "bloom") {
    ringR = pin * 1750;
    clip = `circle(${ringR}px at ${origin.x}px ${origin.y}px)`;
  }

  if (exit === "zoom") {
    scale *= 1 + 0.12 * pout;
    blur += pout * 8;
  } else if (exit === "rise") {
    ty += -pout * 170;
    scale *= 1 - 0.05 * pout;
    brightness = 1 - 0.3 * pout;
  } else if (exit === "whip") {
    tx += pout * 260;
    blur += pout * 10;
  } else if (exit === "iris" || exit === "bloom") {
    scale *= 1 + 0.05 * pout;
    brightness = 1 - 0.2 * pout;
  }

  const filter = `${blur > 0.3 ? `blur(${blur}px) ` : ""}${brightness < 0.999 ? `brightness(${brightness})` : ""}`.trim();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: clip,
          opacity,
          filter: filter || undefined,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          boxShadow: enter === "rise" && pin < 1 ? "0 -50px 90px rgba(18,66,124,0.45)" : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {(enter === "iris" || enter === "bloom") && pin < 0.995 ? (
        <div
          style={{
            position: "absolute",
            left: origin.x - ringR,
            top: origin.y - ringR,
            width: ringR * 2,
            height: ringR * 2,
            borderRadius: ringR,
            border: `${enter === "bloom" ? 22 : 16}px solid ${C.desert}`,
            opacity: 1 - pin * pin,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
