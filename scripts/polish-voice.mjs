#!/usr/bin/env node
// Final polish for a human voice recording (after noise removal): high-pass, gentle EQ, light compression, loudness for reels.
//   npm run voice:polish -- --in isolated.mp3 --out polished.wav          (default target -16 LUFS, peak -1.5 dB)
//   npm run voice:polish -- --video "/path/IMG_1234.MOV" --out extracted.wav   extracts the audio track first (mono, 44.1 kHz)
// Needs ffmpeg on PATH (brew install ffmpeg). Remotion's bundled ffmpeg is used as a fallback but it lacks some filters.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ffmpeg as remotionFfmpeg, log, parseArgs } from "./lib.mjs";

const args = parseArgs();
const out = args.out ? path.resolve(String(args.out)) : "";
const input = args.in || args.video;
if (!input || !out || !fs.existsSync(String(input))) {
  log.err("Usage: npm run voice:polish -- --in <audio> --out <file.wav>   or   --video <file.MOV> --out <file.wav> (just extracts the audio)");
  process.exit(1);
}
const lufs = Number(args.lufs ?? -16);
const filter = args.video
  ? null
  : `highpass=f=75,equalizer=f=200:t=q:w=1.2:g=-1.5,equalizer=f=3200:t=q:w=1.0:g=1.8,equalizer=f=9000:t=h:w=2000:g=1.2,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=2,loudnorm=I=${lufs}:TP=-1.5:LRA=7`;
const a = ["-y", "-v", "error", "-i", String(input), "-vn", ...(filter ? ["-af", filter, "-ar", "48000"] : ["-ar", "44100"]), "-ac", "1", out];

let r = spawnSync("ffmpeg", a, { encoding: "utf8" });
if (r.error || r.status !== 0) {
  if (!r.error) log.err(r.stderr);
  log.warn?.("ffmpeg from PATH failed or is missing, trying Remotion's bundled ffmpeg (fewer filters).");
  r = remotionFfmpeg(a.slice(3));
}
if (r.status !== 0) {
  log.err(`Could not process the audio:\n${r.stderr}`);
  process.exit(1);
}
log.ok(`Wrote ${out}`);
