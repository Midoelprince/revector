// Assembles the static site into dist/: shared layout + page bodies + assets.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
let renderFeatures = () => "";
try { ({ renderFeatures } = await import("./features.mjs")); } catch (e) { console.warn("features.mjs failed:", e.message); }

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, "src");
const dist = path.join(root, "dist");

// Clear the old site, but keep dist/desktop (the Windows installers from `npm run dist`).
fs.mkdirSync(dist, { recursive: true });
// One-time move: older builds kept the Windows installers in dist/desktop.
// They now live in release/, so dist/ holds only the website.
const oldDesktop = path.join(dist, "desktop");
const release = path.join(root, "release");
try {
  if (fs.existsSync(oldDesktop)) {
    if (fs.existsSync(release)) fs.rmSync(oldDesktop, { recursive: true, force: true });
    else fs.renameSync(oldDesktop, release);
  }
} catch (e) { console.warn("Could not move dist/desktop:", e.message); }
// Keep existing pages (they are overwritten in place) so dist/index.html never disappears mid-build.
// Nothing in dist/ is deleted any more: every file is simply rewritten in place.

const BRAND = "Revector";

// ---------- shared pieces ----------
const logo = `<svg viewBox="0 0 34 34" aria-hidden="true" focusable="false"><path d="M21.5 6.5 24 2" stroke="#12182b" stroke-width="2" stroke-linecap="round"/><circle cx="24.6" cy="2.6" r="2.2" fill="#e4572e"/><rect x="2.5" y="7.5" width="29" height="23" rx="8" fill="#fff" stroke="#12182b" stroke-width="2.6"/><circle cx="12.5" cy="19" r="5.2" fill="none" stroke="#12182b" stroke-width="2.6"/><circle cx="23.5" cy="19" r="2.1" fill="#12182b"/></svg>`;

const langIcon = `<svg viewBox="0 0 26 23" aria-hidden="true" focusable="false"><path d="M5 1.5h16a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9l-5 3.5v-3.5H5a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4Z" fill="currentColor"/><g fill="none" stroke="#fff" stroke-width="1.2"><circle cx="13" cy="10" r="5.6"/><path d="M7.4 10h11.2M13 4.4c-2.6 3-2.6 8.2 0 11.2M13 4.4c2.6 3 2.6 8.2 0 11.2"/></g></svg>`;

const languages = [["EN", "English"], ["AR", "العربية"]];

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function pixelBackdrop() {
  const rnd = seeded(7);
  const groups = { "0.035": [], "0.06": [], "0.09": [], "0.13": [] };
  for (let y = 2; y < 960; y += 24) {
    for (let x = 2; x < 336; x += 24) {
      const fall = 1 - x / 336; // denser on the left
      const vfall = y < 860 ? 1 : 0.4;
      const r = rnd();
      if (r > fall * 0.95 * vfall) continue;
      const k = rnd();
      const key = k < 0.45 ? "0.035" : k < 0.72 ? "0.06" : k < 0.9 ? "0.09" : "0.13";
      groups[key].push(`M${x} ${y}h21v21h-21z`);
    }
  }
  const streaks = "M2 801h44v5h-44zM2 633h44v5h-44zM2 681h44v5h-44zM2 705h20v5h-20zM2 753h44v5h-44z";
  return `<svg width="336" height="960" viewBox="0 0 336 960" aria-hidden="true" focusable="false">${Object.entries(groups)
    .map(([o, d]) => `<path fill="currentColor" fill-opacity="${o}" d="${d.join("")}"/>`).join("")}<path fill="currentColor" fill-opacity=".3" d="${streaks}"/></svg>`;
}

function curveBackdrop() {
  const rings = [];
  for (let i = 0; i < 7; i++) {
    const rx = 60 + i * 34, ry = 50 + i * 30;
    rings.push(`<ellipse cx="420" cy="330" rx="${rx}" ry="${ry}" fill="none" stroke="rgba(18,24,43,${(0.13 - i * 0.012).toFixed(3)})" stroke-width="1.2"/>`);
  }
  const lines = [
    "M760 -20 C 770 120, 640 160, 600 260 S 650 420, 760 470 S 900 560, 900 700",
    "M820 -20 C 830 140, 700 180, 660 280 S 710 440, 820 490 S 960 580, 960 720",
    "M560 0 C 600 60, 700 70, 760 40 S 860 0, 900 30",
    "M520 960 C 560 820, 700 760, 760 640 S 880 520, 960 520",
    "M600 140 L 900 20", "M620 170 L 960 60", "M640 600 C 700 560, 800 540, 960 560"
  ];
  return `<svg viewBox="0 0 960 960" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">${rings.join("")}${lines.map((d) => `<path d="${d}"/>`).join("")}<rect x="413" y="160" width="7" height="7"/><rect x="760" y="134" width="7" height="7"/><rect x="590" y="380" width="7" height="7"/><circle cx="840" cy="420" r="4" fill="#f6f7f4" stroke="rgba(18,24,43,.2)"/></svg>`;
}

function nav(active) {
  const link = (href, label, key) =>
    `<li><a class="nav-link" href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a></li>`;
  return `<nav class="nav" id="top" aria-label="Main">
  <div class="wrap">
    <div class="nav-bar">
      <a class="brand" href="/">${logo}<span>${BRAND}</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Menu"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="#12182b" stroke-width="1.6" stroke-linecap="round"/></svg></button>
      <div class="nav-menu" id="nav-menu">
        <ul class="nav-links">
          ${link("/#how-title", "How It Works", "how")}
          ${link("/#features-title", "Features", "features")}
          ${link("/#faq-title", "FAQ", "faq")}
        </ul>
        <div class="nav-account">
          <button type="button" class="nav-link lang-ar" data-lang-switch>العربية</button>
          <div class="lang">
            <button class="lang-toggle" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Language: English">${langIcon}</button>
            <div class="lang-menu" role="menu">
              ${languages.map(([c, n], i) => `<a role="menuitem" href="/setLocale?locale=${c.toLowerCase()}" data-locale="${c.toLowerCase()}"${i === 0 ? ' aria-current="true"' : ""}><span class="code">${c}</span><span>${n}</span></a>`).join("\n              ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`;
}

function footer() {
  return `<footer class="footer" id="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/">${logo}<span>${BRAND}</span></a>
        <p class="signature">For everyone who would rather not redraw a logo by hand.</p><hr class="signature-rule">
      </div>
      <div><h2>Product</h2><ul><li><a href="/#how-title">How It Works</a></li><li><a href="/#features-title">Features</a></li><li><a href="/#faq-title">FAQ</a></li></ul></div>
      <div><h2>Company</h2><ul><li><a href="https://github.com/Midoelprince/revector">Source code</a></li><li><a href="https://github.com/Midoelprince/revector/releases">Releases</a></li><li><a href="https://github.com/Midoelprince/revector/blob/main/LICENSE">License</a></li></ul></div>
      <div><h2>Converters</h2><ul><li><a href="/#convert" data-open-upload>Convert PNG to SVG</a></li><li><a href="/#convert" data-open-upload>Convert JPG to SVG</a></li></ul></div>
    </div>
    
<div class="footer-bottom">
      <span>© ${BRAND} Studio</span>
      <span class="mono">${BRAND}.app</span>
    </div>
  </div>
</footer>`;
}

function layout({ title, description, body, active, scripts = [] }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#f6f7f4">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/schibsted-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script src="/assets/js/i18n.js"></script>
</head>
<body class="paper">
<a href="#content" class="skip">Skip to content</a>
<div class="backdrop" aria-hidden="true">
  <div class="backdrop-pixels">${pixelBackdrop()}</div>
  <div class="backdrop-curves">${curveBackdrop()}</div>
</div>
<div class="site">
${nav(active)}
<main id="content">
${body}
</main>
${footer()}
</div>
<div class="page-end"></div>
<script src="/assets/js/site.js" defer></script>
<script src="/assets/js/desktop.js" defer></script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join("\n")}
</body>
</html>
`;
}

// ---------- pages ----------
function readPage(name) {
  const raw = fs.readFileSync(path.join(src, "pages", name), "utf8");
  let features = "";
  try { features = renderFeatures(); } catch (e) { console.warn(`Features not rendered: ${e.message}`); }
  return raw.replaceAll("{{FEATURES}}", features).replaceAll("{{BRAND}}", BRAND).replaceAll("{{LOGO}}", logo);
}

function write(rel, html) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

const pages = [
  { out: "index.html", src: "index.html", active: "home", title: `${BRAND} - Free offline image to vector converter`, description: "Revector redraws PNG, JPG, GIF, BMP and WebP pictures as editable SVG, PDF, EPS and DXF files, entirely on your own computer. Free, open source, no upload.", scripts: ["/assets/js/vectorize.js", "/assets/js/examples.js", "/assets/js/app.js"] }
];
// Pages removed in 1.1.0 are deleted from an existing dist/ so stale copies are not served.
for (const old of ["api", "pricing", "support"]) fs.rmSync(path.join(dist, old), { recursive: true, force: true });

for (const p of pages) {
  write(p.out, layout({ title: p.title, description: p.description, body: readPage(p.src), active: p.active, scripts: p.scripts }));
}

// The language switch endpoint: a bare error page when called without a locale,
// a redirect back home when called with one (handled by its inline script).
const badRequest = fs.readFileSync(path.join(src, "pages", "setlocale.html"), "utf8");
write("setLocale/index.html", badRequest);
write("setlocale/index.html", badRequest);

// ---------- assets ----------
function copyDir(from, to) {
  if (!fs.existsSync(from)) { console.warn(`Skipping missing folder: ${from}`); return; }
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    if (entry.name.endsWith(".part.js")) continue;
    if (entry.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}
copyDir(path.join(src, "css"), path.join(dist, "assets", "css"));
copyDir(path.join(src, "js"), path.join(dist, "assets", "js"));
copyDir(path.join(src, "img"), path.join(dist, "assets", "img"));
fs.mkdirSync(path.join(dist, "assets", "fonts"), { recursive: true });
for (const [from, to] of [
  ["node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2", "assets/fonts/schibsted-grotesk.woff2"],
  ["node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "assets/fonts/jetbrains-mono.woff2"],
]) {
  const fromPath = path.join(root, from);
  if (fs.existsSync(fromPath)) fs.copyFileSync(fromPath, path.join(dist, to));
  else console.warn(`Font not found (run npm install): ${from}`);
}
try {
  fs.writeFileSync(path.join(dist, "assets/favicon.svg"), logo.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
} catch (e) { console.warn(`Favicon not written: ${e.message}`); }

// Final safety net: dist/ must hold an index.html.
const fallbackHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${BRAND}</title></head><body><h1>${BRAND}</h1></body></html>`;
if (!fs.existsSync(path.join(dist, "index.html"))) {
  fs.writeFileSync(path.join(dist, "index.html"), fallbackHtml);
  console.warn("index.html was missing in dist/; wrote a minimal placeholder");
}

console.log("Built", pages.length + 1, "pages into dist/");
