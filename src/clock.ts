import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * The kit is designed in 30fps frames. `useFrame()` returns the current frame converted to that design clock, so every
 * duration written as "frames" keeps its real-time length at any composition fps (60fps gives twice the frames, same speed).
 * At 30fps it is identical to useCurrentFrame().
 */
export const DESIGN_FPS = 30;

export const useFrame = (): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame * DESIGN_FPS) / fps;
};

/** Real frames in a composition at `fps` for a duration written in design (30fps) frames. */
export const toReal = (designFrames: number, fps: number): number => Math.round((designFrames * fps) / DESIGN_FPS);
