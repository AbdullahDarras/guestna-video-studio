import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../brand";
import { clamp } from "../../kit";
import { START } from "./timing";

const X = 46;
const Y0 = 430;
const GAP = 300;

/** Journey rail on the left edge: one node per station scene (programs, transport, meals, bookings). */
export const Rail: React.FC = () => {
  const frame = useCurrentFrame();
  const scenes = [2, 3, 4, 5];
  const first = START[2];
  const last = START[6];
  const show = interpolate(frame, [first - 4, first + 8, last - 10, last], [0, 1, 1, 0], clamp);
  const ys = scenes.map((_, i) => Y0 + i * GAP);
  const pos = interpolate(frame, [...scenes.map((s) => START[s]), last], [...ys, ys[3] + 70], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: show, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: X - 3, top: ys[0], width: 6, height: ys[3] + 70 - ys[0], borderRadius: 3, backgroundColor: "rgba(255,255,255,0.22)" }} />
      <div style={{ position: "absolute", left: X - 3, top: ys[0], width: 6, height: Math.max(0, pos - ys[0]), borderRadius: 3, backgroundColor: C.desert }} />
      {ys.map((y, i) => {
        const on = frame >= START[scenes[i]];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: X - 15,
              top: y - 15,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: on ? C.desert : "rgba(255,255,255,0.4)",
              boxShadow: on ? "0 0 0 8px rgba(238,139,34,0.28)" : "none",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: X - 12, top: pos - 12, width: 24, height: 24, borderRadius: 6, rotate: "45deg", backgroundColor: C.white }} />
    </div>
  );
};
