import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { CustomScene } from "./CustomScene";
import { DestinationsScene } from "./DestinationsScene";
import { IntroScene } from "./IntroScene";
import { OutroScene } from "./OutroScene";
import { TripTypesScene } from "./TripTypesScene";
import { TrustScene } from "./TrustScene";

// 35s at 30fps. Each scene overlaps the next by 10 frames (cross-fade).
// Voice starts at 1.6s so the logo has its moment first.
export const GuestNaReel: React.FC = () => {
  return (
    <AbsoluteFill name="GuestNa Reel" style={{ backgroundColor: "#1959A6" }}>
      <Sequence name="Intro" durationInFrames={136}>
        <IntroScene />
      </Sequence>
      <Sequence name="Destinations" from={126} durationInFrames={196}>
        <DestinationsScene />
      </Sequence>
      <Sequence name="Trip types" from={312} durationInFrames={106}>
        <TripTypesScene />
      </Sequence>
      <Sequence name="Custom" from={408} durationInFrames={121}>
        <CustomScene />
      </Sequence>
      <Sequence name="Trust" from={519} durationInFrames={253}>
        <TrustScene />
      </Sequence>
      <Sequence name="Outro" from={762} durationInFrames={288}>
        <OutroScene />
      </Sequence>

      <Audio
        name="Music"
        src={staticFile("media/app/audio/music.mp3")}
        durationInFrames={1050}
        volume={(f) =>
          interpolate(f, [0, 40, 60, 830, 870, 1000, 1050], [0.16, 0.16, 0.07, 0.07, 0.16, 0.16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Audio name="Voiceover" src={staticFile("media/app/audio/voiceover.mp3")} from={48} volume={0.92} />
    </AbsoluteFill>
  );
};
