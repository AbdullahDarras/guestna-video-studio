import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { BusScene } from "./BusScene";
import { HookScene } from "./HookScene";
import { DiamondWipe } from "../../kit";
import { LogisticsScene } from "./LogisticsScene";
import { NumbersScene } from "./NumbersScene";
import { EduOutroScene } from "./OutroScene";
import { PaymentScene } from "./PaymentScene";
import { PlatformScene } from "./PlatformScene";
import { ProblemScene } from "./ProblemScene";
import { ProgramsScene } from "./ProgramsScene";
import { CUTS, dur, START, TOTAL, VOICE_END, VOICE_LEAD } from "./timing";

// Every scene boundary comes from the voice take (see timing.ts). Cuts hide under a brand diamond wipe
// (the cut happens 8 frames into each 16 frame wipe) just before the next voice section starts.
export const GuestNaEdu: React.FC = () => {
  return (
    <AbsoluteFill name="GuestNa Schools" style={{ backgroundColor: "#1959A6" }}>
      <Sequence name="Hook" durationInFrames={dur(1)}>
        <HookScene />
      </Sequence>
      <Sequence name="Bus" from={START[2]} durationInFrames={dur(2)}>
        <BusScene />
      </Sequence>
      <Sequence name="Problem" from={START[3]} durationInFrames={dur(3)}>
        <ProblemScene />
      </Sequence>
      <Sequence name="Numbers" from={START[4]} durationInFrames={dur(4)}>
        <NumbersScene />
      </Sequence>
      <Sequence name="Programs" from={START[5]} durationInFrames={dur(5)}>
        <ProgramsScene />
      </Sequence>
      <Sequence name="Platform" from={START[6]} durationInFrames={dur(6)}>
        <PlatformScene />
      </Sequence>
      <Sequence name="Payment" from={START[7]} durationInFrames={dur(7)}>
        <PaymentScene />
      </Sequence>
      <Sequence name="Logistics" from={START[8]} durationInFrames={dur(8)}>
        <LogisticsScene />
      </Sequence>
      <Sequence name="Outro" from={START[9]} durationInFrames={dur(9)}>
        <EduOutroScene />
      </Sequence>

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
      <Audio name="Voiceover" src={staticFile("media/edu/voice-final.mp3")} from={VOICE_LEAD} volume={0.95} />
      {CUTS.map((c) => (
        <Audio key={`w${c}`} name="Whoosh" src={staticFile("media/edu/whoosh-soft.mp3")} from={c - 10} volume={0.1} />
      ))}
    </AbsoluteFill>
  );
};

