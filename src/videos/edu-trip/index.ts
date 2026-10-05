import { BookingsScene } from "./BookingsScene";
import { EduTripVideo } from "./EduTripVideo";
import { HookScene } from "./HookScene";
import { MealsScene } from "./MealsScene";
import { TripOutroScene } from "./OutroScene";
import { ProgramsScene } from "./ProgramsScene";
import { TransportScene } from "./TransportScene";
import { TOTAL } from "./timing";
import { sceneDur } from "./tt";
import type { VideoDef } from "../registry";

/** GuestNa for Schools: "كل شي للرحلة" (guestna-edu.com). 9:16, timing from the voice take. */
export const eduTripDef: VideoDef = {
  id: "EduTrip",
  component: EduTripVideo,
  durationInFrames: TOTAL,
  scenes: [
    { id: "TripHook", component: HookScene, durationInFrames: sceneDur(1) },
    { id: "TripPrograms", component: ProgramsScene, durationInFrames: sceneDur(2) },
    { id: "TripTransport", component: TransportScene, durationInFrames: sceneDur(3) },
    { id: "TripMeals", component: MealsScene, durationInFrames: sceneDur(4) },
    { id: "TripBookings", component: BookingsScene, durationInFrames: sceneDur(5) },
    { id: "TripOutro", component: TripOutroScene, durationInFrames: sceneDur(6) },
  ],
};
