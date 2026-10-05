#!/usr/bin/env node
// Scaffolds a new video from the brand demo.   npm run new:video -- my-video-name
import fs from "node:fs";
import path from "node:path";
import { log, parseArgs, ROOT } from "./lib.mjs";

const name = parseArgs()._[0];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  log.err("Usage: npm run new:video -- <kebab-case-name>   e.g. npm run new:video -- umrah-trips");
  process.exit(1);
}
const pascal = name.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("");
const dest = path.join(ROOT, "src", "videos", name);
if (fs.existsSync(dest)) {
  log.err(`src/videos/${name} already exists.`);
  process.exit(1);
}
fs.mkdirSync(dest, { recursive: true });

const src = path.join(ROOT, "src", "videos", "demo");
const component = `${pascal}Video`;
fs.writeFileSync(
  path.join(dest, `${component}.tsx`),
  fs.readFileSync(path.join(src, "BrandDemo.tsx"), "utf8").replaceAll("BrandDemo", component).replace("Brand smoke test", `${pascal} video (starter)`),
);
fs.writeFileSync(
  path.join(dest, "index.ts"),
  `import { ${component} } from "./${component}";
import type { VideoDef } from "../registry";

export const ${name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Def: VideoDef = {
  id: "${pascal}",
  component: ${component},
  durationInFrames: 150,
};
`,
);
fs.writeFileSync(path.join(dest, "assets.json"), JSON.stringify({ files: [] }, null, 2) + "\n");

const regFile = path.join(ROOT, "src", "videos", "registry.ts");
let reg = fs.readFileSync(regFile, "utf8");
const varName = `${name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Def`;
reg = reg.replace("// @videos-import", `// @videos-import\nimport { ${varName} } from "./${name}";`).replace("// @videos-list", `${varName},\n  // @videos-list`);
fs.writeFileSync(regFile, reg);

log.ok(`Created src/videos/${name} and registered it as "${pascal}".`);
console.log(`Next: write script.json, then npm run motion -- brief ${name} (motion brief), then build the scenes. Preview: npm run dev (open "${pascal}"). Put its media under public/media/${name}/ and list it in src/videos/${name}/assets.json.`);
