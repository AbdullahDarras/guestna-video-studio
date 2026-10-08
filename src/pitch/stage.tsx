import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { C } from "../brand";
import { DESIGN_FPS, toReal } from "../clock";
import { Shell, type TransitionKind } from "../transitions";

/** Design frames (30fps) a scene starts before its voice section so it can transition in over the previous scene. */
export const LEAD = 12;

type TimingLike = {
  readonly START: Record<number, number>;
  readonly TOTAL: number;
  readonly at: (s: number, k: number, extra?: number) => number;
  readonly endAt: (s: number, k: number, extra?: number) => number;
};

/** Scene clock helpers for one video. Scenes use `at(scene, phrase)` (already offset by the transition lead). */
export const makeTT = (T: TimingLike, ids: readonly number[]) => {
  const last = ids[ids.length - 1];
  const lead = (s: number) => (s === ids[0] ? 0 : LEAD);
  const sceneFrom = (s: number) => T.START[s] - lead(s);
  const sceneDur = (s: number) => (s === last ? T.TOTAL : T.START[s + 1] + LEAD) - sceneFrom(s);
  return {
    at: (s: number, k: number, extra = 0) => T.at(s, k, extra + lead(s)),
    endAt: (s: number, k: number, extra = 0) => T.endAt(s, k, extra + lead(s)),
    sceneFrom,
    sceneDur,
  };
};

export type SceneSpec = {
  readonly id: number;
  readonly name: string;
  readonly C: React.FC;
  readonly enter?: TransitionKind;
  readonly exit?: TransitionKind;
  readonly origin?: { readonly x: number; readonly y: number };
};

/** Scenes + voice + music + whooshes for a pitch video. Scene numbers are design frames, rendered at the composition fps. */
export const PitchStage: React.FC<{
  readonly video: string;
  readonly scenes: readonly SceneSpec[];
  readonly tt: ReturnType<typeof makeTT>;
  readonly total: number;
  readonly voiceEnd: number;
  readonly cuts: readonly number[];
  readonly musicVolume?: number;
  readonly children?: React.ReactNode;
}> = ({ video, scenes, tt, total, voiceEnd, cuts, musicVolume = 0.2, children }) => {
  const { fps } = useVideoConfig();
  const toDesign = (f: number) => (f * DESIGN_FPS) / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: C.sea }}>
      {scenes.map((s) => (
        <Sequence key={s.id} name={s.name} from={toReal(tt.sceneFrom(s.id), fps)} durationInFrames={toReal(tt.sceneDur(s.id), fps)}>
          <Shell total={tt.sceneDur(s.id)} enter={s.enter} exit={s.exit} origin={s.origin}>
            <s.C />
          </Shell>
        </Sequence>
      ))}
      {children}
      <Audio
        name="Music"
        src={staticFile("media/pitch/music.mp3")}
        durationInFrames={toReal(total, fps)}
        volume={(f) => {
          const d = toDesign(f);
          return interpolate(d, [0, 20, 60, voiceEnd, voiceEnd + 40, total - 40, total], [musicVolume * 2, musicVolume * 2, musicVolume * 0.55, musicVolume * 0.55, musicVolume * 1.5, musicVolume * 1.5, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }}
      />
      <Audio name="Voiceover" src={staticFile(`media/${video}/voice.mp3`)} volume={1} />
      {cuts.map((c) => (
        <Audio key={`w${c}`} name="Whoosh" src={staticFile("media/edu/whoosh-soft.mp3")} from={toReal(c - 14, fps)} volume={0.09} />
      ))}
    </AbsoluteFill>
  );
};
