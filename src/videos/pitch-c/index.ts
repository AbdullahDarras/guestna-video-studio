import { toReal } from "../../clock";
import type { SceneSpec } from "../../pitch/stage";
import type { VideoDef } from "../registry";
import { PitchC } from "./PitchC";
import { C1, C2, C3, C4, C5, C6, C7, C8, C9 } from "./scenes";
import { TOTAL } from "./timing";
import { sceneDur } from "./tt";

export const SCENES: readonly SceneSpec[] = [
  { id: 1, name: "Ambition", C: C1, exit: "zoom" },
  { id: 2, name: "Question", C: C2, enter: "zoom", exit: "iris" },
  { id: 3, name: "OnePlatform", C: C3, enter: "iris", origin: { x: 540, y: 1000 }, exit: "rise" },
  { id: 4, name: "Market", C: C4, enter: "rise", exit: "whip" },
  { id: 5, name: "Parent", C: C5, enter: "whip", exit: "zoom" },
  { id: 6, name: "Result", C: C6, enter: "zoom", exit: "rise" },
  { id: 7, name: "Global", C: C7, enter: "rise", exit: "zoom" },
  { id: 8, name: "Memories", C: C8, enter: "zoom", exit: "bloom" },
  { id: 9, name: "Outro", C: C9, enter: "bloom", origin: { x: 540, y: 960 } },
];

/** Pitch C: cinematic and photo-led. Voice: user recording IMG_2829, cleaned. 60fps. */
export const pitchCDef: VideoDef = {
  id: "PitchC",
  component: PitchC,
  durationInFrames: toReal(TOTAL, 60),
  fps: 60,
  scenes: SCENES.map((s) => ({ id: s.name, component: s.C, durationInFrames: toReal(sceneDur(s.id), 60) })),
};
