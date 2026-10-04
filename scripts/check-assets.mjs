#!/usr/bin/env node
// Checks that the media files every video needs exist in public/media.
// Usage: npm run assets:check [-- <video-folder-name>] [--strict]
import fs from "node:fs";
import path from "node:path";
import { log, parseArgs, ROOT } from "./lib.mjs";

const args = parseArgs();
const videosDir = path.join(ROOT, "src", "videos");
const only = args._[0];
const media = path.join(ROOT, "public", "media");

if (!fs.existsSync(media)) {
  log.warn("public/media is missing. Run `npm run assets:link -- --from <assets-folder>` first.");
}

let missingTotal = 0;
for (const name of fs.readdirSync(videosDir)) {
  const manifest = path.join(videosDir, name, "assets.json");
  if (!fs.existsSync(manifest) || (only && only !== name)) continue;
  const { files = [] } = JSON.parse(fs.readFileSync(manifest, "utf8"));
  const missing = files.filter((f) => !fs.existsSync(path.join(media, f.path)));
  console.log(`\n${name}: ${files.length - missing.length}/${files.length} files present`);
  for (const f of missing) console.log(`  missing  media/${f.path}  →  ${f.what}${f.source ? `  [${f.source}]` : ""}`);
  missingTotal += missing.length;
}
if (missingTotal === 0) log.ok("All declared media files are present.");
else {
  log.warn(`${missingTotal} file(s) missing. Get them from the shared assets folder (or regenerate them, see the manifests).`);
  if (args.strict) process.exit(1);
}
