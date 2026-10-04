import { BrandDemo } from "./BrandDemo";
import type { VideoDef } from "../registry";

/** Smoke test that needs only the brand assets in the repo. Also the starter for `npm run new:video`. */
export const demoVideo: VideoDef = {
  id: "BrandDemo",
  component: BrandDemo,
  durationInFrames: 150,
};
