import { makeTT } from "../../pitch/stage";
import * as T from "./timing";

export const IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const tt = makeTT(T, IDS);
export const { at, endAt, sceneFrom, sceneDur } = tt;
