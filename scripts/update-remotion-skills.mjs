#!/usr/bin/env node
// Copies the official Remotion Agent Skills (MIT, remotion-dev/claude-code-plugin) into .claude/skills,
// so every teammate gets them just by opening this repo. No plugin install needed.
//   npm run skills:remotion            -> the pinned version (matches the Remotion version in package.json)
//   npm run skills:remotion -- --latest -> newest version (then also run `npm run upgrade`)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { log, parseArgs, ROOT } from "./lib.mjs";

const REPO = "https://github.com/remotion-dev/claude-code-plugin.git";
const PINNED = "35c89112731eac6a74ed5e2266e769e8493bff31"; // plugin 4.0.530
const ref = parseArgs().latest ? "HEAD" : PINNED;

const run = (args, cwd) => {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed:\n${r.stderr || r.stdout}`);
  return r.stdout;
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "remotion-skills-"));
try {
  log.info(`Fetching Remotion skills (${ref === "HEAD" ? "latest" : ref.slice(0, 7)})...`);
  run(["init", "-q"], tmp);
  run(["remote", "add", "origin", REPO], tmp);
  run(["fetch", "-q", "--depth", "1", "origin", ref], tmp);
  run(["checkout", "-q", "FETCH_HEAD"], tmp);

  const src = path.join(tmp, "skills");
  const dest = path.join(ROOT, ".claude", "skills");
  fs.mkdirSync(dest, { recursive: true });
  const names = fs.readdirSync(src).filter((n) => fs.statSync(path.join(src, n)).isDirectory());
  for (const n of names) {
    fs.rmSync(path.join(dest, n), { recursive: true, force: true });
    fs.cpSync(path.join(src, n), path.join(dest, n), { recursive: true });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(tmp, ".claude-plugin", "plugin.json"), "utf8"));
  const sha = run(["rev-parse", "HEAD"], tmp).trim();
  fs.writeFileSync(
    path.join(dest, "REMOTION-SKILLS.md"),
    `# Remotion Agent Skills (vendored)\n\nSource: ${REPO}\nVersion: ${manifest.version}\nCommit: ${sha}\nLicense: ${manifest.license} (Remotion)\n\nCopied by \`npm run skills:remotion\`. Do not edit these folders by hand: update them with that command.\nThe GuestNa-specific skill is \`guestna-video\` (not part of this set).\n`,
  );
  log.ok(`Installed ${names.length} Remotion skills (version ${manifest.version}) into .claude/skills`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
