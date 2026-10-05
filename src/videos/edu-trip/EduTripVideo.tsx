import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { DiamondWipe } from "../../kit";
import { BookingsScene } from "./BookingsScene";
import { HookScene } from "./HookScene";
import { MealsScene } from "./MealsScene";
import { TripOutroScene } from "./OutroScene";
import { ProgramsScene } from "./ProgramsScene";
import { Rail } from "./Rail";
import { TransportScene } from "./TransportScene";
import { CUTS, dur, START, TOTAL, VOICE_END, VOICE_LEAD } from "./timing";
import { C } from "../../brand";

// "كل شي للرحلة": 6 scenes cut under the brand diamond wipe, a journey rail tracks the four stations.
export const EduTripVideo: React.FC = () => (
  <AbsoluteFill name="GuestNa Trip" style={{ backgroundColor: C.sea }}>
    <Sequence name="Hook" durationInFrames={dur(1)}>
      <HookScene />
    </Sequence>
    <Sequence name="Programs" from={START[2]} durationInFrames={dur(2)}>
      <ProgramsScene />
    </Sequence>
    <Sequence name="Transport" from={START[3]} durationInFrames={dur(3)}>
      <TransportScene />
    </Sequence>
    <Sequence name="Meals" from={START[4]} durationInFrames={dur(4)}>
      <MealsScene />
    </Sequence>
    <Sequence name="Bookings" from={START[5]} durationInFrames={dur(5)}>
      <BookingsScene />
    </Sequence>
    <Sequence name="Outro" from={START[6]} durationInFrames={dur(6)}>
      <TripOutroScene />
    </Sequence>

    <Rail />

    {CUTS.map((c) => (
      <Sequence key={c} name={`Wipe ${c}`} from={c - 8} durationInFrames={16}>
        <DiamondWipe />
      </Sequence>
    ))}

    <Audio
      name="Music"
      src={staticFile("media/edu/music.mp3")}
      durationInFrames={TOTAL}
      volume={(f) =>
        interpolate(f, [0, 10, 30, VOICE_END, VOICE_END + 40, TOTAL - 40, TOTAL], [0.42, 0.42, 0.15, 0.15, 0.32, 0.32, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
    <Audio name="Voiceover" src={staticFile("media/edu-trip/voice-final.mp3")} from={VOICE_LEAD} volume={0.95} />
    {CUTS.map((c) => (
      <Audio key={`w${c}`} name="Whoosh" src={staticFile("media/edu/whoosh-soft.mp3")} from={c - 10} volume={0.1} />
    ))}
  </AbsoluteFill>
);
