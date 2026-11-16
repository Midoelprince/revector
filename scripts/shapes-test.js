// Shape recognition test. Not part of the app.
// How to run: npm run build, copy this file to dist/assets/_shapes.js, serve dist/ (node scripts/serve.mjs),
// open http://127.0.0.1:4173, then in the browser console:
//   await import('/assets/_shapes.js'); __shapeTest(Revector, 900)   // large
//   __shapeTest(Revector, 220)                                        // small (4x rebuild path)

// Shape recognition test: each shape alone on white, rotated or mirrored. Reports the segments
// the tracer produced: "3l 0c" = three straight lines, no curves.
window.__shapeTest = function (R, S) {
  const out = {};
  const reg = (n, r, rot) => { const p = []; for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; };
  const star = (n, R0, r0, rot, mir) => { const p = []; for (let i = 0; i < 2 * n; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? r0 : R0; p.push([Math.cos(a) * rr * (mir ? -1 : 1), Math.sin(a) * rr]); } return p; };
  const rot = (pts, t) => pts.map(([x, y]) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]);
  const polys = {
    "triangle eq rot13": [reg(3, 0.4, 0.23), "3l"],
    "triangle upside": [reg(3, 0.4, Math.PI / 2), "3l"],
    "triangle scalene": [[[-0.4, 0.3], [0.42, 0.25], [-0.1, -0.38]], "3l"],
    "square rot30": [reg(4, 0.4, 0.52 + Math.PI / 4), "4l"],
    "rect rot22": [rot([[-0.42, -0.2], [0.42, -0.2], [0.42, 0.2], [-0.42, 0.2]], 0.38), "4l"],
    "pentagon": [reg(5, 0.4, 0.1), "5l"],
    "hexagon": [reg(6, 0.4, 0.3), "6l"],
    "star3": [star(3, 0.42, 0.12, 0.4), "6l"],
    "star4": [star(4, 0.42, 0.16, 0.3), "8l"],
    "star5": [star(5, 0.42, 0.17, -Math.PI / 2), "10l"],
    "star5 mirror rot": [star(5, 0.42, 0.2, 0.7, true), "10l"],
    "star6": [star(6, 0.42, 0.24, 0.2), "12l"],
    "star8": [star(8, 0.43, 0.28, 0.1), "16l"],
    "star10": [star(10, 0.44, 0.3, 0.05), "20l"]
  };
  const draws = {
    "circle": [(c) => { c.beginPath(); c.arc(0, 0, 0.38 * S, 0, 7); c.fill(); }, "0l 4c"],
    "ellipse rot40": [(c) => { c.beginPath(); c.ellipse(0, 0, 0.4 * S, 0.22 * S, 0.7, 0, 7); c.fill(); }, "0l 4c"],
    "rounded rect": [(c) => { c.beginPath(); c.roundRect(-0.4 * S, -0.22 * S, 0.8 * S, 0.44 * S, 0.08 * S); c.fill(); }, "4l 4c"],
    "rounded rect rot35": [(c) => { c.rotate(0.6); c.beginPath(); c.roundRect(-0.4 * S, -0.22 * S, 0.8 * S, 0.44 * S, 0.08 * S); c.fill(); }, "4l 4c"],
    "rounded square rot20": [(c) => { c.rotate(0.35); c.beginPath(); c.roundRect(-0.3 * S, -0.3 * S, 0.6 * S, 0.6 * S, 0.1 * S); c.fill(); }, "4l 4c"],
    "blob": [(c) => { c.beginPath(); c.moveTo(-0.3 * S, 0); c.bezierCurveTo(-0.3 * S, -0.4 * S, 0.1 * S, -0.2 * S, 0.3 * S, -0.3 * S); c.bezierCurveTo(0.45 * S, 0, 0.2 * S, 0.4 * S, 0, 0.3 * S); c.bezierCurveTo(-0.2 * S, 0.25 * S, -0.3 * S, 0.2 * S, -0.3 * S, 0); c.fill(); }, "free"],
    "heart": [(c) => { c.beginPath(); c.moveTo(0, 0.3 * S); c.bezierCurveTo(-0.5 * S, -0.05 * S, -0.25 * S, -0.4 * S, 0, -0.15 * S); c.bezierCurveTo(0.25 * S, -0.4 * S, 0.5 * S, -0.05 * S, 0, 0.3 * S); c.fill(); }, "free"]
  };
  const run = (name, fn, want) => {
    const c = document.createElement("canvas"); c.width = S; c.height = S;
    const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, S, S); x.translate(S / 2 + 0.3, S / 2 + 0.2); x.fillStyle = "#1d3557"; fn(x);
    const res = R.trace(x.getImageData(0, 0, S, S), { colors: 2 });
    const L = res.layers.find((l) => l.color !== "#ffffff");
    if (!L) { out[name] = "none"; return; }
    const cs = L.shapes[0].contours[0], nl = cs.segs.filter((g) => g.l).length;
    out[name] = `${nl}l ${cs.segs.length - nl}c (want ${want})`;
  };
  for (const [k, [pts, want]] of Object.entries(polys)) run(k, (x) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a * S, b * S) : x.moveTo(a * S, b * S)); x.closePath(); x.fill(); }, want);
  for (const [k, [fn, want]] of Object.entries(draws)) run(k, fn, want);
  return out;
};
