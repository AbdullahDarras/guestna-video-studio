import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { C } from "../../brand";
import { Shell, type TransitionKind } from "../../transitions";
import { BookingsScene } from "./BookingsScene";
import { HookScene } from "./HookScene";
import { MealsScene } from "./MealsScene";
import { TripOutroScene } from "./OutroScene";
import { ProgramsScene } from "./ProgramsScene";
import { Rail } from "./Rail";
import { TransportScene } from "./TransportScene";
import { CUTS, TOTAL, VOICE_END, VOICE_LEAD } from "./timing";
import { sceneDur, sceneFrom } from "./tt";

type SceneEntry = {
  readonly id: number;
  readonly name: string;
  readonly C: React.FC;
  readonly enter?: TransitionKind;
  readonly exit?: TransitionKind;
  readonly origin?: { readonly x: number; readonly y: number };
};

// Every cut is a different soft transition: zoom-through, rise, iris from the last station, whip, bloom into the outro.
const SCENES: readonly SceneEntry[] = [
  { id: 1, name: "Hook", C: HookScene, exit: "zoom" },
  { id: 2, name: "Programs", C: ProgramsScene, enter: "zoom", exit: "rise" },
  { id: 3, name: "Transport", C: TransportScene, enter: "rise", exit: "iris" },
  { id: 4, name: "Meals", C: MealsScene, enter: "iris", origin: { x: 310, y: 1420 }, exit: "whip" },
  { id: 5, name: "Bookings", C: BookingsScene, enter: "whip", exit: "bloom" },
  { id: 6, name: "Outro", C: TripOutroScene, enter: "bloom", origin: { x: 540, y: 960 } },
];

export const EduTripVideo: React.FC = () => (
  <AbsoluteFill name="GuestNa Trip" style={{ backgroundColor: C.sea }}>
    {SCENES.map((s) => (
      <Sequence key={s.id} name={s.name} from={sceneFrom(s.id)} durationInFrames={sceneDur(s.id)}>
        <Shell total={sceneDur(s.id)} enter={s.enter} exit={s.exit} origin={s.origin}>
          <s.C />
        </Shell>
      </Sequence>
    ))}

    <Rail />

    <Audio
      name="Music"
      src={staticFile("media/edu/music.mp3")}
      durationInFrames={TOTAL}
      volume={(f) =>
        interpolate(f, [0, 10, 30, VOICE_END, VOICE_END + 30, TOTAL - 30, TOTAL], [0.42, 0.42, 0.15, 0.15, 0.32, 0.32, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio name="Voiceover" src={staticFile("media/edu-trip/voice-final.mp3")} from={VOICE_LEAD} volume={0.95} />
    {CUTS.map((c) => (
      <Audio key={`w${c}`} name="Whoosh" src={staticFile("media/edu/whoosh-soft.mp3")} from={c - 12} volume={0.1} />
    ))}
  </AbsoluteFill>
);
