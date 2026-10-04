import { BusScene } from "./BusScene";
import { GuestNaEdu } from "./GuestNaEdu";
import { HookScene } from "./HookScene";
import { LogisticsScene } from "./LogisticsScene";
import { NumbersScene } from "./NumbersScene";
import { EduOutroScene } from "./OutroScene";
import { PaymentScene } from "./PaymentScene";
import { PlatformScene } from "./PlatformScene";
import { ProblemScene } from "./ProblemScene";
import { ProgramsScene } from "./ProgramsScene";
import { dur, TOTAL } from "./timing";
import type { VideoDef } from "../registry";

/** GuestNa for Schools reel (guestna-edu.com). 9:16, scene timing comes from the voice take (timing.ts). */
export const eduVideo: VideoDef = {
  id: "GuestNaEdu",
  component: GuestNaEdu,
  durationInFrames: TOTAL,
  scenes: [
    { id: "Hook", component: HookScene, durationInFrames: dur(1) },
    { id: "Bus", component: BusScene, durationInFrames: dur(2) },
    { id: "Problem", component: ProblemScene, durationInFrames: dur(3) },
    { id: "Numbers", component: NumbersScene, durationInFrames: dur(4) },
    { id: "Programs", component: ProgramsScene, durationInFrames: dur(5) },
    { id: "Platform", component: PlatformScene, durationInFrames: dur(6) },
    { id: "Payment", component: PaymentScene, durationInFrames: dur(7) },
    { id: "Logistics", component: LogisticsScene, durationInFrames: dur(8) },
    { id: "Outro", component: EduOutroScene, durationInFrames: dur(9) },
  ],
};
