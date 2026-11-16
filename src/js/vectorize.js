/*
 * Revector tracing engine.
 *
 * Pipeline (all at the picture's own resolution):
 *  1. Edge-preserving smoothing (symmetric nearest neighbour) to calm noise without blurring edges.
 *  2. Color clustering into a palette (automatic count or a fixed one), or reuse of a given palette.
 *  3. De-haloing: anti-aliased transition pixels between two colors are handed to whichever of the
 *     two neighbouring colors they are closest to, so no thin fringe colors remain along edges.
 *  4. Palette cells: clusters can be merged into one cell (their masks become one before tracing)
 *     and cells can be transparent (cut out).
 *  5. Speck removal (tiny regions join the neighbour they share most border with).
 *  6. Tracing, in one of two layerings:
 *     - "cutouts": a planar boundary graph. Every border between two regions is traced and fitted
 *       ONCE and shared by both regions (one walks it forwards, the other backwards), so shapes meet
 *       exactly with no gaps or overlaps. Each region is one compound path (outline + holes).
 *     - "stacked": larger colors lie underneath and extend under the smaller ones.
 *  7. Curve fitting: corners (including very sharp tips) are found on the pixel outline and kept
 *     exactly; the runs between corners are fitted through edge midpoints (which removes stair
 *     steps) with least-squares cubic Bezier curves and straight lines.
 * Works in a page or in a worker.
 */
(function (global) {
  "use strict";

  const TRANSPARENT = 255, OUTSIDE = 254;

  // ---------------- color helpers ----------------
  function dist2(a, b) {
    const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11;
  }
  function nearest(c, centers) {
    let best = 0, bd = Infinity;
    for (let j = 0; j < centers.length; j++) {
      const d = dist2(c, centers[j]);
      if (d < bd) { bd = d; best = j; }
    }
    return best;
  }
  function hex(c) { return "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join(""); }

  // ---------------- 0. hard binarization (thresholding) before tracing ----------------
  // Eliminates anti-aliased gray/transition pixels on the canvas buffer before contour extraction.
  // Detects dominant background color and either performs strict Black & White / two-tone hard
  // binarization (Otsu dynamic threshold) or snaps transition edge pixels strictly to solid colors.
  function binarizeImageData(imgData, opts) {
    const w = imgData.width, h = imgData.height, n = w * h;
    const d = imgData.data;
    if (!n) return imgData;
    const forceBW = opts && (opts.colors === 2 || opts.forceBinarize);

    // 1. Sample border pixels to find the dominant background color
    const borderBins = new Map();
    const addBorder = (idx) => {
      const p = idx * 4;
      if (d[p + 3] < 128) {
        borderBins.set(-1, (borderBins.get(-1) || 0) + 1);
        return;
      }
      const key = ((d[p] >> 3) << 10) | ((d[p + 1] >> 3) << 5) | (d[p + 2] >> 3);
      let b = borderBins.get(key);
      if (!b) { b = { count: 0, r: 0, g: 0, b: 0 }; borderBins.set(key, b); }
      b.count++; b.r += d[p]; b.g += d[p + 1]; b.b += d[p + 2];
    };
    for (let x = 0; x < w; x++) { addBorder(x); addBorder((h - 1) * w + x); }
    for (let y = 1; y < h - 1; y++) { addBorder(y * w); addBorder(y * w + w - 1); }

    let bgR = 255, bgG = 255, bgB = 255, bgCount = 0;
    borderBins.forEach((b, k) => {
      if (k !== -1 && b.count > bgCount) {
        bgCount = b.count;
        bgR = Math.round(b.r / b.count);
        bgG = Math.round(b.g / b.count);
        bgB = Math.round(b.b / b.count);
      }
    });

    // 2. Analyze image chroma and distance from background for dynamic Otsu thresholding
    const hist = new Uint32Array(256);
    const distArr = new Uint8Array(n);
    let chromaPixels = 0, opaquePixels = 0;
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      if (d[p + 3] < 128) {
        d[p + 3] = 0; // Hard-snap alpha channel
        continue;
      }
      d[p + 3] = 255;
      opaquePixels++;
      const r = d[p], g = d[p + 1], b = d[p + 2];
      const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
      if (maxC - minC > 38) chromaPixels++;
      const dr = r - bgR, dg = g - bgG, db = b - bgB;
      const dist = Math.min(255, Math.round(Math.sqrt(dr * dr + dg * dg + db * db) * 0.57735));
      distArr[i] = dist;
      hist[dist]++;
    }

    // Compute Otsu dynamic threshold on distance from background
    let sumAll = 0;
    for (let t = 0; t < 256; t++) sumAll += t * hist[t];
    let sumB = 0, wB = 0, maxVar = -1, otsuT = 64;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = opaquePixels - wB;
      if (wF === 0) break;
      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sumAll - sumB) / wF;
      const between = wB * wF * (mB - mF) * (mB - mF);
      if (between > maxVar) { maxVar = between; otsuT = t; }
    }
    const T = Math.max(24, Math.min(180, otsuT));
    // a small coloured accent (a dot on a logo) must survive, so only near-zero chroma counts as monochrome
    const isMonochrome = forceBW || (opaquePixels > 0 && chromaPixels < Math.max(24, opaquePixels * 0.01));

    if (isMonochrome) {
      // Strict Black & White (or two-tone solid foreground/background) hard binarization
      let fgR = 0, fgG = 0, fgB = 0, fgC = 0;
      for (let i = 0, p = 0; i < n; i++, p += 4) {
        if (d[p + 3] === 255 && distArr[i] > T) {
          fgR += d[p]; fgG += d[p + 1]; fgB += d[p + 2]; fgC++;
        }
      }
      if (fgC > 0) {
        fgR = Math.round(fgR / fgC); fgG = Math.round(fgG / fgC); fgB = Math.round(fgB / fgC);
      }
      const bgLum = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;
      const fgLum = 0.299 * fgR + 0.587 * fgG + 0.114 * fgB;
      const usePureBW = forceBW || (Math.max(bgR, bgG, bgB) - Math.min(bgR, bgG, bgB) < 25 && Math.max(fgR, fgG, fgB) - Math.min(fgR, fgG, fgB) < 25);
      const outBg = usePureBW ? (bgLum >= fgLum ? [255, 255, 255] : [0, 0, 0]) : [bgR, bgG, bgB];
      const outFg = usePureBW ? (bgLum >= fgLum ? [0, 0, 0] : [255, 255, 255]) : [fgR, fgG, fgB];

      for (let i = 0, p = 0; i < n; i++, p += 4) {
        if (d[p + 3] === 0) continue;
        const c = distArr[i] >= T ? outFg : outBg;
        d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2];
      }
      imgData.__binarized = true;
      return imgData;
    }

    // 3. Multi-color hard edge thresholding: eliminate anti-aliased gray/transition pixels
    // along color boundaries by snapping gradient transition pixels to the nearest local solid plateau
    const src = new Uint8ClampedArray(d);
    const grad = new Float32Array(n);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x, p = i * 4;
        const r = src[p], g = src[p + 1], b = src[p + 2];
        let maxD = 0;
        if (x > 0) { const q = p - 4; maxD = Math.max(maxD, dist2([r, g, b], [src[q], src[q + 1], src[q + 2]])); }
        if (x + 1 < w) { const q = p + 4; maxD = Math.max(maxD, dist2([r, g, b], [src[q], src[q + 1], src[q + 2]])); }
        if (y > 0) { const q = p - w * 4; maxD = Math.max(maxD, dist2([r, g, b], [src[q], src[q + 1], src[q + 2]])); }
        if (y + 1 < h) { const q = p + w * 4; maxD = Math.max(maxD, dist2([r, g, b], [src[q], src[q + 1], src[q + 2]])); }
        grad[i] = maxD;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x, p = i * 4;
        if (src[p + 3] === 0 || grad[i] < 180) continue;
        // Transition pixel on an anti-aliased ramp: snap to the flattest (most solid) neighbor in a 5x5 window,
        // breaking ties toward foreground (non-background) so thin strokes stay crisp.
        const r = src[p], g = src[p + 1], b = src[p + 2];
        let bestP = p, bestScore = Infinity;
        for (let dy = -2; dy <= 2; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= h) continue;
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= w) continue;
            const ni = ny * w + nx, np = ni * 4;
            if (src[np + 3] === 0) continue;
            if (grad[ni] > grad[i] * 0.65) continue;
            const cd = dist2([r, g, b], [src[np], src[np + 1], src[np + 2]]);
            const bgBias = distArr[ni] >= T ? 0.82 : 1.18;
            const score = (cd + grad[ni] * 2.5) * bgBias;
            if (score < bestScore) { bestScore = score; bestP = np; }
          }
        }
        if (bestP !== p) {
          d[p] = src[bestP]; d[p + 1] = src[bestP + 1]; d[p + 2] = src[bestP + 2];
        }
      }
    }
    imgData.__binarized = true;
    return imgData;
  }

  function binarizeCanvas(srcCanvas, dstCanvas, opts) {
    if (!dstCanvas || typeof dstCanvas.getContext !== "function") {
      opts = dstCanvas;
      dstCanvas = typeof document !== "undefined" ? document.createElement("canvas") : srcCanvas;
    }
    const w = srcCanvas.width, h = srcCanvas.height;
    dstCanvas.width = w; dstCanvas.height = h;
    const ctx = dstCanvas.getContext("2d");
    ctx.drawImage(srcCanvas, 0, 0);
    const imgData = ctx.getImageData(0, 0, w, h);
    binarizeImageData(imgData, opts);
    ctx.putImageData(imgData, 0, 0);
    return dstCanvas;
  }

  // ---------------- local edge reconstruction (small pictures) ----------------
  // Pictures smaller than RECON_MAX on their longest side are rebuilt at RECON_SCALE x before
  // tracing: bilateral denoise -> Otsu snap (binarizeImageData) -> clustering -> per-color signed
  // distance fields, smoothed without letting any source pixel change color, interpolated at 4x.
  const RECON_MAX = 800, RECON_SCALE = 4;
  // Fitting at 4x: the 1/4 keeps the per-source-pixel tolerance; the SDF already removed staircases.
  const RECON_ERR = 0.25;

  function bilateralFilter(src, w, h, radius, sigmaS, sigmaR) {
    const out = new Uint8ClampedArray(src);
    const taps = [];
    for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) taps.push(dx, dy, Math.exp(-(dx * dx + dy * dy) / (2 * sigmaS * sigmaS)));
    const range = new Float32Array((3 * 255 * 255 >> 4) + 1);
    for (let i = 0; i < range.length; i++) range[i] = Math.exp(-(i << 4) / (2 * sigmaR * sigmaR));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const c = (y * w + x) * 4;
        if (src[c + 3] < 128) continue;
        const r0 = src[c], g0 = src[c + 1], b0 = src[c + 2];
        let sr = 0, sg = 0, sb = 0, sw = 0;
        for (let t = 0; t < taps.length; t += 3) {
          const nx = x + taps[t], ny = y + taps[t + 1];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const p = (ny * w + nx) * 4;
          if (src[p + 3] < 128) continue;
          const dr = src[p] - r0, dg = src[p + 1] - g0, db = src[p + 2] - b0;
          const wt = taps[t + 2] * range[(dr * dr + dg * dg + db * db) >> 4];
          sr += src[p] * wt; sg += src[p + 1] * wt; sb += src[p + 2] * wt; sw += wt;
        }
        out[c] = sr / sw; out[c + 1] = sg / sw; out[c + 2] = sb / sw;
      }
    }
    return out;
  }

  // Squared Euclidean distance transform (Felzenszwalb & Huttenlocher), in place on f (0 = feature).
  const EDT_INF = 1e20;
  function edt1d(f, n, d, v, z) {
    let k = 0; v[0] = 0; z[0] = -EDT_INF; z[1] = EDT_INF;
    for (let q = 1; q < n; q++) {
      let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
      k++; v[k] = q; z[k] = s; z[k + 1] = EDT_INF;
    }
    k = 0;
    for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
  }
  function edt2d(f, w, h) {
    const m = Math.max(w, h), line = new Float64Array(m), d = new Float64Array(m), v = new Int32Array(m), z = new Float64Array(m + 1);
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) line[y] = f[y * w + x];
      edt1d(line, h, d, v, z);
      for (let y = 0; y < h; y++) f[y * w + x] = d[y];
    }
    for (let y = 0; y < h; y++) {
      const o = y * w;
      for (let x = 0; x < w; x++) line[x] = f[o + x];
      edt1d(line, w, d, v, z);
      for (let x = 0; x < w; x++) f[o + x] = d[x];
    }
  }

  // Signed distance (in source pixels, + inside) of one color within a padded box, Gaussian-smoothed,
  // then clamped so every source pixel keeps its own sign: thin strokes and single pixels survive.
  const SDF_SIGMA = 1.0;
  const SDF_CLAMP = 3.5, SDF_EPS = 0.05;
  function colorSdf(labels, w, h, lab, box) {
    const [x0, y0, x1, y1] = box, bw = x1 - x0, bh = y1 - y0, m = bw * bh;
    const fin = new Float64Array(m), fout = new Float64Array(m);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const on = labels[(y + y0) * w + x + x0] === lab, i = y * bw + x;
      fin[i] = on ? EDT_INF : 0; fout[i] = on ? 0 : EDT_INF;
    }
    edt2d(fin, bw, bh); edt2d(fout, bw, bh);
    const s = new Float32Array(m);
    for (let i = 0; i < m; i++) {
      const v = fout[i] === 0 ? Math.sqrt(fin[i]) - 0.5 : 0.5 - Math.sqrt(fout[i]);
      s[i] = v > SDF_CLAMP ? SDF_CLAMP : v < -SDF_CLAMP ? -SDF_CLAMP : v;
    }
    const rad = Math.ceil(SDF_SIGMA * 2), k = [];
    let ks = 0;
    for (let t = -rad; t <= rad; t++) { const g = Math.exp(-t * t / (2 * SDF_SIGMA * SDF_SIGMA)); k.push(g); ks += g; }
    for (let t = 0; t < k.length; t++) k[t] /= ks;
    const tmp = new Float32Array(m), sm = new Float32Array(m);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      let a = 0;
      for (let t = -rad; t <= rad; t++) { const xx = Math.min(bw - 1, Math.max(0, x + t)); a += s[y * bw + xx] * k[t + rad]; }
      tmp[y * bw + x] = a;
    }
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      let a = 0;
      for (let t = -rad; t <= rad; t++) { const yy = Math.min(bh - 1, Math.max(0, y + t)); a += tmp[yy * bw + x] * k[t + rad]; }
      const i = y * bw + x;
      sm[i] = fout[i] === 0 ? Math.max(a, SDF_EPS) : Math.min(a, -SDF_EPS);
    }
    return sm;
  }

  // Rebuilds a label map at S x: each output pixel takes the color whose smoothed distance field,
  // bilinearly interpolated, is highest there.
  function reconstructLabels(labels, w, h, S) {
    const W = w * S, H = h * S, out = new Uint8Array(W * H);
    const boxes = new Map();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const l = labels[y * w + x];
      let b = boxes.get(l);
      if (!b) { b = [x, y, x, y]; boxes.set(l, b); }
      if (x < b[0]) b[0] = x; if (x > b[2]) b[2] = x; if (y < b[1]) b[1] = y; if (y > b[3]) b[3] = y;
    }
    const pad = 6, fields = new Map();
    if (boxes.size > 1) boxes.forEach((b, l) => {
      const box = [Math.max(0, b[0] - pad), Math.max(0, b[1] - pad), Math.min(w, b[2] + pad + 1), Math.min(h, b[3] + pad + 1)];
      fields.set(l, { box, s: colorSdf(labels, w, h, l, box) });
    });
    const at = (l, x, y) => {
      const F = fields.get(l), [x0, y0, x1, y1] = F.box;
      if (x < x0 || y < y0 || x >= x1 || y >= y1) return -SDF_CLAMP;
      return F.s[(y - y0) * (x1 - x0) + x - x0];
    };
    const cand = [0, 0, 0, 0];
    for (let Y = 0; Y < H; Y++) {
      const v = (Y + 0.5) / S - 0.5, yA = Math.max(0, Math.floor(v)), yB = Math.min(h - 1, Math.floor(v) + 1), fy = v < 0 ? 0 : Math.min(1, v - Math.floor(v));
      for (let X = 0; X < W; X++) {
        const u = (X + 0.5) / S - 0.5, xA = Math.max(0, Math.floor(u)), xB = Math.min(w - 1, Math.floor(u) + 1), fx = u < 0 ? 0 : Math.min(1, u - Math.floor(u));
        const l00 = labels[yA * w + xA], l10 = labels[yA * w + xB], l01 = labels[yB * w + xA], l11 = labels[yB * w + xB];
        if (l00 === l10 && l00 === l01 && l00 === l11) { out[Y * W + X] = l00; continue; }
        cand[0] = l00; let nc = 1;
        if (l10 !== l00) cand[nc++] = l10;
        if (l01 !== l00 && l01 !== l10) cand[nc++] = l01;
        if (l11 !== l00 && l11 !== l10 && l11 !== l01) cand[nc++] = l11;
        let best = l00, bv = -Infinity;
        for (let i = 0; i < nc; i++) {
          const l = cand[i];
          const val = (at(l, xA, yA) * (1 - fx) + at(l, xB, yA) * fx) * (1 - fy) + (at(l, xA, yB) * (1 - fx) + at(l, xB, yB) * fx) * fy;
          if (val > bv) { bv = val; best = l; }
        }
        out[Y * W + X] = best;
      }
    }
    return out;
  }

  function scaleShapes(shapes, k) {
    const pt = (p) => [p[0] * k, p[1] * k];
    return shapes.map((s) => Object.assign({}, s, {
      area: s.area * k * k,
      contours: s.contours.map((c) => ({ start: pt(c.start), segs: c.segs.map((g) => g.l ? { l: pt(g.l) } : { c: g.c.map((v) => v * k) }) }))
    }));
  }

  // ---------------- 1. edge-preserving smoothing ----------------
  function snnFilter(src, w, h) {
    const out = new Uint8ClampedArray(src.length);
    out.set(src);
    if (w < 3 || h < 3) return out;
    const W4 = w * 4;
    const d = (p, q) => Math.abs(src[p] - src[q]) + Math.abs(src[p + 1] - src[q + 1]) + Math.abs(src[p + 2] - src[q + 2]);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const c = (y * w + x) * 4;
        if (src[c + 3] < 128) continue;
        const pairs = [c - W4, c + W4, c - 4, c + 4, c - W4 - 4, c + W4 + 4, c - W4 + 4, c + W4 - 4];
        let r = src[c], g = src[c + 1], b = src[c + 2];
        for (let k = 0; k < 8; k += 2) {
          const p = pairs[k], q = pairs[k + 1];
          const pick = d(c, p) <= d(c, q) ? p : q;
          r += src[pick]; g += src[pick + 1]; b += src[pick + 2];
        }
        out[c] = r / 5; out[c + 1] = g / 5; out[c + 2] = b / 5;
      }
    }
    return out;
  }

  // ---------------- 2. clustering ----------------
  function buildBins(data, n) {
    const count = new Uint32Array(32768), sr = new Float64Array(32768), sg = new Float64Array(32768), sb = new Float64Array(32768);
    let opaque = 0;
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      if (data[p + 3] < 128) continue;
      const r = data[p], g = data[p + 1], b = data[p + 2];
      const k = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      count[k]++; sr[k] += r; sg[k] += g; sb[k] += b; opaque++;
    }
    const keys = [], cols = [], wts = [];
    for (let k = 0; k < 32768; k++) {
      if (!count[k]) continue;
      keys.push(k); wts.push(count[k]);
      cols.push([sr[k] / count[k], sg[k] / count[k], sb[k] / count[k]]);
    }
    return { keys, cols, wts, opaque };
  }
  function kmeans(bins, centers, iters) {
    const { cols, wts } = bins;
    for (let it = 0; it < iters; it++) {
      const acc = centers.map(() => [0, 0, 0, 0]);
      for (let i = 0; i < cols.length; i++) {
        const j = nearest(cols[i], centers), w = wts[i], c = cols[i], a = acc[j];
        a[0] += c[0] * w; a[1] += c[1] * w; a[2] += c[2] * w; a[3] += w;
      }
      let moved = 0;
      for (let j = 0; j < centers.length; j++) {
        const a = acc[j];
        if (!a[3]) continue;
        const nc = [a[0] / a[3], a[1] / a[3], a[2] / a[3]];
        moved += dist2(nc, centers[j]); centers[j] = nc;
      }
      if (moved < 0.25) break;
    }
    return centers;
  }
  function mergeClose(bins, centers, thr) {
    let changed = true;
    while (changed && centers.length > 1) {
      changed = false;
      outer: for (let a = 0; a < centers.length; a++) {
        for (let b = a + 1; b < centers.length; b++) {
          if (dist2(centers[a], centers[b]) < thr) {
            centers[a] = [(centers[a][0] + centers[b][0]) / 2, (centers[a][1] + centers[b][1]) / 2, (centers[a][2] + centers[b][2]) / 2];
            centers.splice(b, 1); changed = true; break outer;
          }
        }
      }
    }
    return kmeans(bins, centers, 4);
  }
  function autoPalette(bins) {
    const order = bins.cols.map((_, i) => i).sort((a, b) => bins.wts[b] - bins.wts[a]);
    // small but real color regions are kept: a color needs only 0.08% of the picture to stand alone
    const minCount = Math.max(4, bins.opaque * 0.0008);
    const mergeD = 30 * 30 * 0.6;
    const centers = [], weights = [];
    for (const i of order) {
      const c = bins.cols[i], w = bins.wts[i];
      let j = -1, bd = Infinity;
      for (let q = 0; q < centers.length; q++) { const d = dist2(c, centers[q]); if (d < bd) { bd = d; j = q; } }
      if (j >= 0 && (bd < mergeD || w < minCount || centers.length >= 32)) {
        const tw = weights[j] + w;
        centers[j] = [(centers[j][0] * weights[j] + c[0] * w) / tw, (centers[j][1] * weights[j] + c[1] * w) / tw, (centers[j][2] * weights[j] + c[2] * w) / tw];
        weights[j] = tw;
      } else { centers.push(c.slice()); weights.push(w); }
    }
    return mergeClose(bins, kmeans(bins, centers, 6), 24 * 24 * 0.6);
  }
  function fixedPalette(bins, k) {
    const { cols, wts } = bins;
    if (!cols.length) return [[0, 0, 0]];
    let first = 0;
    for (let i = 1; i < wts.length; i++) if (wts[i] > wts[first]) first = i;
    const centers = [cols[first].slice()];
    const dmin = cols.map((c) => dist2(c, centers[0]));
    while (centers.length < k && centers.length < cols.length) {
      let bi = -1, bs = -1;
      for (let i = 0; i < cols.length; i++) { const s = dmin[i] * Math.sqrt(wts[i]); if (s > bs) { bs = s; bi = i; } }
      if (bs <= 0) break;
      centers.push(cols[bi].slice());
      for (let i = 0; i < cols.length; i++) dmin[i] = Math.min(dmin[i], dist2(cols[i], cols[bi]));
    }
    return kmeans(bins, centers, 12);
  }

  // ---------------- 3. de-haloing ----------------
  // A pixel on a thin strip of its own color, whose cluster color lies between two neighbouring
  // colors (an anti-aliasing blend), is given to the nearer of those two colors.
  function dehalo(labels, data, w, h, centers, passes) {
    const n = w * h, K = centers.length;
    // which cluster colors sit between which pairs: between[l][a*K+b] -> t (0..1) or -1
    const between = [];
    for (let l = 0; l < K; l++) {
      const row = new Float32Array(K * K).fill(-1);
      for (let a = 0; a < K; a++) for (let b = a + 1; b < K; b++) {
        if (a === l || b === l) continue;
        const A = centers[a], B = centers[b], C = centers[l];
        const ab = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
        const L2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
        if (L2 < 900) continue;
        const t = ((C[0] - A[0]) * ab[0] + (C[1] - A[1]) * ab[1] + (C[2] - A[2]) * ab[2]) / L2;
        if (t < 0.06 || t > 0.94) continue;
        const px = A[0] + ab[0] * t - C[0], py = A[1] + ab[1] * t - C[1], pz = A[2] + ab[2] * t - C[2];
        if (px * px + py * py + pz * pz > L2 * 0.06) continue; // C is not on the A-B blend line
        row[a * K + b] = t; row[b * K + a] = 1 - t;
      }
      between.push(row);
    }
    const cnt = new Int32Array(256), seen = [];
    let src = labels, dst = new Uint8Array(n);
    for (let pass = 0; pass < passes; pass++) {
      dst.set(src);
      let changed = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x, l = src[i];
          if (l === TRANSPARENT) continue;
          // fast path: pixels deep inside a region
          if (x > 0 && x < w - 1 && y > 0 && y < h - 1 && src[i - 1] === l && src[i + 1] === l && src[i - w] === l && src[i + w] === l
            && src[i - w - 1] === l && src[i - w + 1] === l && src[i + w - 1] === l && src[i + w + 1] === l) continue;
          seen.length = 0;
          let same = 0;
          for (let dy = -1; dy <= 1; dy++) {
            const yy = y + dy; if (yy < 0 || yy >= h) continue;
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              const xx = x + dx; if (xx < 0 || xx >= w) continue;
              const q = src[yy * w + xx];
              if (q === l) { same++; continue; }
              if (q === TRANSPARENT) continue;
              if (!cnt[q]) seen.push(q);
              cnt[q]++;
            }
          }
          if (same <= 4 && seen.length >= 2) {
            let best = -1, bestScore = -1;
            const row = between[l];
            for (let s = 0; s < seen.length; s++) for (let r = s + 1; r < seen.length; r++) {
              const a = seen[s], b = seen[r];
              const t = row[a * K + b];
              if (t < 0) continue;
              const score = cnt[a] + cnt[b];
              if (score > bestScore) {
                bestScore = score;
                // pick the side the actual pixel color is closest to
                const p = i * 4, pc = [data[p], data[p + 1], data[p + 2]];
                best = dist2(pc, centers[a]) <= dist2(pc, centers[b]) ? a : b;
              }
            }
            if (best >= 0) { dst[i] = best; changed++; }
          }
          for (const q of seen) cnt[q] = 0;
        }
      }
      const t = src; src = dst; dst = t === labels ? new Uint8Array(n) : t;
      if (!changed) break;
    }
    if (src !== labels) labels.set(src);
  }

  // ---------------- 4. edge vote (v2) ----------------
  // Smooths ragged borders: a pixel with at most 2 same-colored neighbours joins the color that
  // surrounds it (5+ of 8 neighbours, or 4+ when its own color is closer to that one).
  const SMALL_AREA = 500;
  function edgeVote(labels, data, w, h, centers, passes) {
    const n = w * h, cnt = new Int32Array(256), seen = [];
    const src = new Uint8Array(n);
    for (let pass = 0; pass < passes; pass++) {
      src.set(labels);
      let changed = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x, l = src[i];
        if (l === TRANSPARENT || l === OUTSIDE) continue;
        seen.length = 0;
        let same = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy; if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const xx = x + dx; if (xx < 0 || xx >= w) continue;
            const q = src[yy * w + xx];
            if (q === l) { same++; continue; }
            if (q === TRANSPARENT || q === OUTSIDE) continue;
            if (!cnt[q]) seen.push(q);
            cnt[q]++;
          }
        }
        if (same <= 2 && seen.length) {
          let top = seen[0];
          for (const q of seen) if (cnt[q] > cnt[top]) top = q;
          let move = cnt[top] >= 5;
          if (!move && cnt[top] >= 4) {
            const p = i * 4, pc = [data[p], data[p + 1], data[p + 2]];
            move = dist2(pc, centers[top]) < dist2(pc, centers[l]);
          }
          if (move) { labels[i] = top; changed++; }
        }
        for (const q of seen) cnt[q] = 0;
      }
      if (!changed) break;
    }
  }

  // ---------------- 5. speck removal ----------------
  function removeSpecks(labels, w, h, minArea, comp, queue) {
    if (minArea <= 1) return;
    const n = w * h;
    for (let pass = 0; pass < 2; pass++) {
      comp.fill(-1);
      let id = 0, merged = 0;
      for (let s = 0; s < n; s++) {
        if (comp[s] !== -1) continue;
        const lab = labels[s];
        let head = 0, tail = 0;
        queue[tail++] = s; comp[s] = id;
        while (head < tail) {
          const p = queue[head++], x = p % w;
          if (x > 0 && comp[p - 1] === -1 && labels[p - 1] === lab) { comp[p - 1] = id; queue[tail++] = p - 1; }
          if (x < w - 1 && comp[p + 1] === -1 && labels[p + 1] === lab) { comp[p + 1] = id; queue[tail++] = p + 1; }
          if (p >= w && comp[p - w] === -1 && labels[p - w] === lab) { comp[p - w] = id; queue[tail++] = p - w; }
          if (p < n - w && comp[p + w] === -1 && labels[p + w] === lab) { comp[p + w] = id; queue[tail++] = p + w; }
        }
        if (tail < minArea) {
          const votes = new Map();
          for (let m = 0; m < tail; m++) {
            const p = queue[m], x = p % w;
            if (x > 0 && labels[p - 1] !== lab) votes.set(labels[p - 1], (votes.get(labels[p - 1]) || 0) + 1);
            if (x < w - 1 && labels[p + 1] !== lab) votes.set(labels[p + 1], (votes.get(labels[p + 1]) || 0) + 1);
            if (p >= w && labels[p - w] !== lab) votes.set(labels[p - w], (votes.get(labels[p - w]) || 0) + 1);
            if (p < n - w && labels[p + w] !== lab) votes.set(labels[p + w], (votes.get(labels[p + w]) || 0) + 1);
          }
          let best = -1, bv = 0;
          votes.forEach((v, k) => { if (v > bv) { bv = v; best = k; } });
          if (best >= 0) { for (let m = 0; m < tail; m++) labels[queue[m]] = best; merged++; }
        }
        id++;
      }
      if (!merged) break;
    }
  }

  function labelComponents(labels, w, h, comp, queue, onlyMask) {
    const n = w * h;
    comp.fill(-1);
    let id = 0;
    for (let s = 0; s < n; s++) {
      if (comp[s] !== -1 || (onlyMask && !onlyMask[s])) continue;
      const lab = labels[s];
      let head = 0, tail = 0;
      queue[tail++] = s; comp[s] = id;
      while (head < tail) {
        const p = queue[head++], x = p % w;
        if (x > 0 && comp[p - 1] === -1 && labels[p - 1] === lab) { comp[p - 1] = id; queue[tail++] = p - 1; }
        if (x < w - 1 && comp[p + 1] === -1 && labels[p + 1] === lab) { comp[p + 1] = id; queue[tail++] = p + 1; }
        if (p >= w && comp[p - w] === -1 && labels[p - w] === lab) { comp[p - w] = id; queue[tail++] = p - w; }
        if (p < n - w && comp[p + w] === -1 && labels[p + w] === lab) { comp[p + w] = id; queue[tail++] = p + w; }
      }
      id++;
    }
    return id;
  }

  // ---------------- boundary walking ----------------
  const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];
  // Directed unit edges with the region on the right. Bits per grid vertex: 1 right, 2 down, 4 left, 8 up.
  function buildEdges(labels, w, h) {
    const W = w + 1, ed = new Uint8Array(W * (h + 1));
    for (let y = 0; y < h; y++) {
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const i = row + x, L = labels[i];
        if (y === 0 || labels[i - w] !== L) ed[y * W + x] |= 1;
        if (x === w - 1 || labels[i + 1] !== L) ed[y * W + x + 1] |= 2;
        if (y === h - 1 || labels[i + w] !== L) ed[(y + 1) * W + x + 1] |= 4;
        if (x === 0 || labels[i - 1] !== L) ed[(y + 1) * W + x] |= 8;
      }
    }
    return ed;
  }
  // Walks every loop. At each vertex the turn is fixed by the grid (right, straight, left), which keeps
  // diagonally touching cells apart and ends the loop exactly when it returns to its first edge.
  function walkLoops(ed, w, h, onLoop) {
    const W = w + 1, orig = ed.slice();
    let buf = new Int32Array(1024);
    for (let v0 = 0; v0 < ed.length; v0++) {
      while (ed[v0]) {
        let d = ed[v0] & 1 ? 0 : ed[v0] & 2 ? 1 : ed[v0] & 4 ? 2 : 3;
        let v = v0, x = v % W, y = (v / W) | 0, n = 0;
        const rx = d === 0 ? x : d === 1 ? x - 1 : d === 2 ? x - 1 : x;
        const ry = d === 0 ? y : d === 1 ? y : d === 2 ? y - 1 : y - 1;
        for (;;) {
          if (n >= buf.length) { const nb = new Int32Array(buf.length * 2); nb.set(buf); buf = nb; }
          buf[n++] = v;
          ed[v] &= ~(1 << d);
          x += DX[d]; y += DY[d]; v = y * W + x;
          const oe = orig[v], r = (d + 1) & 3, l = (d + 3) & 3;
          const nd = oe & (1 << r) ? r : oe & (1 << d) ? d : oe & (1 << l) ? l : -1;
          if (nd < 0 || !(ed[v] & (1 << nd))) break;
          d = nd;
        }
        onLoop(buf, n, rx, ry);
      }
    }
  }

  // ---------------- 7. curve fitting ----------------
  function norm(x, y) { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; }
  function bez(p, t) {
    const mt = 1 - t, a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
    return [a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]];
  }
  function chordParams(X, Y, first, last) {
    const u = [0];
    for (let i = first + 1; i <= last; i++) u.push(u[u.length - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]));
    const tot = u[u.length - 1] || 1;
    return u.map((v) => v / tot);
  }
  function generate(X, Y, first, last, u, t1, t2) {
    const p0 = [X[first], Y[first]], p3 = [X[last], Y[last]];
    let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
    for (let i = 0; i < u.length; i++) {
      const t = u[i], mt = 1 - t;
      const b0 = mt * mt * mt, b1 = 3 * mt * mt * t, b2 = 3 * mt * t * t, b3 = t * t * t;
      const a1x = t1[0] * b1, a1y = t1[1] * b1, a2x = t2[0] * b2, a2y = t2[1] * b2;
      c00 += a1x * a1x + a1y * a1y; c01 += a1x * a2x + a1y * a2y; c11 += a2x * a2x + a2y * a2y;
      const tx = X[first + i] - (p0[0] * (b0 + b1) + p3[0] * (b2 + b3));
      const ty = Y[first + i] - (p0[1] * (b0 + b1) + p3[1] * (b2 + b3));
      x0 += a1x * tx + a1y * ty; x1 += a2x * tx + a2y * ty;
    }
    const det = c00 * c11 - c01 * c01;
    let al = det ? (x0 * c11 - x1 * c01) / det : 0, ar = det ? (c00 * x1 - c01 * x0) / det : 0;
    const segLen = Math.hypot(p3[0] - p0[0], p3[1] - p0[1]), eps = 1e-6 * segLen;
    if (al < eps || ar < eps || al > segLen * 1.5 || ar > segLen * 1.5) { al = ar = segLen / 3; }
    return [p0[0], p0[1], p0[0] + t1[0] * al, p0[1] + t1[1] * al, p3[0] + t2[0] * ar, p3[1] + t2[1] * ar, p3[0], p3[1]];
  }
  function maxError(X, Y, first, last, b, u) {
    let md = 0, split = (first + last) >> 1;
    for (let i = first + 1; i < last; i++) {
      const p = bez(b, u[i - first]);
      const d = (p[0] - X[i]) ** 2 + (p[1] - Y[i]) ** 2;
      if (d >= md) { md = d; split = i; }
    }
    // also check between samples so a curve cannot bulge away from the outline
    for (let i = first; i < last; i++) {
      const tm = (u[i - first] + u[i + 1 - first]) / 2, p = bez(b, tm);
      const mx = (X[i] + X[i + 1]) / 2, my = (Y[i] + Y[i + 1]) / 2;
      const d = ((p[0] - mx) ** 2 + (p[1] - my) ** 2) * 0.8;
      if (d > md) { md = d; split = Math.min(last - 1, Math.max(first + 1, i)); }
    }
    return [md, split];
  }
  function reparam(X, Y, first, u, b) {
    return u.map((t, i) => {
      const P0 = X[first + i], P1 = Y[first + i], mt = 1 - t, q = bez(b, t);
      const q1x = 3 * (mt * mt * (b[2] - b[0]) + 2 * mt * t * (b[4] - b[2]) + t * t * (b[6] - b[4]));
      const q1y = 3 * (mt * mt * (b[3] - b[1]) + 2 * mt * t * (b[5] - b[3]) + t * t * (b[7] - b[5]));
      const q2x = 6 * (mt * (b[4] - 2 * b[2] + b[0]) + t * (b[6] - 2 * b[4] + b[2]));
      const q2y = 6 * (mt * (b[5] - 2 * b[3] + b[1]) + t * (b[7] - 2 * b[5] + b[3]));
      const num = (q[0] - P0) * q1x + (q[1] - P1) * q1y;
      const den = q1x * q1x + q1y * q1y + (q[0] - P0) * q2x + (q[1] - P1) * q2y;
      return Math.min(1, Math.max(0, den ? t - num / den : t));
    });
  }
  function lineFits(X, Y, first, last, tol2) {
    const x0 = X[first], y0 = Y[first], dx = X[last] - x0, dy = Y[last] - y0, L2 = dx * dx + dy * dy;
    if (!L2) return false;
    for (let i = first + 1; i < last; i++) {
      const cr = (X[i] - x0) * dy - (Y[i] - y0) * dx;
      if ((cr * cr) / L2 > tol2 * 0.3) return false;
      const t = ((X[i] - x0) * dx + (Y[i] - y0) * dy) / L2;
      if (t < -0.05 || t > 1.05) return false;
    }
    return true;
  }
  function fitCubic(X, Y, first, last, t1, t2, err, out, depth) {
    const n = last - first + 1;
    if (n < 2) return;
    if (lineFits(X, Y, first, last, err)) { out.push({ l: [X[last], Y[last]] }); return; }
    if (n === 2) {
      const d = Math.hypot(X[last] - X[first], Y[last] - Y[first]) / 3;
      out.push({ c: [X[first] + t1[0] * d, Y[first] + t1[1] * d, X[last] + t2[0] * d, Y[last] + t2[1] * d, X[last], Y[last]] });
      return;
    }
    let u = chordParams(X, Y, first, last);
    let b = generate(X, Y, first, last, u, t1, t2);
    let [md, split] = maxError(X, Y, first, last, b, u);
    if (md < err) { out.push({ c: b.slice(2) }); return; }
    if (md < err * 9) {
      for (let it = 0; it < 6; it++) {
        u = reparam(X, Y, first, u, b);
        b = generate(X, Y, first, last, u, t1, t2);
        [md, split] = maxError(X, Y, first, last, b, u);
        if (md < err) { out.push({ c: b.slice(2) }); return; }
      }
    }
    if (depth > 20 || n < 4) { out.push({ c: b.slice(2) }); return; }
    split = Math.min(last - 1, Math.max(first + 1, split));
    const tc = norm(X[split - 1] - X[split + 1], Y[split - 1] - Y[split + 1]);
    fitCubic(X, Y, first, split, t1, tc, err, out, depth + 1);
    fitCubic(X, Y, split, last, [-tc[0], -tc[1]], t2, err, out, depth + 1);
  }
  function endTangent(X, Y, from, step, other) {
    const k = Math.min(3, Math.abs(other - from));
    const j = from + step * Math.max(1, k);
    return norm(X[j] - X[from], Y[j] - Y[from]);
  }

  // Corners on a pixel outline: a wide-window test for ordinary corners and a narrow one for sharp tips.
  function findCorners(px, py, n, closed, settings) {
    const isC = new Uint8Array(n);
    if (n < 3) return isC;
    const ns = n / (settings.scale || 1);
    const extra = closed ? (ns < 40 ? 38 : ns < 90 ? 22 : ns < 160 ? 10 : 0) : (ns < 12 ? 25 : 0);
    const thr = Math.cos(Math.min(170, settings.cornerDeg + extra) * Math.PI / 180);
    const tipThr = Math.cos(Math.min(175, Math.max(settings.cornerDeg + extra, 112)) * Math.PI / 180);
    const kBig = n < 20 ? 2 : n < 60 ? 3 : 4;
    const at = (i) => closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i));
    const cosAt = (i, k) => {
      const a = at(i - k), b = at(i + k);
      const ax = px[i] - px[a], ay = py[i] - py[a], bx = px[b] - px[i], by = py[b] - py[i];
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      return la && lb ? (ax * bx + ay * by) / (la * lb) : 1;
    };
    const big = new Float32Array(n), small = new Float32Array(n);
    for (let i = 0; i < n; i++) { big[i] = cosAt(i, kBig); small[i] = cosAt(i, 2); }
    const lo = closed ? 0 : 1, hi = closed ? n : n - 1;
    for (let i = lo; i < hi; i++) {
      const a = at(i - 1), b = at(i + 1);
      const turn = (px[i] - px[a]) * (py[b] - py[i]) - (py[i] - py[a]) * (px[b] - px[i]);
      if (!turn) continue;
      let hit = false;
      if (big[i] < thr) {
        hit = true;
        for (let j = -kBig; j <= kBig && hit; j++) { if (!j) continue; const q = at(i + j); if (big[q] < big[i] || (big[q] === big[i] && j < 0 && isC[q])) hit = false; }
      }
      if (!hit && small[i] < tipThr) {
        hit = true;
        for (let j = -2; j <= 2 && hit; j++) { if (!j) continue; const q = at(i + j); if (small[q] < small[i] || (small[q] === small[i] && j < 0 && isC[q])) hit = false; }
      }
      if (hit) isC[i] = 1;
    }
    return isC;
  }

  function smoothOpen(xs, ys, iters) {
    const n = xs.length;
    if (n < 4) return;
    for (let it = 0; it < iters; it++) {
      let px = xs[0], py = ys[0];
      for (let i = 1; i < n - 1; i++) {
        const nx = (px + 2 * xs[i] + xs[i + 1]) / 4, ny = (py + 2 * ys[i] + ys[i + 1]) / 4;
        px = xs[i]; py = ys[i]; xs[i] = nx; ys[i] = ny;
      }
    }
  }
  function smoothClosed(xs, ys, iters) {
    const n = xs.length, tx = new Float64Array(n), ty = new Float64Array(n);
    for (let it = 0; it < iters; it++) {
      for (let i = 0; i < n; i++) {
        const a = (i - 1 + n) % n, b = (i + 1) % n;
        tx[i] = (xs[a] + 2 * xs[i] + xs[b]) / 4; ty[i] = (ys[a] + 2 * ys[i] + ys[b]) / 4;
      }
      for (let i = 0; i < n; i++) { xs[i] = tx[i]; ys[i] = ty[i]; }
    }
  }

  // Midpoints of the maximal straight pixel runs between vertex a and vertex b (indices may pass n).
  // On a stair-stepped edge these midpoints sit on the true edge line, unlike the step corners.
  function runMids(px, py, a, b, n, xs, ys) {
    let s = a;
    const dir = (i) => { const p = i % n, q = (i + 1) % n; return (Math.sign(px[q] - px[p]) + 1) * 3 + (Math.sign(py[q] - py[p]) + 1); };
    for (let i = a; i < b; i++) {
      if (i + 1 === b || dir(i + 1) !== dir(i)) {
        const p = s % n, q = (i + 1) % n;
        xs.push((px[p] + px[q]) / 2); ys.push((py[p] + py[q]) / 2);
        s = i + 1;
      }
    }
  }

  // Squared distance from point (px, py) to line segment (ax, ay)-(bx, by).
  function ptSegDistSq(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq <= 1e-12) return (px - ax) * (px - ax) + (py - ay) * (py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    const qx = ax + t * dx, qy = ay + t * dy;
    return (px - qx) * (px - qx) + (py - qy) * (py - qy);
  }

  // Ramer-Douglas-Peucker polyline simplification to strip staircase/wobbly vertices before curve fitting.
  function simplifyDP(xs, ys, tol, closed) {
    const n = xs.length;
    if (n <= 4 || tol <= 0) return { xs, ys };
    const tolSq = tol * tol;
    const keep = new Uint8Array(n);
    if (closed) {
      let i0 = 0, i1 = 0, maxD = -1;
      for (let i = 1; i < n; i++) {
        const d = (xs[i] - xs[0]) ** 2 + (ys[i] - ys[0]) ** 2;
        if (d > maxD) { maxD = d; i1 = i; }
      }
      maxD = -1;
      for (let i = 0; i < n; i++) {
        const d = (xs[i] - xs[i1]) ** 2 + (ys[i] - ys[i1]) ** 2;
        if (d > maxD) { maxD = d; i0 = i; }
      }
      if (i0 === i1) i1 = (i0 + (n >> 1)) % n;
      keep[i0] = 1; keep[i1] = 1;
      const runChain = (start, end) => {
        const idx = [];
        for (let k = start; ; k = (k + 1) % n) { idx.push(k); if (k === end) break; }
        const st = [[0, idx.length - 1]];
        while (st.length) {
          const [a, b] = st.pop();
          if (b - a <= 1) continue;
          const ax = xs[idx[a]], ay = ys[idx[a]], bx = xs[idx[b]], by = ys[idx[b]];
          let best = -1, bi = -1;
          for (let j = a + 1; j < b; j++) {
            const p = idx[j];
            const d = ptSegDistSq(xs[p], ys[p], ax, ay, bx, by);
            if (d > best) { best = d; bi = j; }
          }
          if (best > tolSq && bi !== -1) {
            keep[idx[bi]] = 1;
            st.push([a, bi], [bi, b]);
          }
        }
      };
      runChain(i0, i1);
      runChain(i1, i0);
    } else {
      keep[0] = 1; keep[n - 1] = 1;
      const st = [[0, n - 1]];
      while (st.length) {
        const [a, b] = st.pop();
        if (b - a <= 1) continue;
        const ax = xs[a], ay = ys[a], bx = xs[b], by = ys[b];
        let best = -1, bi = -1;
        for (let j = a + 1; j < b; j++) {
          const d = ptSegDistSq(xs[j], ys[j], ax, ay, bx, by);
          if (d > best) { best = d; bi = j; }
        }
        if (best > tolSq && bi !== -1) {
          keep[bi] = 1;
          st.push([a, bi], [bi, b]);
        }
      }
    }
    const ox = [], oy = [];
    for (let i = 0; i < n; i++) if (keep[i]) { ox.push(xs[i]); oy.push(ys[i]); }
    if (ox.length < (closed ? 4 : 2)) return { xs, ys };
    return { xs: ox, ys: oy };
  }

  // SVGO-style post-tracing path simplification:
  // 1) Straightens near-collinear cubic Béziers into clean line segments.
  // 2) Merges consecutive collinear line segments into a single straight line.
  // 3) Re-fits bumpy multi-segment cubic runs into fewer, smoother cubic Bézier curves.
  function postSimplifySegs(start, segs, closed, settings) {
    if (!segs || !segs.length) return { start, segs };
    const aggressive = !!(settings && settings.iconLogoMode);
    const sc = (settings && settings.scale) || 1;
    const lineTolSq = (aggressive ? 0.36 : 0.09) * sc * sc;
    const mergeErr = (settings ? settings.err : 0.25) * (aggressive ? 1.85 : 1.15);

    // Pass 1: convert nearly straight cubics to lines and drop zero-length steps
    const pass1 = [];
    let cx = start[0], cy = start[1];
    for (let i = 0; i < segs.length; i++) {
      const g = segs[i];
      if (g.l) {
        const ex = g.l[0], ey = g.l[1];
        if (Math.hypot(ex - cx, ey - cy) > 1e-4) {
          pass1.push({ l: [ex, ey] });
          cx = ex; cy = ey;
        }
      } else if (g.c) {
        const [x1, y1, x2, y2, ex, ey] = g.c;
        if (Math.hypot(ex - cx, ey - cy) <= 1e-4 && Math.hypot(x1 - cx, y1 - cy) <= 1e-2) continue;
        const d1 = ptSegDistSq(x1, y1, cx, cy, ex, ey);
        const d2 = ptSegDistSq(x2, y2, cx, cy, ex, ey);
        if (d1 <= lineTolSq && d2 <= lineTolSq) {
          pass1.push({ l: [ex, ey] });
        } else {
          pass1.push({ c: [x1, y1, x2, y2, ex, ey] });
        }
        cx = ex; cy = ey;
      }
    }

    // Pass 2: merge consecutive collinear line segments
    const pass2 = [];
    cx = start[0]; cy = start[1];
    let i = 0;
    while (i < pass1.length) {
      if (!pass1[i].l) {
        const c = pass1[i].c;
        pass2.push(pass1[i]);
        cx = c[4]; cy = c[5];
        i++;
        continue;
      }
      const lpts = [[cx, cy], [pass1[i].l[0], pass1[i].l[1]]];
      let j = i + 1;
      while (j < pass1.length && pass1[j].l) {
        lpts.push([pass1[j].l[0], pass1[j].l[1]]);
        j++;
      }
      if (lpts.length === 2) {
        pass2.push({ l: [lpts[1][0], lpts[1][1]] });
        cx = lpts[1][0]; cy = lpts[1][1];
      } else {
        const lx = lpts.map((p) => p[0]), ly = lpts.map((p) => p[1]);
        const simp = simplifyDP(lx, ly, Math.sqrt(lineTolSq), false);
        for (let k = 1; k < simp.xs.length; k++) {
          pass2.push({ l: [simp.xs[k], simp.ys[k]] });
        }
        cx = simp.xs[simp.xs.length - 1];
        cy = simp.ys[simp.ys.length - 1];
      }
      i = j;
    }

    if (!aggressive || pass2.length <= 1) return { start, segs: pass2 };

    // Pass 3 (Icon/Logo smooth mode): consolidate consecutive smooth cubic chains into fewer cubics
    const out = [];
    cx = start[0]; cy = start[1];
    i = 0;
    while (i < pass2.length) {
      if (!pass2[i].c) {
        out.push(pass2[i]);
        cx = pass2[i].l[0]; cy = pass2[i].l[1];
        i++;
        continue;
      }
      // Gather contiguous cubics that share smooth tangents at joints
      const chain = [pass2[i]];
      let j = i + 1;
      while (j < pass2.length && pass2[j].c && chain.length < 6) {
        const prev = chain[chain.length - 1].c;
        const next = pass2[j].c;
        const tIn = norm(prev[4] - prev[2], prev[5] - prev[3]);
        const tOut = norm(next[0] - prev[4], next[1] - prev[5]);
        const dot = tIn[0] * tOut[0] + tIn[1] * tOut[1];
        if (dot < 0.82) break; // preserve intentional sharp corner between curves
        chain.push(pass2[j]);
        j++;
      }
      if (chain.length >= 2) {
        // Sample the chain densely, lightly smooth, and try fitting a single cubic (or fewer cubics)
        const sx = [cx], sy = [cy];
        let px0 = cx, py0 = cy;
        for (const seg of chain) {
          const c = seg.c;
          const b = [px0, py0, c[0], c[1], c[2], c[3], c[4], c[5]];
          for (let s = 1; s <= 6; s++) {
            const p = bez(b, s / 6);
            sx.push(p[0]); sy.push(p[1]);
          }
          px0 = c[4]; py0 = c[5];
        }
        smoothOpen(sx, sy, 1);
        const last = sx.length - 1;
        const tL = endTangent(sx, sy, 0, 1, last);
        const tR = endTangent(sx, sy, last, -1, 0);
        const merged = [];
        fitCubic(sx, sy, 0, last, tL, tR, mergeErr, merged, 0);
        if (merged.length > 0 && merged.length < chain.length) {
          for (const m of merged) out.push(m);
        } else {
          for (const seg of chain) out.push(seg);
        }
        cx = chain[chain.length - 1].c[4];
        cy = chain[chain.length - 1].c[5];
      } else {
        out.push(chain[0]);
        cx = chain[0].c[4];
        cy = chain[0].c[5];
      }
      i = j;
    }
    return { start, segs: out.length ? out : pass2 };
  }

  // Fits a run of grid vertices (closed loop or open chain with fixed ends) -> { start, segs }.
  function fitPolyline(px, py, closed, settings) {
    const n = px.length;
    const segs = [];
    if (n < 2) return { start: [px[0], py[0]], segs };
    const corners = findCorners(px, py, n, closed, settings);
    const cidx = [];
    if (!closed) { cidx.push(0); for (let i = 1; i < n - 1; i++) if (corners[i]) cidx.push(i); cidx.push(n - 1); }
    else for (let i = 0; i < n; i++) if (corners[i]) cidx.push(i);
    const smooth = Math.max(0, settings.smooth - 1);
    // kept in grid units on purpose: scaling it with the 4x reconstruction measured worse (0.29 vs 0.25 px)
    const dpTol = settings.iconLogoMode ? 0.55 : 0.25;

    if (closed && !cidx.length) {
      // start at a direction change so no straight run is split in two
      let s0 = 0;
      const d0 = (i) => { const p = i % n, q = (i + 1) % n; return (px[q] - px[p]) * 3 + (py[q] - py[p]); };
      for (let i = 0; i < n; i++) if (d0(i) !== d0(i + n - 1)) { s0 = i; break; }
      let xs = [], ys = [];
      runMids(px, py, s0, s0 + n, n, xs, ys);
      if (xs.length < 4) { xs.length = 0; ys.length = 0; for (let i = 0; i < n; i++) { const j = (i + 1) % n; xs.push((px[i] + px[j]) / 2); ys.push((py[i] + py[j]) / 2); } }
      smoothClosed(xs, ys, smooth);
      if (xs.length > 8) {
        const dp = simplifyDP(xs, ys, dpTol * 0.65, true);
        if (dp.xs.length >= 4) { xs = dp.xs; ys = dp.ys; }
      }
      const m = xs.length, half = m >> 1;
      const X = xs.concat([xs[0]]), Y = ys.concat([ys[0]]);
      const tA = norm(xs[1] - xs[m - 1], ys[1] - ys[m - 1]);
      const tB = norm(xs[half + 1] - xs[half - 1], ys[half + 1] - ys[half - 1]);
      fitCubic(X, Y, 0, half, tA, [-tB[0], -tB[1]], settings.err, segs, 0);
      fitCubic(X, Y, half, m, tB, [-tA[0], -tA[1]], settings.err, segs, 0);
      return postSimplifySegs([X[0], Y[0]], segs, closed, settings);
    }
    const count = closed ? cidx.length : cidx.length - 1;
    for (let c = 0; c < count; c++) {
      const a = cidx[c], b = closed ? (c + 1 < cidx.length ? cidx[c + 1] : cidx[0] + n) : cidx[c + 1];
      let xs = [px[a % n]], ys = [py[a % n]];
      runMids(px, py, a, b, n, xs, ys);
      xs.push(px[b % n]); ys.push(py[b % n]);
      smoothOpen(xs, ys, smooth);
      if (xs.length > 4) {
        const dp = simplifyDP(xs, ys, dpTol, false);
        xs = dp.xs; ys = dp.ys;
      }
      const last = xs.length - 1;
      if (last === 1) {
        segs.push({ l: [xs[1], ys[1]] });
      } else {
        fitCubic(xs, ys, 0, last, endTangent(xs, ys, 0, 1, last), endTangent(xs, ys, last, -1, 0), settings.err, segs, 0);
      }
    }
    return postSimplifySegs([px[cidx[0] % n], py[cidx[0] % n]], segs, closed, settings);
  }

  function reverseFit(f) {
    const pts = [f.start];
    for (const s of f.segs) pts.push(s.l ? [s.l[0], s.l[1]] : [s.c[4], s.c[5]]);
    const segs = [];
    for (let i = f.segs.length - 1; i >= 0; i--) {
      const s = f.segs[i], to = pts[i];
      segs.push(s.l ? { l: [to[0], to[1]] } : { c: [s.c[2], s.c[3], s.c[0], s.c[1], to[0], to[1]] });
    }
    return { start: pts[pts.length - 1], segs };
  }

  // ---------------- 6a. cutouts: shared boundary graph ----------------
  function traceCutouts(labels, w, h, settings, comp, queue, say) {
    const W = w + 1;
    labelComponents(labels, w, h, comp, queue, null);
    const ed = buildEdges(labels, w, h);
    const lab = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? OUTSIDE : labels[y * w + x];
    const isJunction = (v) => {
      const x = v % W, y = (v / W) | 0;
      const a = lab(x - 1, y - 1), b = lab(x, y - 1), c = lab(x - 1, y), d = lab(x, y);
      let k = 1;
      if (b !== a) k++;
      if (c !== a && c !== b) k++;
      if (d !== a && d !== b && d !== c) k++;
      if (k >= 3) return true;
      return k === 2 && a === d && b === c && a !== b;
    };
    const edgeKey = (u, v) => { const a = Math.min(u, v), b = Math.max(u, v); return b - a === 1 ? a * 2 : a * 2 + 1; };
    const fitted = new Map();
    const shapes = new Map(); // comp -> { label, contours, area }
    let loops = 0, nodes = 0;
    const vx = (v) => v % W, vy = (v) => (v / W) | 0;

    walkLoops(ed, w, h, (buf, n, rx, ry) => {
      loops++;
      if (loops % 400 === 0) say(null, "Tracing shared borders…");
      const cell = ry * w + rx, cid = comp[cell];
      let area = 0;
      for (let i = 0; i < n; i++) { const a = buf[i], b = buf[(i + 1) % n]; area += vx(a) * vy(b) - vx(b) * vy(a); }
      // break the loop into chains at junction vertices
      const J = [];
      for (let i = 0; i < n; i++) if (isJunction(buf[i])) J.push(i);
      const chains = [];
      if (!J.length) {
        let m = 0;
        for (let i = 1; i < n; i++) if (buf[i] < buf[m]) m = i;
        const verts = new Int32Array(n + 1);
        for (let i = 0; i <= n; i++) verts[i] = buf[(m + i) % n];
        chains.push({ verts, closed: true });
      } else {
        for (let j = 0; j < J.length; j++) {
          const a = J[j], b = j + 1 < J.length ? J[j + 1] : J[0] + n;
          const verts = new Int32Array(b - a + 1);
          for (let i = a; i <= b; i++) verts[i - a] = buf[i % n];
          chains.push({ verts, closed: false });
        }
      }
      const contour = { start: null, segs: [] };
      for (const ch of chains) {
        const V = ch.verts, m = V.length - 1;
        const e1 = edgeKey(V[0], V[1]), e2 = edgeKey(V[m - 1], V[m]);
        const forward = e1 < e2 || (e1 === e2 && V[0] < V[m]);
        const key = Math.min(e1, e2);
        let f = fitted.get(key);
        if (!f) {
          const seq = forward ? V : V.slice().reverse();
          let pxs, pys;
          if (ch.closed) { pxs = new Float64Array(m); pys = new Float64Array(m); for (let i = 0; i < m; i++) { pxs[i] = vx(seq[i]); pys[i] = vy(seq[i]); } }
          else { pxs = new Float64Array(m + 1); pys = new Float64Array(m + 1); for (let i = 0; i <= m; i++) { pxs[i] = vx(seq[i]); pys[i] = vy(seq[i]); } }
          // v2: a loop that is entirely a small shape (one closed chain) gets the smoother fit
          f = fitPolyline(pxs, pys, ch.closed, (ch.closed && settings.small && Math.abs(area) / 2 < SMALL_AREA * settings.scale * settings.scale) ? settings.small : settings);
          if (ch.closed) f = { start: f.start, segs: f.segs, closed: true };
          fitted.set(key, f);
          nodes += f.segs.length;
        }
        const use = forward ? f : reverseFit(f);
        if (!contour.start) contour.start = use.start;
        for (const s of use.segs) contour.segs.push(s);
      }
      let sh = shapes.get(cid);
      if (!sh) { sh = { label: labels[cell], contours: [], area: 0 }; shapes.set(cid, sh); }
      if (area > 0) { sh.contours.unshift(contour); sh.area += area / 2; } else sh.contours.push(contour);
    });
    return { shapes, nodes };
  }

  // ---------------- 6b. stacked ----------------
  function traceStacked(labels, w, h, order, settings, comp, queue, say) {
    const n = w * h, mask = new Uint8Array(n), mlab = new Uint8Array(n);
    const rank = new Int16Array(256).fill(-1);
    order.forEach((l, r) => { rank[l] = r; });
    const out = [];
    let nodes = 0;
    for (let r = 0; r < order.length; r++) {
      say(0.45 + 0.5 * (r / order.length), "Tracing shapes…");
      for (let i = 0; i < n; i++) { const l = labels[i]; const on = l !== TRANSPARENT && rank[l] >= r ? 1 : 0; mask[i] = on; mlab[i] = on; }
      labelComponents(mlab, w, h, comp, queue, mask);
      const ed = buildEdges(mlab, w, h);
      // only keep edges around the mask (the "0" region is not drawn)
      const W = w + 1;
      for (let y = 0; y <= h; y++) for (let x = 0; x <= w; x++) {
        const v = y * W + x;
        let e = ed[v];
        if (!e) continue;
        if ((e & 1) && !(y < h && x < w && mask[y * w + x])) e &= ~1;
        if ((e & 2) && !(y < h && x > 0 && mask[y * w + x - 1])) e &= ~2;
        if ((e & 4) && !(y > 0 && x > 0 && mask[(y - 1) * w + x - 1])) e &= ~4;
        if ((e & 8) && !(y > 0 && x < w && mask[(y - 1) * w + x])) e &= ~8;
        ed[v] = e;
      }
      const shapes = new Map();
      walkLoops(ed, w, h, (buf, len, rx, ry) => {
        const cid = comp[ry * w + rx];
        const pxs = new Float64Array(len), pys = new Float64Array(len);
        let area = 0;
        for (let i = 0; i < len; i++) { pxs[i] = buf[i] % W; pys[i] = (buf[i] / W) | 0; }
        for (let i = 0; i < len; i++) { const j = (i + 1) % len; area += pxs[i] * pys[j] - pxs[j] * pys[i]; }
        const f = fitPolyline(pxs, pys, true, (settings.small && Math.abs(area) / 2 < SMALL_AREA * settings.scale * settings.scale) ? settings.small : settings);
        nodes += f.segs.length;
        let sh = shapes.get(cid);
        if (!sh) { sh = { contours: [], area: 0 }; shapes.set(cid, sh); }
        if (area > 0) { sh.contours.unshift(f); sh.area += area / 2; } else sh.contours.push(f);
      });
      out.push({ label: order[r], shapes: Array.from(shapes.values()).filter((s) => s.contours.length).sort((a, b) => b.area - a.area) });
    }
    return { layers: out, nodes };
  }

  // ---------------- main entry ----------------
  const DETAIL = [
    { minArea: 40, err: 2.0, smooth: 3 },
    { minArea: 16, err: 1.25, smooth: 2 },
    { minArea: 6, err: 0.8, smooth: 2 },
    { minArea: 3, err: 0.55, smooth: 1 },
    { minArea: 1, err: 0.35, smooth: 1 }
  ];
  const CORNER_DEG = [105, 75, 56, 42, 30];

  function createSession(img) {
    const w = img.width, h = img.height, n = w * h;
    const data = img.data;
    const quantCache = new Map();
    let comp = null, queue = null, hiComp = null, hiQueue = null, reconCache = null;

    function quant(opts, say, recon) {
      const binFlag = opts.iconLogoMode !== false ? 1 : 0;
      const key = (opts.centers ? "c:" + opts.centers.map((c) => c.map((v) => v.toFixed(2)).join(",")).join(";") : "k:" + (opts.colors | 0)) + ":b" + binFlag + ":r" + (recon ? 1 : 0);
      if (quantCache.has(key)) return quantCache.get(key);
      say(0.04, "Binarizing & smoothing edges…");
      let srcData = recon ? bilateralFilter(data, w, h, 2, 1.5, 28) : data;
      if (!img.__binarized && opts.iconLogoMode !== false) {
        const copy = new Uint8ClampedArray(srcData);
        binarizeImageData({ width: w, height: h, data: copy }, opts);
        srcData = copy;
      }
      const filtered = snnFilter(srcData, w, h);
      say(0.1, "Finding colors…");
      let centers;
      if (opts.centers && opts.centers.length) centers = opts.centers.map((c) => c.slice());
      else {
        const bins = buildBins(filtered, n);
        centers = opts.colors > 0 ? fixedPalette(bins, opts.colors) : autoPalette(bins);
      }
      const lut = new Int16Array(32768).fill(-1);
      const labels = new Uint8Array(n);
      for (let i = 0, p = 0; i < n; i++, p += 4) {
        if (srcData[p + 3] < 128) { labels[i] = TRANSPARENT; continue; }
        const k = ((filtered[p] >> 3) << 10) | ((filtered[p + 1] >> 3) << 5) | (filtered[p + 2] >> 3);
        let l = lut[k];
        if (l < 0) { l = nearest([(filtered[p] & 248) + 4, (filtered[p + 1] & 248) + 4, (filtered[p + 2] & 248) + 4], centers); lut[k] = l; }
        labels[i] = l;
      }
      say(0.2, "Cleaning blended edges…");
      dehalo(labels, filtered, w, h, centers, 2);
      say(0.25, "Cleaning edges…"); edgeVote(labels, filtered, w, h, centers, 2);
      const counts = new Array(centers.length).fill(0);
      for (let i = 0; i < n; i++) if (labels[i] !== TRANSPARENT) counts[labels[i]]++;
      const q = { centers, labels, counts, key };
      quantCache.clear();
      quantCache.set(key, q);
      return q;
    }

    function trace(options, progress) {
      const opts = Object.assign({ colors: 0, detail: 2, corners: 2, layering: "cutouts", iconLogoMode: true, reconstruct: true, groups: null, transparent: [] }, options || {});
      const say = progress || function () {};
      const recon = opts.reconstruct !== false && Math.max(w, h) < RECON_MAX && w > 1 && h > 1;
      const S = recon ? RECON_SCALE : 1;
      const q = quant(opts, say, recon);
      const K = q.centers.length;
      const groupOf = opts.groups && opts.groups.length === K ? opts.groups : q.centers.map((_, i) => i);
      const G = Math.max(0, ...groupOf) + 1;
      // group colors: count-weighted mean of their member colors
      const gacc = Array.from({ length: G }, () => [0, 0, 0, 0]);
      q.centers.forEach((c, i) => { const a = gacc[groupOf[i]], wt = Math.max(1, q.counts[i]); a[0] += c[0] * wt; a[1] += c[1] * wt; a[2] += c[2] * wt; a[3] += wt; });
      const gcolor = gacc.map((a) => a[3] ? [a[0] / a[3], a[1] / a[3], a[2] / a[3]] : [0, 0, 0]);
      const transparent = new Set(opts.transparent || []);
      const stacked = opts.layering === "stacked";

      const labels = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const l = q.labels[i];
        if (l === TRANSPARENT) { labels[i] = TRANSPARENT; continue; }
        const g = groupOf[l];
        labels[i] = stacked && transparent.has(g) ? TRANSPARENT : g;
      }
      if (!comp || comp.length !== n) { comp = new Int32Array(n); queue = new Int32Array(n); }
      const det = DETAIL[Math.max(0, Math.min(4, opts.detail | 0))];
      say(0.3, "Removing specks…");
      removeSpecks(labels, w, h, Math.round(det.minArea * Math.max(1, Math.sqrt(n) / 420)), comp, queue);

      const border = new Map();
      const vote = (i) => { const l = labels[i]; if (l !== TRANSPARENT) border.set(l, (border.get(l) || 0) + 1); };
      for (let x = 0; x < w; x++) { vote(x); vote((h - 1) * w + x); }
      for (let y = 0; y < h; y++) { vote(y * w); vote(y * w + w - 1); }
      let bg = -1, bv = 0;
      border.forEach((v, l) => { if (v > bv) { bv = v; bg = l; } });
      // cluster most often found along the picture's edge (for "remove background")
      const bcount = new Array(K).fill(0);
      for (let x = 0; x < w; x++) { const a = q.labels[x], b = q.labels[(h - 1) * w + x]; if (a !== TRANSPARENT) bcount[a]++; if (b !== TRANSPARENT) bcount[b]++; }
      for (let y = 0; y < h; y++) { const a = q.labels[y * w], b = q.labels[y * w + w - 1]; if (a !== TRANSPARENT) bcount[a]++; if (b !== TRANSPARENT) bcount[b]++; }
      let bgCluster = -1, bcv = 0;
      bcount.forEach((v, i) => { if (v > bcv) { bcv = v; bgCluster = i; } });

      let tl = labels, tw = w, th = h, tc = comp, tq = queue;
      if (recon) {
        tw = w * S; th = h * S;
        if (!hiComp || hiComp.length !== tw * th) { hiComp = new Int32Array(tw * th); hiQueue = new Int32Array(tw * th); }
        tc = hiComp; tq = hiQueue;
        // the 4x map depends only on the source labels, so slider changes reuse it
        const reconKey = q.key + "|" + groupOf.join(",") + "|" + (stacked ? Array.from(transparent).join(",") : "") + "|" + det.minArea;
        if (reconCache && reconCache.key === reconKey) tl = reconCache.labels;
        else {
          say(0.34, "Reconstructing edges…");
          tl = reconstructLabels(labels, w, h, S);
          removeSpecks(tl, tw, th, (S * S) >> 1, tc, tq);
          reconCache = { key: reconKey, labels: tl };
        }
      }

      const counts = new Array(G).fill(0);
      for (let i = 0; i < tl.length; i++) if (tl[i] !== TRANSPARENT) counts[tl[i]]++;
      if (S > 1) for (let g = 0; g < G; g++) counts[g] = counts[g] ? Math.max(1, Math.round(counts[g] / (S * S))) : 0;
      const order = counts.map((c, i) => i).filter((i) => counts[i] > 0).sort((a, b) => counts[b] - counts[a]);
      const smoothMode = !!opts.iconLogoMode;
      const baseErr = det.err * det.err * (smoothMode ? 2.25 : 1) * (recon ? S * S * RECON_ERR : 1);
      const baseSmooth = det.smooth + (smoothMode ? 2 : 0);
      const settings = { err: baseErr, smooth: baseSmooth, cornerDeg: CORNER_DEG[Math.max(0, Math.min(4, opts.corners | 0))], iconLogoMode: smoothMode, scale: S };
      // v2: small shapes get a looser, smoother fit with fewer corners
      settings.small = { err: settings.err * 4, smooth: settings.smooth + 2, cornerDeg: Math.min(150, Math.max(settings.cornerDeg + 30, 100)), iconLogoMode: smoothMode, scale: S };

      let layers = [], nodes = 0;
      if (stacked) {
        const r = traceStacked(tl, tw, th, order, settings, tc, tq, say);
        nodes = r.nodes;
        layers = r.layers.map((L) => ({ group: L.label, color: hex(gcolor[L.label]), transparent: false, shapes: L.shapes }));
      } else {
        say(0.45, "Tracing shared borders…");
        const r = traceCutouts(tl, tw, th, settings, tc, tq, say);
        nodes = r.nodes;
        const byLabel = new Map();
        r.shapes.forEach((s) => {
          if (s.label === TRANSPARENT) return;
          if (!byLabel.has(s.label)) byLabel.set(s.label, []);
          byLabel.get(s.label).push({ contours: s.contours, area: s.area });
        });
        layers = order.filter((g) => byLabel.has(g)).map((g) => ({
          group: g, color: hex(gcolor[g]), transparent: transparent.has(g),
          shapes: byLabel.get(g).sort((a, b) => b.area - a.area)
        }));
      }
      if (S > 1) layers.forEach((L) => { L.shapes = scaleShapes(L.shapes, 1 / S); });
      say(1, "Done");
      const shapesTotal = layers.reduce((a, L) => a + (L.transparent ? 0 : L.shapes.length), 0);
      return {
        width: w, height: h,
        layering: stacked ? "stacked" : "cutouts",
        clusters: q.centers.map((c, i) => ({ color: hex(c), rgb: c.slice(), count: q.counts[i] })),
        groupColors: gcolor.map(hex),
        backgroundGroup: bg, backgroundCluster: bgCluster,
        palette: order.map((g) => ({ group: g, color: hex(gcolor[g]), count: counts[g] })),
        layers,
        stats: { colors: order.filter((g) => !transparent.has(g)).length, shapes: shapesTotal, nodes }
      };
    }
    return { trace, width: w, height: h };
  }

  function trace(img, options, progress) { return createSession(img).trace(options, progress); }

  // ---------------- serialisers ----------------
  function f(v) { return (Math.round(v * 100) / 100).toString(); }
  function contourToPath(c, s) {
    let d = "M" + f(c.start[0] * s) + " " + f(c.start[1] * s);
    for (const g of c.segs) {
      if (g.l) d += "L" + f(g.l[0] * s) + " " + f(g.l[1] * s);
      else d += "C" + f(g.c[0] * s) + " " + f(g.c[1] * s) + " " + f(g.c[2] * s) + " " + f(g.c[3] * s) + " " + f(g.c[4] * s) + " " + f(g.c[5] * s);
    }
    return d + "Z";
  }
  function shapeToPath(shape, s) { return shape.contours.map((c) => contourToPath(c, s || 1)).join(""); }

  function visibleShapes(result, o) {
    const out = [];
    result.layers.forEach((layer, li) => {
      const transparent = o.transparent ? o.transparent.has(li) : layer.transparent;
      if (transparent) return;
      const color = (o.colors && o.colors[li]) || layer.color;
      layer.shapes.forEach((shape, si) => { if (!o.hidden || !o.hidden.has(li + ":" + si)) out.push({ li, si, shape, color }); });
    });
    return out;
  }
  // Exports are fill-only: no strokes, no gap strokes (Illustrator-safe).
  function sanitizeExport(text, fmt) {
    if (fmt === "svg") return text.replace(/\s(stroke(-[a-z]+)?)="[^"]*"/g, "").replace(/<(g|path)(?=[\s>\/])/g, '<$1 stroke="none"');
    if (fmt === "eps" || fmt === "pdf") return text.split("\n").filter((l) => !/(setlinewidth|setlinejoin|setlinecap|\bstroke\b|\bRG\b|\bw$|^S$|^1 J 1 j$)/.test(l)).join("\n");
    return text;
  }

  function toSVG(result, o) {
    o = o || {};
    const W = o.width || result.width, H = o.height || result.height;
    let body = "", current = null;
    for (const it of visibleShapes(result, o)) {
      if (current !== it.li) {
        if (current !== null) body += "</g>\n";
        body += `<g fill="${it.color}" stroke="none">`;
        current = it.li;
      }
      body += `<path fill-rule="evenodd" d="${shapeToPath(it.shape, 1)}"/>`;
    }
    if (current !== null) body += "</g>\n";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="${W}px" height="${H}px" viewBox="0 0 ${result.width} ${result.height}" preserveAspectRatio="none">\n${body}</svg>\n`;
    return sanitizeExport(svg, "svg");
  }

  function rgb01(hx) { return [1, 3, 5].map((i) => parseInt(hx.substr(i, 2), 16) / 255); }
  function psPath(shape, s, H, ops, sy, W) {
    sy = sy || s;
    const X = (v) => f(Math.min(Math.max(v * s, 0), W === undefined ? Infinity : W));
    const Y = (v) => f(Math.min(Math.max(H - v * sy, 0), H));
    let out = "";
    for (const c of shape.contours) {
      out += X(c.start[0]) + " " + Y(c.start[1]) + " " + ops.m + "\n";
      for (const g of c.segs) {
        if (g.l) out += X(g.l[0]) + " " + Y(g.l[1]) + " " + ops.l + "\n";
        else out += X(g.c[0]) + " " + Y(g.c[1]) + " " + X(g.c[2]) + " " + Y(g.c[3]) + " " + X(g.c[4]) + " " + Y(g.c[5]) + " " + ops.c + "\n";
      }
      out += ops.h + "\n";
    }
    return out;
  }
  function toPDF(result, o) {
    o = o || {};
    const W = o.width || result.width, H = o.height || result.height, s = W / result.width, sy = H / result.height;
    let content = "";
    for (const it of visibleShapes(result, o)) {
      const [r, g, b] = rgb01(it.color);
      content += `${f(r)} ${f(g)} ${f(b)} rg\n`;
      content += psPath(it.shape, s, H, { m: "m", l: "l", c: "c", h: "h" }, sy, W);
      content += "f*\n";
    }
    const objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(W)} ${f(H)}] /Contents 4 0 R /Resources << >> >>`,
      `<< /Length ${content.length} >>\nstream\n${content}endstream`
    ];
    let pdf = "%PDF-1.4\n";
    const offs = [];
    objs.forEach((ob, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${ob}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((v) => String(v).padStart(10, "0") + " 00000 n \n").join("");
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return pdf;
  }
  function toEPS(result, o) {
    o = o || {};
    const W = o.width || result.width, H = o.height || result.height, s = W / result.width, sy = H / result.height;
    let ps = `%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${Math.round(W)} ${Math.round(H)}\n%%HiResBoundingBox: 0 0 ${W.toFixed(4)} ${H.toFixed(4)}\n%%Creator: Revector\n%%Pages: 1\n%%LanguageLevel: 2\n%%EndComments\n%%EndProlog\n%%Page: 1 1\n`;
    for (const it of visibleShapes(result, o)) {
      const [r, g, b] = rgb01(it.color);
      ps += `${f(r)} ${f(g)} ${f(b)} setrgbcolor newpath\n`;
      ps += psPath(it.shape, s, H, { m: "moveto", l: "lineto", c: "curveto", h: "closepath" }, sy, W);
      ps += "eofill\n";
    }
    return sanitizeExport(ps + "showpage\n%%Trailer\n%%EOF\n", "eps");
  }
  function flatten(c, s, H) {
    const pts = [[c.start[0] * s, H - c.start[1] * s]];
    let px = c.start[0], py = c.start[1];
    for (const g of c.segs) {
      if (g.l) { pts.push([g.l[0] * s, H - g.l[1] * s]); px = g.l[0]; py = g.l[1]; continue; }
      const b = [px, py, g.c[0], g.c[1], g.c[2], g.c[3], g.c[4], g.c[5]];
      const steps = Math.max(2, Math.min(24, Math.ceil(Math.hypot(b[6] - b[0], b[7] - b[1]) * s / 2)));
      for (let i = 1; i <= steps; i++) { const p = bez(b, i / steps); pts.push([p[0] * s, H - p[1] * s]); }
      px = g.c[4]; py = g.c[5];
    }
    return pts;
  }
  function toDXF(result, o) {
    o = o || {};
    const W = o.width || result.width, H = o.height || result.height, s = W / result.width;
    const L = [];
    const add = (code, val) => { L.push(String(code), String(val)); };
    add(0, "SECTION"); add(2, "HEADER"); add(9, "$INSUNITS"); add(70, 0); add(9, "$EXTMIN"); add(10, 0); add(20, 0); add(9, "$EXTMAX"); add(10, f(W)); add(20, f(H)); add(0, "ENDSEC");
    add(0, "SECTION"); add(2, "ENTITIES");
    for (const it of visibleShapes(result, o)) {
      const layer = "COLOR_" + it.color.slice(1).toUpperCase();
      for (const c of it.shape.contours) {
        add(0, "POLYLINE"); add(8, layer); add(66, 1); add(70, 1);
        for (const p of flatten(c, s, H)) { add(0, "VERTEX"); add(8, layer); add(10, f(p[0])); add(20, f(p[1])); }
        add(0, "SEQEND"); add(8, layer);
      }
    }
    add(0, "ENDSEC"); add(0, "EOF");
    return L.join("\r\n") + "\r\n";
  }

  global.ptSegDistSq = ptSegDistSq;
  global.Revector = { trace, createSession, toSVG, toPDF, toEPS, toDXF, shapeToPath, contourToPath, sanitizeExport, binarizeImageData, binarizeCanvas, ptSegDistSq, simplifyDP, postSimplifySegs };
})(typeof self !== "undefined" ? self : globalThis);
