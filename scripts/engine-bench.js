// Engine quality benchmark. Not part of the app.
// How to run: npm run build, copy this file to dist/assets/_bench.js, serve dist/ (node scripts/serve.mjs),
// open http://127.0.0.1:4173, then in the browser console:
//   await import('/assets/_bench.js'); (await __bench({ scale: 7, K: 2 })).total   // pictures over 800 px
//   (await __bench({ scale: 3, K: 4 })).total                                      // small pictures (4x rebuild path)
// err = mean colour error per pixel against the true artwork drawn at K times the size; bad = clearly
// wrong pixels per 10,000; nodes = curve segments. Lower is better for all three.

// Engine quality benchmark (runs in the page). For every example picture:
// trace a render at `scale`, draw the traced SVG at scale*K, and compare it with the
// example drawn directly at scale*K (the true geometry). Lower error is better.
window.__bench = async function (opts) {
  opts = Object.assign({ scale: 7, K: 2, only: null, trace: {} }, opts || {});
  const R = window.Revector, EX = window.RevectorExamples;
  const rows = [];
  let totErr = 0, totBad = 0, totNodes = 0, totMs = 0;
  for (const ex of EX.list) {
    if (opts.only && !opts.only.includes(ex.name)) continue;
    const src = EX.render(ex, opts.scale);
    const img = src.getContext("2d").getImageData(0, 0, src.width, src.height);
    const t0 = performance.now();
    const res = R.trace(img, Object.assign({ colors: 0, detail: 2, corners: 2, layering: "cutouts" }, opts.trace));
    const ms = performance.now() - t0;
    const W = src.width * opts.K, H = src.height * opts.K;
    const truth = document.createElement("canvas"); truth.width = W; truth.height = H;
    const tc = truth.getContext("2d"); tc.scale(opts.scale * opts.K, opts.scale * opts.K); ex.draw(tc, ex.w, ex.h);
    const svg = R.toSVG(res, { width: src.width, height: src.height, hidden: new Set(), colors: res.layers.map((l) => l.color), transparent: new Set() });
    const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); await im.decode();
    const out = document.createElement("canvas"); out.width = W; out.height = H;
    out.getContext("2d").drawImage(im, 0, 0, W, H);
    const a = tc.getImageData(0, 0, W, H).data, b = out.getContext("2d").getImageData(0, 0, W, H).data;
    let err = 0, bad = 0;
    for (let i = 0; i < a.length; i += 4) {
      const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
      err += d; if (d > 90) bad++;
    }
    const px = W * H;
    // error per pixel scaled to "per 1000 pixels", bad = share of clearly wrong pixels (per 10k)
    const row = { name: ex.name, err: +(err / px).toFixed(3), bad: +(bad / px * 1e4).toFixed(1), nodes: res.stats.nodes, ms: Math.round(ms) };
    rows.push(row); totErr += row.err; totBad += row.bad; totNodes += row.nodes; totMs += ms;
  }
  return { total: { err: +totErr.toFixed(2), bad: +totBad.toFixed(1), nodes: totNodes, ms: Math.round(totMs) }, rows };
};
