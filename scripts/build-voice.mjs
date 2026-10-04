#!/usr/bin/env node
// Aligns ONE continuous voice take to the script, cuts it only at the section pauses (keeps the natural flow),
// speeds it up slightly and writes timing.ts with exact frame positions for every phrase.
//
//   npm run voice -- --video edu
//   npm run voice -- --script src/videos/x/script.json --take <take.mp3> --out <voice.mp3> --timing src/videos/x/timing.ts
//
// Why it works this way: separate short TTS clips drift in dialect; a single take keeps the Gulf accent. We never
// cut inside a section, we only find where each phrase starts (silence detection + duration-weighted alignment).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ffmpeg, log, parseArgs, ROOT } from "./lib.mjs";

const args = parseArgs();
const video = args.video;
const script = path.resolve(ROOT, args.script || (video ? `src/videos/${video}/script.json` : ""));
const take = path.resolve(ROOT, args.take || (video ? `public/media/${video}/voice/take.mp3` : ""));
const out = path.resolve(ROOT, args.out || (video ? `public/media/${video}/voice-final.mp3` : ""));
const timingFile = path.resolve(ROOT, args.timing || (video ? `src/videos/${video}/timing.ts` : ""));
if (!args.video && !(args.script && args.take && args.out && args.timing)) {
  log.err("Usage: npm run voice -- --video <name>   (or --script --take --out --timing)");
  process.exit(1);
}
for (const f of [script, take]) {
  if (!fs.existsSync(f)) {
    log.err(`Missing file: ${f}`);
    process.exit(1);
  }
}

const cfg = JSON.parse(fs.readFileSync(script, "utf8"));
const FPS = cfg.fps ?? 30;
const LEAD = cfg.lead ?? 10;
const TAIL = cfg.tail ?? 150;
const SP = Number(args.speed ?? cfg.speed ?? 1.06);
const SECT_GAP = cfg.sectionGap ?? 0.3;
const CUT_AHEAD = cfg.cutAhead ?? 8;

// ---- flat list of phrases ("units") in speaking order
const units = [];
for (const s of cfg.sections) for (const text of s.units) units.push({ sec: s.id, text });
const secIds = cfg.sections.map((s) => s.id);

// ---- decode the take to 16 kHz mono WAV and measure energy (10 ms windows)
const tmp = path.join(os.tmpdir(), `guestna-voice-${process.pid}.wav`);
let r = ffmpeg(["-i", take, "-ac", "1", "-ar", "16000", tmp]);
if (r.status !== 0) {
  log.err(`ffmpeg could not decode the take:\n${r.stderr}`);
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

function detectChunks(th, minGap) {
  // integer window arithmetic (10 ms windows) so results are identical on every machine
  const minWin = Math.round(minGap * 100);
  const out = [];
  let start = -1;
  let last = -1;
  for (let k = 0; k < E.length; k++) {
    if (E[k] >= th) {
      if (start < 0) start = k;
      last = k;
    } else if (start >= 0 && k - last - 1 >= minWin) {
      out.push([(start * 10) / 1000, ((last + 1) * 10) / 1000]);
      start = -1;
    }
  }
  if (start >= 0) out.push([(start * 10) / 1000, ((last + 1) * 10) / 1000]);
  return out;
}
const round2 = (x) => Math.round(x * 100) / 100;

const ch = detectChunks(350, 0.14);
const wt = (t) => {
  const s = t.replace(/Guest ?[Nn]a/g, "جيستنا");
  return Math.max(3, (s.match(/[ء-ي]/g) || []).length);
};
const W = units.map((u) => wt(u.text));
const N = units.length;
const M = ch.length;
const dur = ch.map(([a, b]) => b - a);
const gaps = ch.map((_, i) => (i < M - 1 ? ch[i + 1][0] - ch[i][1] : 9));
const rate = dur.reduce((a, b) => a + b, 0) / W.reduce((a, b) => a + b, 0);
log.info(`${M} speech chunks found for ${N} phrases (take is ${totalDur.toFixed(1)}s)`);
if (M > N) {
  log.err("More speech chunks than phrases. Lower the detection noise or check the take.");
  process.exit(1);
}

// ---- alignment: assign consecutive phrases to chunks (dynamic programming)
const INF = 1e18;
const f = Array.from({ length: M + 1 }, () => Array(N + 1).fill(INF));
const bk = Array.from({ length: M + 1 }, () => Array(N + 1).fill(-1));
f[0][0] = 0;
for (let i = 1; i <= M; i++) {
  for (let j = i; j <= N; j++) {
    for (let k = Math.max(i - 1, j - 4); k < j; k++) {
      if (f[i - 1][k] >= INF) continue;
      const seg = units.slice(k, j);
      const secs = new Set(seg.map((u) => u.sec));
      const wsum = W.slice(k, j).reduce((a, b) => a + b, 0);
      let c = (((dur[i - 1] - rate * wsum) / (0.35 + dur[i - 1])) ** 2) * 10;
      if (secs.size > 1) c += 80;
      if (j < N) {
        const endsSection = units[j - 1].sec !== units[j].sec;
        const g = gaps[i - 1];
        c += endsSection ? (g > 0.28 ? 0 : 3) : g < 0.5 ? 0 : 0.5;
      }
      const tot = f[i - 1][k] + c;
      if (tot < f[i][j]) {
        f[i][j] = tot;
        bk[i][j] = k;
      }
    }
  }
}
if (f[M][N] >= INF) {
  log.err(`Alignment failed: ${M} chunks cannot cover ${N} phrases. Check that the take matches script.json.`);
  process.exit(1);
}
const asg = [];
for (let i = M, j = N; i > 0; i--) {
  const k = bk[i][j];
  asg.push([i - 1, k, j]);
  j = k;
}
asg.reverse();
const unitT = [];
for (const [ci, k, j] of asg) {
  const [a, b] = ch[ci];
  const tot = W.slice(k, j).reduce((x, y) => x + y, 0);
  let t = a;
  for (let u = k; u < j; u++) {
    const seg = ((b - a) * W[u]) / tot;
    unitT[u] = [t, t + seg];
    t += seg;
  }
}

// ---- cut the take only at the pauses between sections
const range = {};
for (const sid of secIds) {
  const ids = units.map((u, i) => (u.sec === sid ? i : -1)).filter((i) => i >= 0);
  range[sid] = [unitT[ids[0]][0], unitT[ids[ids.length - 1]][1]];
}
const fc = [];
const labels = [];
const secOffset = {};
let t = 0;
secIds.forEach((sid, idx) => {
  let [a, b] = range[sid];
  a = idx > 0 ? Math.max(a - 0.04, (range[secIds[idx - 1]][1] + a) / 2) : Math.max(0, a - 0.04);
  b = idx === secIds.length - 1 ? Math.min(b + 0.07, totalDur) : Math.min(b + 0.07, (b + range[secIds[idx + 1]][0]) / 2);
  secOffset[sid] = [a, t];
  fc.push(
    `[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS,atempo=${SP},aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono[c${idx}]`,
  );
  labels.push(`[c${idx}]`);
  t += (b - a) / SP;
  if (idx < secIds.length - 1) {
    fc.push(`anullsrc=r=44100:cl=mono,atrim=0:${SECT_GAP},asetpts=PTS-STARTPTS[g${idx}]`);
    labels.push(`[g${idx}]`);
    t += SECT_GAP;
  }
});
fc.push(`${labels.join("")}concat=n=${labels.length}:v=0:a=1[out]`);
fs.mkdirSync(path.dirname(out), { recursive: true });
r = ffmpeg(["-i", take, "-filter_complex", fc.join(";"), "-map", "[out]", "-ar", "44100", "-ac", "1", "-b:a", "192k", out]);
if (r.status !== 0) {
  log.err(`ffmpeg failed:\n${r.stderr}`);
  process.exit(1);
}

// ---- frame positions for every phrase
const U = {};
const UE = {};
units.forEach((u, i) => {
  const [a0, off] = secOffset[u.sec];
  const [st, en] = unitT[i];
  (U[u.sec] ||= []).push(Math.round(((st - a0) / SP + off) * FPS) + LEAD);
  (UE[u.sec] ||= []).push(Math.round(((en - a0) / SP + off) * FPS) + LEAD);
});
const CUTS = secIds.slice(1).map((s) => U[s][0] - CUT_AHEAD);
const VOICE_END = Math.max(...UE[secIds[secIds.length - 1]]);
const TOTAL = VOICE_END + TAIL;
const last = secIds[secIds.length - 1];
const startMap = [`${secIds[0]}: 0`, ...secIds.slice(1).map((s, i) => `${s}: ${CUTS[i]}`)].join(", ");
fs.writeFileSync(
  timingFile,
  `// Generated by scripts/build-voice.mjs from the voice take. Do not edit by hand. Frames are absolute at ${FPS}fps.
export const FPS = ${FPS};
export const VOICE_LEAD = ${LEAD};
export const TOTAL = ${TOTAL};
export const VOICE_END = ${VOICE_END};
/** First frame of every phrase per voice section */
export const U: Record<number, number[]> = ${JSON.stringify(U)};
/** Last frame of every phrase per voice section */
export const UE: Record<number, number[]> = ${JSON.stringify(UE)};
/** Scene cuts (hidden under the diamond wipe), one per scene after the first */
export const CUTS = ${JSON.stringify(CUTS)} as const;
/** Absolute start frame of each scene */
export const START: Record<number, number> = { ${startMap} };
/** Local frame of phrase k in scene s (offset by \`extra\` frames) */
export const at = (s: number, k: number, extra = 0): number => U[s][k] - START[s] + extra;
export const endAt = (s: number, k: number, extra = 0): number => UE[s][k] - START[s] + extra;
/** Duration in frames of scene s */
export const dur = (s: number): number => (s === ${last} ? TOTAL : START[s + 1]) - START[s];
`,
);
log.ok(`Voice written: ${path.relative(ROOT, out)} (${t.toFixed(1)}s)`);
log.ok(`Timing written: ${path.relative(ROOT, timingFile)}  total ${TOTAL} frames (${(TOTAL / FPS).toFixed(1)}s)`);
