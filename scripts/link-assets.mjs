#!/usr/bin/env node
// Links the shared assets folder (Drive / Canva export / local folder) into public/media.
// Usage:  npm run assets:link -- --from "/path/to/guestna-video-assets" [--copy]
//   or set GUESTNA_ASSETS in your environment or in a local .env file.
import fs from "node:fs";
import path from "node:path";
import { log, parseArgs, readEnvFile, ROOT } from "./lib.mjs";

const args = parseArgs();
const from = args.from || process.env.GUESTNA_ASSETS || readEnvFile().GUESTNA_ASSETS;
if (!from || from === true) {
  log.err("No assets folder given. Use --from <folder> or set GUESTNA_ASSETS (see README).");
  process.exit(1);
}
const source = path.resolve(String(from));
if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
  log.err(`Assets folder not found: ${source}`);
  process.exit(1);
}

const target = path.join(ROOT, "public", "media");
fs.mkdirSync(path.dirname(target), { recursive: true });
if (fs.existsSync(target) || fs.lstatSync(target, { throwIfNoEntry: false })) {
  const st = fs.lstatSync(target);
  if (st.isSymbolicLink()) fs.unlinkSync(target);
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
