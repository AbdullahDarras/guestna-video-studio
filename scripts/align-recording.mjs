#!/usr/bin/env node
// Aligns a HUMAN voice recording (already cleaned) to a transcript and writes timing.ts for the scenes.
// Unlike build-voice (one TTS take, cut at pauses) the recording is kept whole, nothing is cut or sped up.
//
//   npm run align -- --video pitch-a --audio /path/polished.wav
//   npm run align -- --video pitch-a --audio ... --debug      prints speech chunks and where each sentence snapped
//
// src/videos/<video>/transcript.json:
//   { "fps": 30, "cutAhead": 14, "tail": 90,
//     "scenes": [ { "id": 1, "sentences": [ { "t": 0.8, "units": ["phrase 1", "phrase 2"] } ] } ] }
// `t` is the approximate start second of the sentence (from a transcript). It is snapped to the nearest real speech onset.
// Writes public/media/<video>/voice.mp3 and src/videos/<video>/timing.ts (design frames at 30fps).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ffmpeg, log, parseArgs, ROOT } from "./lib.mjs";

const args = parseArgs();
const video = args.video;
const audio = args.audio ? path.resolve(String(args.audio)) : "";
if (!video || !audio || !fs.existsSync(audio)) {
  log.err("Usage: npm run align -- --video <name> --audio <cleaned.wav> [--debug]");
  process.exit(1);
}
const cfgFile = path.join(ROOT, "src", "videos", video, "transcript.json");
const cfg = JSON.parse(fs.readFileSync(cfgFile, "utf8"));
const FPS = cfg.fps ?? 30;
const CUT_AHEAD = cfg.cutAhead ?? 14;
const TAIL = cfg.tail ?? 90;
const SNAP = cfg.snap ?? 1.6;
const MIN_GAP = cfg.minGap ?? 0.12;
const TH = cfg.threshold ?? 500;

// ---- decode to 16 kHz mono and measure energy in 10 ms windows
const tmp = path.join(os.tmpdir(), `guestna-align-${process.pid}.wav`);
const r = ffmpeg(["-i", audio, "-ac", "1", "-ar", "16000", tmp]);
if (r.status !== 0) {
  log.err(`ffmpeg could not decode the audio:\n${r.stderr}`);
  process.exit(1);
}
const wav = fs.readFileSync(tmp);
fs.unlinkSync(tmp);
let p = 12;
let dataStart = 44;
while (p + 8 <= wav.length) {
  const id = wav.toString("ascii", p, p + 4);
  const size = wav.readUInt32LE(p + 4);
  if (id === "data") {
    dataStart = p + 8;
    break;
  }
  p += 8 + size;
}
const sr = 16000;
const n = Math.floor((wav.length - dataStart) / 2);
const win = sr / 100;
const E = [];
for (let k = 0; k + win <= n; k += win) {
  let s = 0;
  for (let i = 0; i < win; i++) {
    const v = wav.readInt16LE(dataStart + (k + i) * 2);
    s += v * v;
  }
  E.push(Math.sqrt(s / win));
}
const totalDur = n / sr;

function chunks(th, minGap) {
  const minWin = Math.round(minGap * 100);
  const out = [];
  let start = -1;
  let last = -1;
  for (let k = 0; k < E.length; k++) {
    if (E[k] >= th) {
      if (start < 0) start = k;
      last = k;
    } else if (start >= 0 && k - last - 1 >= minWin) {
      out.push([start / 100, (last + 1) / 100]);
      start = -1;
    }
  }
  if (start >= 0) out.push([start / 100, (last + 1) / 100]);
  return out;
}
const ch = chunks(TH, MIN_GAP);

// ---- flatten sentences, choose each sentence onset among the speech onsets near its transcript time.
// Score = distance from the transcript time (cheap) minus a bonus for a long silence right before the onset (sentence boundary).
const sentences = [];
for (const sc of cfg.scenes) for (const s of sc.sentences) sentences.push({ scene: sc.id, ...s });
const onsets = ch.map(([a], i) => ({ i, t: a, gap: i === 0 ? a : a - ch[i - 1][1] }));
// the transcript time itself is always a candidate too (sentences spoken without any pause before them)
const cand = sentences.map((s) => [...onsets.filter((o) => Math.abs(o.t - s.t) <= SNAP), { i: -1, t: s.t, gap: 0 }].sort((x, y) => x.t - y.t));
const cost = (s, o) => Math.abs(o.t - s.t) / 1.2 - Math.min(o.gap, 1.2) * 3;
const best = sentences.map((s, k) => cand[k].map(() => ({ c: Infinity, from: -1 })));
sentences.forEach((s, k) => {
  cand[k].forEach((o, j) => {
    if (k === 0) best[k][j] = { c: cost(s, o), from: -1 };
    else
      cand[k - 1].forEach((po, pj) => {
        if (po.t < o.t - 0.2 && best[k - 1][pj].c + cost(s, o) < best[k][j].c) best[k][j] = { c: best[k - 1][pj].c + cost(s, o), from: pj };
      });
  });
});
{
  let k = sentences.length - 1;
  let j = best[k].reduce((bj, x, i) => (x.c < (best[k][bj]?.c ?? Infinity) ? i : bj), 0);
  if (!cand[k].length || best[k][j].c === Infinity) {
    log.err(`Could not align: no consistent speech onsets near the transcript times (last sentence t=${sentences[k].t}). Try a larger "snap" or fix the transcript times.`);
    process.exit(1);
  }
  for (; k >= 0; k--) {
    sentences[k].on = cand[k][j].t;
    sentences[k].chunk = cand[k][j].i;
    j = best[k][j].from;
  }
}

// sentence end = end of the last chunk that starts before the next sentence
for (let i = 0; i < sentences.length; i++) {
  const nextOn = i + 1 < sentences.length ? sentences[i + 1].on : totalDur + 1;
  let end = sentences[i].on + 0.5;
  for (const [a, b] of ch) if (a >= sentences[i].on - 0.01 && a < nextOn - 0.01) end = Math.max(end, b);
  sentences[i].end = Math.min(end, nextOn);
}

if (args.debug) {
  console.log(`${ch.length} chunks:`, ch.map(([a, b]) => `${a.toFixed(1)}-${b.toFixed(1)}`).join(" "));
  for (const s of sentences) console.log(`scene ${s.scene}  t=${s.t}  ->  on=${s.on.toFixed(2)} end=${s.end.toFixed(2)} (chunk ${s.chunk})  ${s.units.join(" | ")}`);
}

// ---- split sentence time across its units by letter count
const wt = (t) => Math.max(2, (t.replace(/Guest ?[Nn]a/g, "جيستنا").match(/[ء-ي]/g) || []).length);
const U = {};
const UE = {};
for (const sc of cfg.scenes) {
  U[sc.id] = [];
  UE[sc.id] = [];
}
for (const s of sentences) {
  const total = s.units.reduce((a, u) => a + wt(u), 0);
  let t = s.on;
  for (const u of s.units) {
    const d = ((s.end - s.on) * wt(u)) / total;
    U[s.scene].push(Math.round(t * FPS));
    UE[s.scene].push(Math.round((t + d) * FPS));
    t += d;
  }
}
const ids = cfg.scenes.map((s) => s.id);
const START = {};
ids.forEach((id, i) => {
  START[id] = i === 0 ? 0 : Math.max(START[ids[i - 1]] + 30, U[id][0] - CUT_AHEAD);
});
const VOICE_END = UE[ids[ids.length - 1]].at(-1);
const TOTAL = Math.max(VOICE_END + TAIL, Math.ceil(totalDur * FPS));
const CUTS = ids.slice(1).map((id) => START[id]);

const outDir = path.join(ROOT, "public", "media", video);
fs.mkdirSync(outDir, { recursive: true });
const mp3 = path.join(outDir, "voice.mp3");
const enc = ffmpeg(["-i", audio, "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "192k", mp3]);
if (enc.status !== 0) {
  log.err(`ffmpeg could not write ${mp3}:\n${enc.stderr}`);
  process.exit(1);
}

const lines = [
  "// Generated by scripts/align-recording.mjs from the human voice recording. Do not edit by hand. Frames are design frames (30fps).",
  `export const FPS = ${FPS};`,
  "export const VOICE_LEAD = 0;",
  `export const TOTAL = ${TOTAL};`,
  `export const VOICE_END = ${VOICE_END};`,
  "/** First frame of every phrase per scene */",
  `export const U: Record<number, number[]> = ${JSON.stringify(U)};`,
  "/** Last frame of every phrase per scene */",
  `export const UE: Record<number, number[]> = ${JSON.stringify(UE)};`,
  "/** Scene cuts, one per scene after the first */",
  `export const CUTS = ${JSON.stringify(CUTS)} as const;`,
  "/** Start frame of each scene */",
  `export const START: Record<number, number> = ${JSON.stringify(START)};`,
  "/** Local frame of phrase k in scene s (offset by `extra` frames) */",
  "export const at = (s: number, k: number, extra = 0): number => U[s][k] - START[s] + extra;",
  "export const endAt = (s: number, k: number, extra = 0): number => UE[s][k] - START[s] + extra;",
  "/** Duration in frames of scene s */",
  `export const dur = (s: number): number => (s === ${ids.at(-1)} ? TOTAL : START[s + 1]) - START[s];`,
  "",
];
fs.writeFileSync(path.join(ROOT, "src", "videos", video, "timing.ts"), lines.join("\n"));
log.ok(`Aligned ${sentences.length} sentences in ${ids.length} scenes. Total ${TOTAL} frames (${(TOTAL / FPS).toFixed(1)}s). Wrote public/media/${video}/voice.mp3 and src/videos/${video}/timing.ts`);
