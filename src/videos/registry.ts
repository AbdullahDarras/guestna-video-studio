import type React from "react";
// @videos-import
import { pitchCDef } from "./pitch-c";
import { pitchBDef } from "./pitch-b";
import { pitchADef } from "./pitch-a";
import { eduTripDef } from "./edu-trip";
import { appVideo } from "./app";
import { demoVideo } from "./demo";
import { eduVideo } from "./edu";

export type SceneDef = {
  readonly id: string;
  readonly component: React.FC;
  readonly durationInFrames: number;
};

export type VideoDef = {
  readonly id: string;
  readonly component: React.FC;
  readonly durationInFrames: number;
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  /** Optional: every scene as its own Studio composition (for focused editing). */
  readonly scenes?: readonly SceneDef[];
};

/** Every video of the studio. `npm run new:video -- <name>` adds new entries here. */
export const VIDEOS: readonly VideoDef[] = [
  demoVideo,
  eduVideo,
  appVideo,
  eduTripDef,
  pitchADef,
  pitchBDef,
  pitchCDef,
  // @videos-list
];
