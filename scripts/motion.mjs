#!/usr/bin/env node
// GuestNa Motion Lexicon tools (source of truth: motion/lexicon.json).
//   npm run motion -- lookup <word>                      search terms (Arabic or English)
//   npm run motion -- list [family]                      list terms, or the families
//   npm run motion -- brief <video>                      scaffold src/videos/<video>/motion-brief.json from script.json
//   npm run motion -- lint <video>                       check the motion brief against the lexicon and the studio rules
//   npm run motion -- prompt --subject "..." [options]   build an AI video/image prompt from lexicon terms
//   npm run motion -- lint-all                          lint every video that has a motion-brief.json (runs inside npm run lint)
//   npm run motion -- docs                               regenerate the human-readable reference
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { log, parseArgs, ROOT } from "./lib.mjs";

const lexFile = path.join(ROOT, "motion", "lexicon.json");
const lex = JSON.parse(fs.readFileSync(lexFile, "utf8"));
const byId = new Map(lex.terms.map((t) => [t.id, t]));
const FPS = lex.meta.fps;
const [cmd, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);

const norm = (s) => String(s).toLowerCase().replace(/[\s_-]+/g, "");
const fmt = (t) => `${t.id}  [${lex.meta.families[t.family]}]  ${t.en} / ${t.ar}\n   ${t.what}${t.rm ? `\n   Remotion: ${t.rm}` : ""}${t.pr ? `\n   Prompt: ${t.pr}` : ""}`;

function lookup(q) {
  const n = norm(q);
  return lex.terms.filter((t) => [t.id, t.en, t.ar, t.what].some((f) => norm(f).includes(n)));
}

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function suggest(id) {
  const n = norm(id);
  return lex.terms
    .map((t) => ({ id: t.id, score: norm(t.id).includes(n) || n.includes(norm(t.id)) ? 0 : distance(n, norm(t.id)) }))
    .sort((x, y) => x.score - y.score)
    .slice(0, 3)
    .filter((x) => x.score <= 4)
    .map((x) => x.id);
}

function loadVideo(name) {
  const dir = path.join(ROOT, "src", "videos", name);
  if (!fs.existsSync(dir)) {
    log.err(`src/videos/${name} not found.`);
    process.exit(1);
  }
  return dir;
}

function sceneFrames(dir) {
  const f = path.join(dir, "timing.ts");
  if (!fs.existsSync(f)) return null;
  const src = fs.readFileSync(f, "utf8");
  const start = src.match(/export const START[^=]*=\s*\{([^}]*)\}/);
  const total = src.match(/export const TOTAL\s*=\s*(\d+)/);
  if (!start || !total) return null;
  const starts = {};
  for (const m of start[1].matchAll(/(\d+)\s*:\s*(\d+)/g)) starts[Number(m[1])] = Number(m[2]);
  const ids = Object.keys(starts).map(Number).sort((a, b) => a - b);
  const out = {};
  ids.forEach((id, i) => (out[id] = (i + 1 < ids.length ? starts[ids[i + 1]] : Number(total[1])) - starts[id]));
  return out;
}

if (cmd === "lint-all") {
  const root = path.join(ROOT, "src", "videos");
  let failed = 0;
  for (const v of fs.readdirSync(root)) {
    if (!fs.existsSync(path.join(root, v, "motion-brief.json"))) continue;
    console.log(`motion lint: ${v}`);
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "lint", v], { stdio: "inherit" });
    if (r.status !== 0) failed++;
  }
  process.exit(failed ? 1 : 0);
} else if (cmd === "lookup") {
  const q = args._.join(" ");
  if (!q) {
    log.err("Usage: npm run motion -- lookup <word>");
    process.exit(1);
  }
  const hits = lookup(q);
  if (!hits.length) console.log(`No term matches "${q}". Try: npm run motion -- list`);
  hits.slice(0, 12).forEach((t) => console.log(fmt(t) + "\n"));
} else if (cmd === "list") {
  const fam = args._[0];
  if (!fam) for (const [k, v] of Object.entries(lex.meta.families)) console.log(`${k.padEnd(11)} ${v}  (${lex.terms.filter((t) => t.family === k).length})`);
  else lex.terms.filter((t) => t.family === fam).forEach((t) => console.log(`${t.id.padEnd(22)} ${t.en} / ${t.ar}`));
} else if (cmd === "brief") {
  const name = args._[0];
  if (!name) {
    log.err("Usage: npm run motion -- brief <video>");
    process.exit(1);
  }
  const dir = loadVideo(name);
  const out = path.join(dir, "motion-brief.json");
  if (fs.existsSync(out) && !args.force) {
    log.err("motion-brief.json already exists (use --force to overwrite).");
    process.exit(1);
  }
  const scriptFile = path.join(dir, "script.json");
  const sections = fs.existsSync(scriptFile) ? JSON.parse(fs.readFileSync(scriptFile, "utf8")).sections : [{ id: 1, units: [] }];
  const brief = {
    $comment: "Fill every scene using term ids from motion/lexicon.json (npm run motion -- lookup <word>). Then run: npm run motion -- lint " + name,
    language: "ar",
    ratio: "9:16",
    signatureTransition: "shape-transition",
    scenes: sections.map((s, i) => ({
      scene: s.id,
      name: "",
      voice: s.units.join("، "),
      hero: "",
      support: [],
      emphasis: [],
      camera: null,
      transitionOut: i === sections.length - 1 ? null : "shape-transition",
      ease: "expo-out",
      enterFrames: 14,
      notes: "",
    })),
  };
  fs.writeFileSync(out, JSON.stringify(brief, null, 2) + "\n");
  log.ok(`Created src/videos/${name}/motion-brief.json with ${brief.scenes.length} scenes. Fill hero/support/emphasis/camera/transitionOut, then lint.`);
} else if (cmd === "lint") {
  const name = args._[0];
  if (!name) {
    log.err("Usage: npm run motion -- lint <video>");
    process.exit(1);
  }
  const dir = loadVideo(name);
  const file = path.join(dir, "motion-brief.json");
  if (!fs.existsSync(file)) {
    log.err(`No motion-brief.json for ${name}. Create it: npm run motion -- brief ${name}`);
    process.exit(1);
  }
  const brief = JSON.parse(fs.readFileSync(file, "utf8"));
  const frames = sceneFrames(dir);
  const errors = [];
  const warns = [];
  const check = (scene, field, id, families) => {
    if (id === null || id === undefined || id === "") return;
    const t = byId.get(id);
    if (!t) return errors.push(`scene ${scene}: ${field} "${id}" is not in the lexicon. Did you mean: ${suggest(id).join(", ") || "(run: npm run motion -- lookup <word>)"}`);
    if (!families.includes(t.family)) errors.push(`scene ${scene}: ${field} "${id}" is a ${t.family} term, expected ${families.join(" or ")}`);
    if (/غير مستخدم|لا يناسب|ممنوع|تجنّبه|لا نستخدمه/.test(t.what + t.rm)) warns.push(`scene ${scene}: ${field} "${id}" is flagged in the lexicon as not suited to GuestNa (${t.what})`);
  };
  const MOTION = ["principle", "text", "shape", "fx", "ease"];
  const ids = new Set();
  const transitions = [];
  for (const s of brief.scenes) {
    const n = s.scene;
    if (ids.has(n)) errors.push(`scene ${n} appears twice`);
    ids.add(n);
    if (!s.hero) errors.push(`scene ${n}: hero is empty (what is the main motion?)`);
    check(n, "hero", s.hero, MOTION);
    (s.support || []).forEach((x) => check(n, "support", x, MOTION));
    (s.emphasis || []).forEach((x) => check(n, "emphasis", x, MOTION));
    check(n, "camera", s.camera, ["camera"]);
    check(n, "transitionOut", s.transitionOut, ["transition"]);
    check(n, "ease", s.ease, ["ease"]);
    transitions.push(s.transitionOut);

    const layers = 1 + (s.support || []).length + (s.emphasis || []).length + (s.camera ? 1 : 0);
    if (layers > lex.rules.maxLayersPerScene) warns.push(`scene ${n}: ${layers} motion layers (max ${lex.rules.maxLayersPerScene}). Too much at once reads as chaos (see fix-chaos).`);

    const [lo, hi] = lex.rules.enterFrames;
    if (s.enterFrames < lo || s.enterFrames > hi) warns.push(`scene ${n}: enterFrames ${s.enterFrames} is outside ${lo}-${hi} frames (${Math.round((lo / FPS) * 1000)}-${Math.round((hi / FPS) * 1000)}ms)`);
    if (frames && frames[n] !== undefined && frames[n] < s.enterFrames + lex.rules.minHoldFrames)
      errors.push(`scene ${n}: lasts ${frames[n]} frames, not enough for enter (${s.enterFrames}) + hold (${lex.rules.minHoldFrames})`);
    if (s.exitFrames && s.exitFrames > s.enterFrames * lex.rules.exitVsEnter) warns.push(`scene ${n}: exit (${s.exitFrames}f) should be about a quarter faster than enter (${s.enterFrames}f)`);

    const all = [s.hero, ...(s.support || []), ...(s.emphasis || [])];
    if (brief.language === "ar" && all.some((x) => ["letter-stagger", "typewriter", "text-scramble"].includes(x)))
      errors.push(`scene ${n}: letter-level text effects break Arabic letter joining. Use word-stagger or text-mask-reveal.`);
    if (s.camera && s.camera !== "static" && all.includes("parallax") === false && ["pan", "truck", "dolly", "pedestal"].includes(s.camera))
      warns.push(`scene ${n}: camera "${s.camera}" gives real depth only with layers moving at different speeds. Add parallax or switch to zoom.`);
  }
  if (frames) for (const k of Object.keys(frames)) if (!ids.has(Number(k))) errors.push(`scene ${k} exists in timing.ts but not in the brief`);
  const used = transitions.filter(Boolean);
  if (used.length > 3 && new Set(used).size === 1 && brief.signatureTransition !== used[0])
    warns.push(`all transitions are "${used[0]}". If that is the deliberate brand signature, set "signatureTransition": "${used[0]}" in the brief.`);
  if (brief.ratio !== "9:16") warns.push(`ratio is ${brief.ratio}. Reels are 9:16 by default.`);

  for (const w of warns) console.log(`⚠️  ${w}`);
  for (const e of errors) console.log(`❌ ${e}`);
  if (errors.length) {
    console.log(`\n${errors.length} error(s), ${warns.length} warning(s).`);
    process.exit(1);
  }
  log.ok(`Motion brief OK: ${brief.scenes.length} scenes, ${warns.length} warning(s).`);
} else if (cmd === "prompt") {
  const get = (id, families) => {
    if (!id) return null;
    const t = byId.get(id);
    if (!t || !families.includes(t.family)) {
      log.err(`"${id}" is not a ${families.join("/")} term. Try: npm run motion -- list ${families[0]}`);
      process.exit(1);
    }
    return t.pr;
  };
  if (!args.subject) {
    log.err('Usage: npm run motion -- prompt --subject "what moves" [--shot ms] [--camera dolly] [--light golden-hour] [--lens shallow-dof] [--time real-time] [--mode i2v|t2v] [--people]');
    process.exit(1);
  }
  const mode = args.mode || "i2v";
  const cam = args.camera || "static";
  const parts = [
    mode === "t2v" ? get(args.shot, ["shot"]) : null,
    String(args.subject),
    get(cam, ["camera"]),
    get(args.light, ["light"]),
    get(args.lens, ["lens"]),
    get(args.time || "real-time", ["time"]),
    mode === "i2v" ? "Only the subject moves; the background stays still." : null,
    "Vertical 9:16 composition, safe space at the top and bottom for captions.",
    args.people ? "Saudi Arabian people with Gulf appearance." : null,
  ]
    .filter(Boolean)
    .map((x) => (/[.!?]$/.test(x) ? x : x + "."));
  console.log(`Prompt (${mode.toUpperCase()}):\n${parts.join(" ")}\n`);
  console.log(`Negative prompt:\n${byId.get("negative-prompt").pr}\n`);
  console.log("Settings: aspect 9:16, one 5 to 8 second shot (one action), motion strength medium, keep the seed once you like a result.");
  if (mode === "i2v") console.log("Image-to-video: do not describe what is already in the image. Generate the first frame with images_generate first (cheaper and controllable).");
} else if (cmd === "docs") {
  const lines = [
    "# مفردات الحركة (مولَّد من `motion/lexicon.json`، لا تعدّله يدوياً)",
    "",
    "> المصطلحات مبنية على [قاموس التحريك](https://motioname.com). الصياغة والربط بعدّتنا خاص بنا. للبحث السريع: `npm run motion -- lookup <كلمة>`.",
    "",
    "## مدد الحركة المقترحة (30fps)",
    "| النوع | ms | فريم |",
    "|---|---|---|",
    ...lex.durations.map((d) => `| ${d.ar} | ${d.ms[0]} إلى ${d.ms[1]} | ${Math.round((d.ms[0] * FPS) / 1000)} إلى ${Math.round((d.ms[1] * FPS) / 1000)} |`),
    "",
    `قاعدة الريلز: ${lex.rules.reel}`,
    "",
  ];
  for (const [fam, title] of Object.entries(lex.meta.families)) {
    const rows = lex.terms.filter((t) => t.family === fam);
    lines.push(`## ${title}`, "", "| id | المصطلح | المعنى | عندنا في Remotion | برومبت |", "|---|---|---|---|---|");
    for (const t of rows) lines.push(`| \`${t.id}\` | ${t.en}<br>${t.ar} | ${t.what} | ${t.rm || ""} | ${t.pr ? "`" + t.pr.replace(/\|/g, "/") + "`" : ""} |`);
    lines.push("");
  }
  const out = path.join(ROOT, ".claude", "skills", "guestna-video", "references", "motion-vocabulary.md");
  fs.writeFileSync(out, lines.join("\n"));
  log.ok(`Wrote ${path.relative(ROOT, out)} (${lex.terms.length} terms).`);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 9).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
}
