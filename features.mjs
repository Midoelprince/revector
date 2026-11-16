// The "Full Featured" pegboard on the home page. Strings are keys in src/js/i18n.js.
const pin = (color, x, rot) => `<span class="pin" style="--pin:${color};--pin-x:${x};--pin-rot:${rot}" aria-hidden="true"><svg viewBox="0 0 58 58" fill="none"><circle cx="29" cy="20" r="12" fill="currentColor"/><circle cx="24" cy="15" r="3.5" fill="#fff" fill-opacity=".55"/><path d="M29 32v22" stroke="#12182b" stroke-width="2.4" stroke-linecap="round"/></svg></span>`;

const art = {
  engine: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><path d="M20 60C40 10 70 10 90 40s40 30 40-10" stroke="#0b7894"/><circle cx="20" cy="60" r="4" fill="#fff"/><circle cx="90" cy="40" r="4" fill="#fff"/><circle cx="130" cy="30" r="4" fill="#fff"/><path d="M20 60l18-30M90 40l20-26" stroke-dasharray="3 3"/></svg>`,
  shapes: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><circle cx="30" cy="40" r="22"/><rect x="62" y="18" width="44" height="44" rx="10"/><path d="M118 20l12 38M118 58l12-38" stroke="#0b7894"/></svg>`,
  corners: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><path d="M14 62L50 14l36 48Z"/><path d="M96 62c0-30 20-48 30-48" stroke="#0b7894"/><circle cx="50" cy="14" r="4" fill="#e4572e" stroke="none"/></svg>`,
  speed: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><path d="M20 40h50M30 28h40M30 52h40" stroke="#0b7894" stroke-linecap="round"/><path d="M78 20l40 20-40 20z" fill="#fff"/></svg>`,
  recon: `<svg viewBox="0 0 140 77" fill="none"><g fill="#c9d1dc"><rect x="18" y="18" width="10" height="10"/><rect x="28" y="28" width="10" height="10"/><rect x="38" y="38" width="10" height="10"/><rect x="48" y="48" width="10" height="10"/></g><path d="M78 20c30 0 30 40 48 40" stroke="#0b7894" stroke-width="2.4"/><path d="M62 40h10" stroke="#12182b" stroke-width="2" stroke-dasharray="3 3"/></svg>`,
  symmetry: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><path d="M70 10v57" stroke-dasharray="4 4"/><path d="M60 50c-20-6-26-26-10-36" stroke="#0b7894"/><path d="M80 50c20-6 26-26 10-36" stroke="#0b7894"/></svg>`,
  palette: `<svg viewBox="0 0 140 77" fill="none"><rect x="20" y="22" width="24" height="32" rx="6" fill="#e4572e"/><rect x="48" y="22" width="24" height="32" rx="6" fill="#f0b429"/><rect x="76" y="22" width="24" height="32" rx="6" fill="#2f9e6a"/><rect x="104" y="22" width="24" height="32" rx="6" fill="#12182b"/></svg>`,
  export: `<svg viewBox="0 0 140 77" fill="none" stroke="#12182b" stroke-width="2"><path d="M40 14h40l20 20v30H40z" fill="#fff"/><path d="M80 14v20h20"/><path d="M52 50h36M52 42h20" stroke="#0b7894"/></svg>`
};

const tools = [
  { art: "engine", pin: ["var(--pin-red)", "44%", "-28deg"], title: "Deep vector engine", lead: "More detail", more: "Edges are fitted with least-squares cubic Bézier curves and straight lines, through edge midpoints rather than pixel corners, so stair steps never reach the output." },
  { art: "recon", pin: ["#0b7894", "52%", "22deg"], title: "Local edge reconstruction", lead: "Small pictures, rebuilt at 4x", more: "Pictures under 800 px are denoised, snapped with an Otsu threshold and interpolated through signed distance fields at four times their size before tracing. It runs on your computer with no model download and nothing to configure." },
  { art: "shapes", pin: ["#f0b429", "40%", "-18deg"], title: "Vector graph", lead: "Full shape fitting", more: "Neighbouring regions share one traced border, so shapes meet exactly with no hairline gaps or overlaps between colours." },
  { art: "corners", pin: ["var(--pin-red)", "56%", "30deg"], title: "Corner control", lead: "Clean corners", more: "Corners and sharp tips are detected on the outline and kept exactly; the runs between them become smooth curves. A slider sets how eagerly corners are kept." },
  { art: "speed", pin: ["#2f9e6a", "46%", "-34deg"], title: "High performance", lead: "Nobody likes waiting.", more: "Tracing runs in a background worker, the colour analysis is reused when only settings change, and small pictures trace in well under a second." },
  { art: "symmetry", pin: ["#0b7894", "50%", "16deg"], title: "Symmetry modelling", lead: "Make left and right halves match", more: "Switch on symmetry to average the two halves of a logo before tracing, so both sides come out identical." },
  { art: "palette", pin: ["#f0b429", "42%", "-22deg"], title: "Palette control", lead: "Background removal", more: "Pick the number of colours or let it be chosen for you, recolour, merge or cut out any colour, and remove the background with one checkbox." },
  { art: "export", pin: ["var(--pin-red)", "54%", "26deg"], title: "Export choices", lead: "Full color & transparency", more: "Save SVG, PDF, EPS or DXF with fills only, ready for Illustrator, Inkscape, cutting software and CAD, or a cleaned-up PNG." }
];

export function renderFeatures() {
  return tools.map((t) => `      <li class="tool">
        ${pin(...t.pin)}
        <div class="art">${art[t.art]}</div>
        <h3>${t.title}</h3>
        <p class="tool-lead">${t.lead}</p>
        <details><summary>More</summary><p>${t.more}</p></details>
      </li>`).join("\n");
}
