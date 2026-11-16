// Checks that `npm run build` produced a complete site in dist/. Exits with code 1 if anything is missing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const required = [
  "index.html",
  "setLocale/index.html",
  "assets/favicon.svg",
  "assets/css/site.css",
  "assets/js/i18n.js",
  "assets/js/site.js",
  "assets/js/desktop.js",
  "assets/js/vectorize.js",
  "assets/js/worker.js",
  "assets/js/examples.js",
  "assets/js/app.js",
  "assets/fonts/plex-sans-arabic-arabic-400.woff2",
  "assets/fonts/plex-sans-arabic-arabic-500.woff2",
  "assets/fonts/plex-sans-arabic-arabic-600.woff2",
  "assets/fonts/plex-sans-arabic-arabic-700.woff2",
  "assets/fonts/plex-sans-arabic-latin-400.woff2",
  "assets/fonts/plex-sans-arabic-latin-500.woff2",
  "assets/fonts/plex-sans-arabic-latin-600.woff2",
  "assets/fonts/plex-sans-arabic-latin-700.woff2",
  "assets/fonts/LICENSE-IBM-Plex-Sans-Arabic.txt",
  "assets/fonts/jetbrains-mono.woff2"
];

const problems = [];
for (const rel of required) {
  const file = path.join(dist, rel);
  if (!fs.existsSync(file)) problems.push(`missing: dist/${rel}`);
  else if (fs.statSync(file).size === 0) problems.push(`empty: dist/${rel}`);
}
const index = path.join(dist, "index.html");
if (fs.existsSync(index) && !fs.readFileSync(index, "utf8").includes('id="app"')) {
  problems.push("dist/index.html has no converter (#app); the build fell back to a placeholder page");
}

if (problems.length) {
  console.error("Build check failed:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`Build check passed: ${required.length} files in dist/.`);
