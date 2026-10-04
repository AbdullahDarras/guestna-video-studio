#!/usr/bin/env node
// Gets the shared assets (private repo guestna-video-assets) and links them into public/media.
//   npm run assets:link                       clone the assets repo next to this one (first time) and link it
//   npm run assets:update                     git pull the assets repo
//   npm run assets:link -- --from <folder>    use any local folder instead (Drive, Canva export...)
//   npm run assets:link -- --from <folder> --copy   copy instead of linking
// The default repo and folder are set in assets.config.json. You can also set GUESTNA_ASSETS (env or .env).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { log, parseArgs, readEnvFile, ROOT } from "./lib.mjs";

const args = parseArgs();
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "assets.config.json"), "utf8"));
const explicit = args.from || process.env.GUESTNA_ASSETS || readEnvFile().GUESTNA_ASSETS;
const source = path.resolve(ROOT, String(explicit || config.assetsDir));

const git = (gitArgs, cwd) => spawnSync("git", gitArgs, { cwd, stdio: "inherit", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });

if (!explicit) {
  if (!fs.existsSync(source)) {
    log.info(`Cloning ${config.assetsRepo} into ${source} ...`);
    const r = git(["clone", config.assetsRepo, source], ROOT);
    if (r.status !== 0) {
      log.err(
        "Could not clone the assets repo. Ask the repo owner for access (private repo) and make sure you are logged in to GitHub, " +
          "or use a local folder: npm run assets:link -- --from <folder>",
      );
      process.exit(1);
    }
  } else if (args.pull) {
    log.info("Updating the assets repo (git pull)...");
    const r = git(["pull", "--ff-only"], source);
    if (r.status !== 0) {
      log.err("git pull failed in the assets folder.");
      process.exit(1);
    }
  }
}

if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
  log.err(`Assets folder not found: ${source}`);
  process.exit(1);
}

const target = path.join(ROOT, "public", "media");
fs.mkdirSync(path.dirname(target), { recursive: true });
const existing = fs.lstatSync(target, { throwIfNoEntry: false });
if (existing) {
  if (existing.isSymbolicLink()) fs.unlinkSync(target);
  else {
    log.err(`public/media already exists and is a real folder. Move or delete it first: ${target}`);
    process.exit(1);
  }
}

if (args.copy) {
  fs.cpSync(source, target, { recursive: true });
  log.ok(`Copied assets into public/media (${source})`);
} else {
  // 'junction' needs no admin rights on Windows and is ignored on macOS/Linux.
  fs.symlinkSync(source, target, "junction");
  log.ok(`Linked public/media -> ${source}`);
}
log.info("Next: npm run assets:check");
