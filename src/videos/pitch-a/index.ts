import { toReal } from "../../clock";
import type { SceneSpec } from "../../pitch/stage";
import type { VideoDef } from "../registry";
import { PitchA } from "./PitchA";
import { S1, S10, S2, S3, S4, S5, S6, S7, S8, S9 } from "./scenes";
import { TOTAL } from "./timing";
import { sceneDur } from "./tt";

export const SCENES: readonly SceneSpec[] = [
  { id: 1, name: "Greeting", C: S1, exit: "zoom" },
  { id: 2, name: "Chaos", C: S2, enter: "zoom", exit: "bloom" },
  { id: 3, name: "Order", C: S3, enter: "bloom", origin: { x: 540, y: 880 }, exit: "rise" },
  { id: 4, name: "Revenue", C: S4, enter: "rise", exit: "whip" },
  { id: 5, name: "Platform", C: S5, enter: "whip", exit: "zoom" },
  { id: 6, name: "Leader", C: S6, enter: "zoom", exit: "rise" },
  { id: 7, name: "Parent", C: S7, enter: "rise", exit: "iris" },
  { id: 8, name: "Partners", C: S8, enter: "iris", origin: { x: 540, y: 1000 }, exit: "zoom" },
  { id: 9, name: "Enjoy", C: S9, enter: "zoom", exit: "bloom" },
  { id: 10, name: "Outro", C: S10, enter: "bloom", origin: { x: 540, y: 960 } },
];

/** Pitch A: from the chaos of manual trips to one button. Voice: user recording IMG_2826, cleaned. 60fps. */
export const pitchADef: VideoDef = {
  id: "PitchA",
  component: PitchA,
  durationInFrames: toReal(TOTAL, 60),
  fps: 60,
  scenes: SCENES.map((s) => ({ id: s.name, component: s.C, durationInFrames: toReal(sceneDur(s.id), 60) })),
};
