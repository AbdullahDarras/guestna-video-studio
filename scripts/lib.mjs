// Shared helpers for the studio scripts. Works on macOS, Linux and Windows (no shell, no npx).
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

/** Absolute path to the Remotion CLI entry point (also gives us a bundled ffmpeg). */
export function remotionCli() {
  try {
    const pkgFile = require.resolve("@remotion/cli/package.json", { paths: [ROOT] });
    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
    return path.join(path.dirname(pkgFile), pkg.bin.remotion);
  } catch {
    throw new Error("Remotion is not installed yet. Run `npm run setup` first.");
  }
}

/** Run `remotion <args>` with the current Node binary. */
export function remotion(args, opts = {}) {
  return spawnSync(process.execPath, [remotionCli(), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 512,
    ...opts,
  });
}

/** Run Remotion's bundled ffmpeg. */
export function ffmpeg(args) {
  return remotion(["ffmpeg", "-y", "-v", "error", ...args]);
}

/** Read a small .env file (KEY=value lines) if it exists. */
export function readEnvFile() {
  const file = path.join(ROOT, ".env");
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    } else args._.push(a);
  }
  return args;
}

export const log = {
  ok: (m) => console.log(`✅ ${m}`),
  warn: (m) => console.log(`⚠️  ${m}`),
  err: (m) => console.error(`❌ ${m}`),
  info: (m) => console.log(`• ${m}`),
};
