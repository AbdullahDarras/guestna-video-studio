import React from "react";
import { PitchStage } from "../../pitch/stage";
import { SCENES } from "./index";
import { CUTS, TOTAL, VOICE_END } from "./timing";
import { tt } from "./tt";

export const PitchA: React.FC = () => <PitchStage video="pitch-a" scenes={SCENES} tt={tt} total={TOTAL} voiceEnd={VOICE_END} cuts={CUTS} musicVolume={0.2} />;
