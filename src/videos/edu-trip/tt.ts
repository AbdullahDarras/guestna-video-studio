// Scene timing with transition overlap. Every scene except the first starts H frames before its voice section so it
// can transition in over the previous scene, and every scene except the last ends H frames after the next section starts.
import { at as rawAt, START, TOTAL } from "./timing";

export const H = 10;
const LAST = 6;

const lead = (s: number) => (s === 1 ? 0 : H);
/** Local frame of phrase k of scene s, inside the scene (already offset for the transition overlap). */
export const at = (s: number, k: number, extra = 0): number => rawAt(s, k, extra + lead(s));
export const sceneFrom = (s: number): number => START[s] - lead(s);
export const sceneDur = (s: number): number => (s === LAST ? TOTAL : START[s + 1] + H) - sceneFrom(s);
