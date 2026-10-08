import { toReal } from "../../clock";
import type { SceneSpec } from "../../pitch/stage";
import type { VideoDef } from "../registry";
import { PitchB } from "./PitchB";
import { B1, B2, B3, B4, B5, B6, B7, B8, B9 } from "./scenes";
import { TOTAL } from "./timing";
import { sceneDur } from "./tt";

export const SCENES: readonly SceneSpec[] = [
  { id: 1, name: "Question", C: B1, exit: "whip" },
  { id: 2, name: "Time", C: B2, enter: "whip", exit: "zoom" },
  { id: 3, name: "NewEra", C: B3, enter: "zoom", exit: "rise" },
  { id: 4, name: "Market", C: B4, enter: "rise", exit: "iris" },
  { id: 5, name: "Parent", C: B5, enter: "iris", origin: { x: 540, y: 560 }, exit: "whip" },
  { id: 6, name: "Result", C: B6, enter: "whip", exit: "zoom" },
  { id: 7, name: "Students", C: B7, enter: "zoom", exit: "rise" },
  { id: 8, name: "Role", C: B8, enter: "rise", exit: "bloom" },
  { id: 9, name: "Outro", C: B9, enter: "bloom", origin: { x: 540, y: 1000 } },
];

/** Pitch B: bold type and numbers. Voice: user recording IMG_2828, cleaned. 60fps. */
export const pitchBDef: VideoDef = {
  id: "PitchB",
  component: PitchB,
  durationInFrames: toReal(TOTAL, 60),
  fps: 60,
  scenes: SCENES.map((s) => ({ id: s.name, component: s.C, durationInFrames: toReal(sceneDur(s.id), 60) })),
};
