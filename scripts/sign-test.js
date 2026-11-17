// Scanned-sign test. Not part of the app.
// A shop-sign scene like a phone photo of a printed board: dark green buildings with pale square
// windows (filled, hollow with thin borders, and windows touching each other and the building
// edge), a year in red and Arabic text. It is drawn sharp at 3x, rotated slightly, then degraded
// the way a phone or scanner does: downsampled to ~500 px, Gaussian blur, uneven lighting, grain
// before and after, and a double JPEG round trip.
// How to run: npm run build, copy this file to dist/assets/_sign.js, serve dist/, then in the console:
//   await import('/assets/_sign.js'); await __signTest(Revector, { seed: 1 })
//   await __signSuite(Revector)      // 4 seeds x {straight, rotated}, averaged
// Metrics (lower is better unless noted):
//   wobble  : how much each window side wanders, px (std dev of the traced edge position
//             measured at 22 points along every side)
//   bias    : mean |offset| of the traced side from the true side, px
//   err/bad : colour error / clearly wrong pixels against the clean artwork at 2x
//   nodes   : curve segments
(function () {
  const S = 500;
  // windows in artwork units (0..1), each [x, y, w, h, hollow]
  const WINDOWS = [
    [0.10, 0.06, 0.075, 0.075, 0], [0.10, 0.18, 0.075, 0.075, 1], [0.10, 0.30, 0.075, 0.075, 0], [0.10, 0.42, 0.075, 0.075, 1],
    [0.37, 0.20, 0.045, 0.18, 0], [0.47, 0.20, 0.045, 0.18, 0], [0.57, 0.20, 0.045, 0.18, 0], [0.67, 0.20, 0.045, 0.18, 0],
    // a pair that touches (shared border) and one touching the building's right edge
    [0.84, 0.10, 0.06, 0.08, 0], [0.84, 0.18, 0.06, 0.08, 1], [0.93, 0.30, 0.07, 0.09, 0]
  ];
  const GREEN = "#1f5c37", PALE = "#f3f0c2", RED = "#9a1f2a";
  function drawArt(c, k, rot) {
    c.save();
    c.scale(k, k);
    c.translate(S / 2, S / 2); c.rotate(rot); c.translate(-S / 2, -S / 2);
    c.fillStyle = PALE; c.fillRect(-S, -S, 3 * S, 3 * S);
    c.fillStyle = GREEN; c.fillRect(0, 0, S, 0.56 * S);
    c.fillStyle = PALE; c.fillRect(0.3 * S, 0.14 * S, 0.5 * S, 0.3 * S);
    c.fillStyle = GREEN; c.fillRect(0.33 * S, 0.17 * S, 0.44 * S, 0.24 * S);
    const bw = 0.0045 * S; // hollow window border: ~2.2 px at 500 px
    for (const [x, y, w, h, hollow] of WINDOWS) {
      c.fillStyle = PALE; c.fillRect(x * S, y * S, w * S, h * S);
      if (hollow) { c.fillStyle = GREEN; c.fillRect(x * S + bw, y * S + bw, w * S - 2 * bw, h * S - 2 * bw); }
    }
    c.fillStyle = PALE; c.fillRect(0.3 * S, 0.46 * S, 0.5 * S, 0.1 * S);
    c.fillStyle = RED; c.textBaseline = "middle"; c.textAlign = "center";
    c.font = "bold " + 0.08 * S + "px Arial"; c.fillText("2004", 0.55 * S, 0.515 * S);
    c.font = "bold " + 0.13 * S + "px Arial"; c.direction = "rtl"; c.fillText("صندوق الاسكان", 0.5 * S, 0.78 * S);
    c.restore();
  }
  function rng(seed) { let s = (seed * 2654435761) % 2147483647 || 7; return () => { s = (s * 16807) % 2147483647; return s / 2147483647 - 0.5; }; }
  function addGrain(cv, amount, rnd) {
    const cx = cv.getContext("2d"), id = cx.getImageData(0, 0, cv.width, cv.height), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const g = (rnd() + rnd()) * amount; d[i] += g + rnd() * amount * 0.5; d[i + 1] += g; d[i + 2] += g + rnd() * amount * 0.5; }
    cx.putImageData(id, 0, 0);
  }
  async function jpeg(cv, q, scale) {
    const blob = await new Promise((r) => cv.toBlob(r, "image/jpeg", q));
    const bmp = await createImageBitmap(blob);
    const out = document.createElement("canvas");
    out.width = Math.round(cv.width * (scale || 1)); out.height = Math.round(cv.height * (scale || 1));
    out.getContext("2d").drawImage(bmp, 0, 0, out.width, out.height);
    return out;
  }
  async function degrade(o) {
    const rnd = rng(o.seed);
    const big = document.createElement("canvas"); big.width = 3 * S; big.height = 3 * S;
    drawArt(big.getContext("2d"), 3, o.rot);
    addGrain(big, o.noise * 0.6, rnd);
    const small = document.createElement("canvas"); small.width = S; small.height = S;
    const sc = small.getContext("2d");
    sc.filter = "blur(" + o.blur + "px)"; // canvas filters apply in output pixels
    sc.drawImage(big, 0, 0, S, S);
    sc.filter = "none";
    const g = sc.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, "rgba(255,255,255,0.08)"); g.addColorStop(1, "rgba(0,0,0,0.08)");
    sc.fillStyle = g; sc.fillRect(0, 0, S, S);
    addGrain(small, o.noise, rnd);
    let cv = await jpeg(small, o.quality, 0.93);
    cv = await jpeg(cv, 0.7, 1 / 0.93);
    const fit = document.createElement("canvas"); fit.width = S; fit.height = S;
    fit.getContext("2d").drawImage(cv, 0, 0, S, S);
    return fit;
  }
  const near = (d, i, col) => Math.abs(d[i] - col[0]) + Math.abs(d[i + 1] - col[1]) + Math.abs(d[i + 2] - col[2]);
  const hexRGB = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));

  window.__signTest = async function (R, opts) {
    const o = Object.assign({ seed: 1, rot: 0, blur: 1.0, noise: 7, quality: 0.5, trace: {} }, opts || {});
    const cv = await degrade(o);
    const img = cv.getContext("2d").getImageData(0, 0, S, S);
    const t0 = performance.now();
    const res = R.trace(img, Object.assign({ colors: 0 }, o.trace));
    const ms = Math.round(performance.now() - t0);
    const K = 2, W = S * K;
    const truth = document.createElement("canvas"); truth.width = W; truth.height = W; drawArt(truth.getContext("2d"), K, o.rot);
    const svg = R.toSVG(res, { width: S, height: S, hidden: new Set(), colors: res.layers.map((l) => l.color), transparent: new Set() });
    const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); await im.decode();
    const out = document.createElement("canvas"); out.width = W; out.height = W; out.getContext("2d").drawImage(im, 0, 0, W, W);
    const a = truth.getContext("2d").getImageData(0, 0, W, W).data, b = out.getContext("2d").getImageData(0, 0, W, W).data;
    let err = 0, bad = 0;
    for (let i = 0; i < a.length; i += 4) { const d = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); err += d; if (d > 90) bad++; }
    // side wobble: at 22 points along every window side, scan across it in the rendered output
    // for where the colour switches from pale (inside) to green (outside)
    const cs = Math.cos(o.rot), sn = Math.sin(o.rot);
    const toPx = (x, y) => { const u = x * S - S / 2, v = y * S - S / 2; return [(u * cs - v * sn + S / 2) * K, (u * sn + v * cs + S / 2) * K]; };
    const pale = hexRGB(PALE), green = hexRGB(GREEN);
    const wob = [], bias = [];
    for (const [x, y, w, h] of WINDOWS) {
      const sides = [[[x, y], [x + w, y], [0, -1]], [[x + w, y], [x + w, y + h], [1, 0]], [[x, y + h], [x + w, y + h], [0, 1]], [[x, y], [x, y + h], [-1, 0]]];
      for (const [p0, p1, nrm] of sides) {
        const offs = [];
        const nx = nrm[0] * cs - nrm[1] * sn, ny = nrm[0] * sn + nrm[1] * cs;
        for (let k = 2; k < 24; k++) {
          const t = k / 25, [X, Y] = toPx(p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t);
          let found = null, prev = null;
          for (let s = -8; s <= 8; s += 0.5) {
            const ix = Math.round(X + nx * s), iy = Math.round(Y + ny * s);
            if (ix < 0 || iy < 0 || ix >= W || iy >= W) continue;
            const i = (iy * W + ix) * 4, isPale = near(b, i, pale) < near(b, i, green);
            if (prev === true && !isPale) { found = s - 0.25; break; }
            prev = isPale;
          }
          if (found !== null) offs.push(found / K);
        }
        if (offs.length < 10) continue;
        const m = offs.reduce((p, q) => p + q, 0) / offs.length;
        wob.push(Math.sqrt(offs.reduce((p, q) => p + (q - m) * (q - m), 0) / offs.length));
        bias.push(Math.abs(m));
      }
    }
    const mean = (v) => v.length ? v.reduce((p, q) => p + q, 0) / v.length : NaN;
    return {
      image: img, svg, jpeg: cv.toDataURL("image/jpeg", 0.9), truth: truth.toDataURL(),
      ms, colors: res.stats.colors, nodes: res.stats.nodes, blur: res.stats.blur,
      wobble: +mean(wob).toFixed(3), bias: +mean(bias).toFixed(3), sides: wob.length,
      err: +(err / (W * W)).toFixed(2), bad: +(bad / (W * W) * 1e4).toFixed(1)
    };
  };
  window.__signSuite = async function (R, opts) {
    const rows = [];
    for (const rot of [0, 0.021]) for (const seed of [1, 2, 3, 4]) rows.push(await __signTest(R, Object.assign({}, opts || {}, { seed, rot })));
    const avg = (k) => +(rows.reduce((p, r) => p + (r[k] || 0), 0) / rows.length).toFixed(3);
    return { wobble: avg("wobble"), bias: avg("bias"), err: avg("err"), bad: avg("bad"), nodes: avg("nodes"), ms: avg("ms"), blur: avg("blur"), sides: avg("sides") };
  };
})();
