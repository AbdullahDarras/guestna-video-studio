#!/usr/bin/env node
// One-time setup on a new machine. Safe to run again.  npm run setup
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { log, remotion, ROOT } from "./lib.mjs";

const major = Number(process.versions.node.split(".")[0]);
if (major < 20) {
  log.err(`Node ${process.versions.node} is too old. Install Node 20 or newer (see README), then run this again.`);
  process.exit(1);
}
log.ok(`Node ${process.versions.node}`);

if (!fs.existsSync(path.join(ROOT, "node_modules", "remotion"))) {
  log.info("Installing packages (npm install)...");
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const r = spawnSync(npm, ["install"], { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    log.err("npm install failed.");
    process.exit(1);
  }
}
log.ok("Packages installed");

let r = remotion(["ffmpeg", "-version"]);
if (r.status === 0 && /ffmpeg version/i.test(r.stdout + r.stderr)) log.ok("ffmpeg (bundled with Remotion) works");
else log.warn("Could not run Remotion's ffmpeg. Voice processing will not work.");

log.info("Making sure the render browser is available (downloads once, about 100 MB)...");
r = remotion(["browser", "ensure"], { stdio: "inherit" });
if (r.status === 0) log.ok("Render browser ready");
else log.warn("Browser download failed. The first render will try again.");

const assets = path.join(ROOT, "public", "media");
if (fs.existsSync(assets)) log.ok("Assets folder linked (public/media)");
else {
  log.info("Getting the shared assets (guestna-video-assets)...");
  const r2 = spawnSync(process.execPath, [path.join(ROOT, "scripts", "link-assets.mjs")], { cwd: ROOT, stdio: "inherit" });
  if (r2.status !== 0) log.warn("Assets not linked yet. You can still render the demo. Ask for access, then run: npm run assets:link");
}

console.log("\nReady. Try:\n  npm run dev            # Remotion Studio (preview)\n  npm run render:demo    # renders a 5 second brand test video to out/brand-demo.mp4\n");
