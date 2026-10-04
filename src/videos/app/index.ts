import { CustomScene } from "./CustomScene";
import { DestinationsScene } from "./DestinationsScene";
import { GuestNaReel } from "./GuestNaReel";
import { IntroScene } from "./IntroScene";
import { OutroScene } from "./OutroScene";
import { TripTypesScene } from "./TripTypesScene";
import { TrustScene } from "./TrustScene";
import type { VideoDef } from "../registry";

/** GuestNa app reel (guestna.app). 9:16, 35 seconds. */
export const appVideo: VideoDef = {
  id: "GuestNaApp",
  component: GuestNaReel,
  durationInFrames: 1050,
  scenes: [
    { id: "Intro", component: IntroScene, durationInFrames: 136 },
    { id: "Destinations", component: DestinationsScene, durationInFrames: 196 },
    { id: "TripTypes", component: TripTypesScene, durationInFrames: 106 },
    { id: "Custom", component: CustomScene, durationInFrames: 121 },
    { id: "Trust", component: TrustScene, durationInFrames: 253 },
    { id: "Outro", component: OutroScene, durationInFrames: 288 },
  ],
};
