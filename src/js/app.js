/* Home page behaviour: the example inspector and the offline converter. */
(function () {
  "use strict";
  const R = window.Revector, EX = window.RevectorExamples;
  if (!R) return;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const T = (s) => (window.t ? window.t(s) : s);

  function imageDataOf(canvas) { return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height); }

  function svgFrom(result, o) {
    o = o || {};
    const parts = [];
    result.layers.forEach((layer, li) => {
      const col = (o.colors && o.colors[li]) || layer.color;
      const attrs = o.strokes ? `fill="none" stroke="${o.stroke || col}" stroke-width="${o.width || 1}" vector-effect="non-scaling-stroke"` : `fill="${col}"`;
      parts.push(`<g data-layer="${li}" ${attrs}>`);
      layer.shapes.forEach((shape, si) => {
        const k = li + ":" + si;
        const hidden = o.hidden && o.hidden.has(k);
        parts.push(`<path data-k="${k}"${hidden ? ' style="display:none"' : ""} d="${R.shapeToPath(shape, 1)}"${o.strokes ? ' vector-effect="non-scaling-stroke"' : ""}/>`);
      });
      parts.push("</g>");
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${result.width} ${result.height}" width="${result.width}" height="${result.height}" fill-rule="evenodd" preserveAspectRatio="none">${parts.join("")}</svg>`;
  }

  // ======================= Example inspector =======================
  const insp = $("[data-inspector]");
  if (insp && EX) {
    const stage = $("[data-stage]", insp), views = $$("[data-view]", stage), loupe = $(".loupe", stage), loupeView = $("[data-loupe]", stage);
    const zoom = $("[data-zoom]", insp), fileLabel = $("[data-inspector-file]", insp), list = $("[data-examples]", insp);
    const st = { i: EX.defaultIndex, canvas: null, result: null, cx: 0, cy: 0, zoomV: +zoom.value, seam: 0.5, dy: 0, s: 1, tx: 0, ty: 0 };
    const cache = new Map();

    function exampleData(i) {
      if (!cache.has(i)) {
        const ex = EX.list[i], canvas = EX.render(ex, 3);
        cache.set(i, { canvas, result: R.trace(imageDataOf(canvas), { colors: 0, detail: 3, corners: 2, layering: "stacked" }) });
      }
      return cache.get(i);
    }

    function layout() {
      if (!st.canvas) return;
      const sw = stage.clientWidth, sh = stage.clientHeight, w = st.canvas.width, h = st.canvas.height;
      const fit = Math.max(sw / w, sh / h);
      const z = Math.pow(5, st.zoomV / 100);
      st.s = fit * z;
      st.tx = clamp(sw / 2 - st.cx * st.s, sw - w * st.s, 0);
      st.ty = clamp(sh / 2 - st.cy * st.s, sh - h * st.s, 0);
      st.cx = (sw / 2 - st.tx) / st.s; st.cy = (sh / 2 - st.ty) / st.s;
      const tf = `translate(${st.tx}px,${st.ty}px) scale(${st.s})`;
      views.forEach((v) => { v.style.width = w + "px"; v.style.height = h + "px"; v.style.transform = tf; });
      stage.style.setProperty("--seam", st.seam * 100 + "%");
      const ly = sh / 2 + st.dy;
      loupe.style.top = ly + "px";
      const m = st.s * 1.6, half = loupe.clientWidth / 2;
      const ix = (st.seam * sw - st.tx) / st.s, iy = (ly - st.ty) / st.s;
      loupeView.style.width = w * m + "px"; loupeView.style.height = h * m + "px";
      loupeView.style.transform = `translate(${half - ix * m}px,${half - iy * m}px)`;
      const pct = Math.round(st.seam * 100);
      loupe.setAttribute("aria-valuenow", pct); loupe.setAttribute("aria-valuetext", pct + "% pixels");
    }

    function select(i) {
      st.i = i;
      const ex = EX.list[i], d = exampleData(i);
      st.canvas = d.canvas; st.result = d.result;
      st.cx = ex.w * ex.focus[0]; st.cy = ex.h * ex.focus[1];
      fileLabel.textContent = `${ex.name}.png  ·  ${ex.w} × ${ex.h}`;
      const img = (src, cls) => { const im = new Image(ex.w, ex.h); im.alt = ""; im.className = cls || ""; im.draggable = false; im.src = src; return im; };
      const pixUrl = d.canvas.toDataURL("image/png");
      views[0].replaceChildren(img(pixUrl, "px"));
      views[1].replaceChildren(img("data:image/svg+xml;charset=utf-8," + encodeURIComponent(R.toSVG(d.result))));
      loupeView.replaceChildren(img(pixUrl, "px"));
      loupeView.insertAdjacentHTML("beforeend", svgFrom(d.result, { strokes: true, stroke: "#00d8ff", width: 1.6 }));
      $$("button", list).forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
      layout();
    }

    EX.list.forEach((ex, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button"; b.className = "example"; b.title = ex.name.replace(/-/g, " ");
      b.setAttribute("aria-label", "Show example: " + b.title); b.setAttribute("aria-pressed", "false");
      const t = document.createElement("canvas"), size = 112, sc = size / Math.max(ex.w, ex.h);
      t.width = size; t.height = size;
      const c = t.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, size, size);
      c.translate((size - ex.w * sc) / 2, (size - ex.h * sc) / 2); c.scale(sc, sc); ex.draw(c, ex.w, ex.h);
      const ti = new Image(56, 56); ti.alt = ""; ti.src = t.toDataURL("image/png"); b.appendChild(ti);
      b.addEventListener("click", () => select(i));
      li.appendChild(b); list.appendChild(li);
    });

    // pan the picture
    let drag = null;
    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".loupe")) return;
      drag = { x: e.clientX, y: e.clientY, cx: st.cx, cy: st.cy };
      stage.setPointerCapture(e.pointerId); stage.classList.add("dragging");
    });
    stage.addEventListener("pointermove", (e) => {
      if (!drag) return;
      st.cx = drag.cx - (e.clientX - drag.x) / st.s; st.cy = drag.cy - (e.clientY - drag.y) / st.s; layout();
    });
    const endDrag = () => { drag = null; stage.classList.remove("dragging"); };
    stage.addEventListener("pointerup", endDrag); stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("dblclick", () => { st.zoomV = st.zoomV > 50 ? 26 : 80; zoom.value = st.zoomV; layout(); });
    stage.addEventListener("dragstart", (e) => e.preventDefault());

    // move the divider with the loupe
    let ld = null;
    loupe.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      ld = { x: e.clientX, y: e.clientY, seam: st.seam, dy: st.dy };
      loupe.setPointerCapture(e.pointerId);
    });
    loupe.addEventListener("pointermove", (e) => {
      if (!ld) return;
      const sw = stage.clientWidth, sh = stage.clientHeight, r = loupe.clientWidth / 2;
      st.seam = clamp(ld.seam + (e.clientX - ld.x) / sw, 0, 1);
      st.dy = clamp(ld.dy + (e.clientY - ld.y), -sh / 2 + r * 0.5, sh / 2 - r * 0.5);
      layout();
    });
    const endL = () => { ld = null; };
    loupe.addEventListener("pointerup", endL); loupe.addEventListener("pointercancel", endL);
    loupe.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 0.1 : 0.02;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") st.seam = clamp(st.seam - step, 0, 1);
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") st.seam = clamp(st.seam + step, 0, 1);
      else if (e.key === "Home") st.seam = 0; else if (e.key === "End") st.seam = 1; else return;
      e.preventDefault(); layout();
    });
    zoom.addEventListener("input", () => { st.zoomV = +zoom.value; layout(); });
    window.addEventListener("resize", () => requestAnimationFrame(layout));
    $("[data-try]", insp).addEventListener("click", (e) => {
      e.preventDefault();
      const ex = EX.list[st.i];
      App.openCanvas(EX.render(ex), ex.name + ".png");
    });
    select(st.i);
  }

  // ======================= Converter app =======================
  const App = (function () {
    const root = $("#app");
    const input = $("#file-input");
    const canvasEl = $("[data-app-canvas]", root), pixLayer = $('[data-app-layer="pix"]', root), vecLayer = $('[data-app-layer="vec"]', root);
    const progress = $("[data-progress]", root), progText = $("[data-progress-text]", root), progBar = $("[data-progress-bar]", root);
    const statsEl = $("[data-stats]", root), swatches = $("[data-swatches]", root), fileEl = $("[data-app-file]", root);
    const pop = $("[data-swatch-pop]", root), mergeBar = $("[data-merge-bar]", root);
    const cropBox = $("[data-crop-box]", root);
    const statusEls = $$(".dropzone-status");
    // Pictures are traced at their own size; only pictures larger than this on a side are reduced.
    const MAX = 4096;
    const st = {
      name: "image", orig: null, trace: null, imageId: 0, result: null,
      clusters: null, cells: [], hidden: new Set(),
      mode: "split", view: { s: 1, tx: 0, ty: 0 }, seam: 0.5,
      opts: { colors: 0, detail: 2, corners: 2, layering: "cutouts", iconLogoMode: false, shapes: true },
      pick: -1, history: [], hIdx: -1, pendingHidden: null, commitOnDone: false,
      gapFill: true, strokes: false, edit: false, crop: false, job: 0, needFit: false,
      symmetry: false, merging: false, selected: new Set()
    };
    let worker = null, workerOk = true, localSession = null, sentImage = -1, workerFail = null;
    let showError = () => {}, showNetwork = () => {}, showFatal = () => {};

    function status(text) { statusEls.forEach((el) => { el.textContent = text || ""; }); }
    function mirror(img) {
      const { width: w, height: h, data: d } = img;
      for (let y = 0; y < h; y++) for (let x = 0; x < (w >> 1); x++) {
        const a = (y * w + x) * 4, b = (y * w + (w - 1 - x)) * 4;
        for (let k = 0; k < 4; k++) { const v = (d[a + k] + d[b + k]) >> 1; d[a + k] = v; d[b + k] = v; }
      }
    }
    function getWorker() {
      if (!workerOk) return null;
      if (!worker) {
        try { worker = new Worker("/assets/js/worker.js"); worker.onerror = () => { workerOk = false; worker = null; sentImage = -1; showNetwork(); const f = workerFail; workerFail = null; if (f) f(); }; }
        catch (e) { workerOk = false; worker = null; }
      }
      return worker;
    }
    function showProgress(p, text) {
      progress.classList.add("on");
      if (text) progText.textContent = (window.t ? window.t(text) : text);
      if (typeof p === "number") progBar.style.width = Math.round(p * 100) + "%";
    }

    // ---------- palette cells ----------
    const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
    const rgb2hex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
    function cellColorFromMembers(members) {
      let r = 0, g = 0, b = 0, t = 0;
      members.forEach((k) => { const c = st.clusters[k], w = Math.max(1, c.count); r += c.rgb[0] * w; g += c.rgb[1] * w; b += c.rgb[2] * w; t += w; });
      return rgb2hex([r / t, g / t, b / t]);
    }
    function groupsFromCells() {
      const g = st.clusters.map(() => 0);
      st.cells.forEach((cell, ci) => cell.members.forEach((k) => { g[k] = ci; }));
      return g;
    }
    function cellOfLayer(layer) { return st.cells[layer.group]; }
    function layerColors() { return st.result.layers.map((L) => (cellOfLayer(L) || {}).color || L.color); }
    function layerTransparent() { const s = new Set(); st.result.layers.forEach((L, li) => { const c = cellOfLayer(L); if (c && c.transparent) s.add(li); }); return s; }

    function run(resetPalette) {
      const id = ++st.job;
      if (resetPalette) st.needFit = true;
      const options = Object.assign({}, st.opts);
      if (!resetPalette && st.clusters) {
        options.centers = st.clusters.map((c) => c.rgb);
        options.groups = groupsFromCells();
        options.transparent = st.cells.map((c, i) => (c.transparent ? i : -1)).filter((i) => i >= 0);
      }
      showProgress(0.02, "Preparing…");
      const done = (result) => {
        if (id !== st.job) return;
        if (resetPalette || !st.clusters) {
          st.clusters = result.clusters;
          // one cell per color that survived; empty clusters ride along in the first cell
          st.cells = [];
          const used = result.clusters.map((c, i) => i).filter((i) => result.clusters[i].count > 0);
          used.forEach((k) => st.cells.push({ members: [k], color: result.clusters[k].color, transparent: false }));
          if (!st.cells.length) st.cells.push({ members: [0], color: result.clusters[0].color, transparent: false });
          result.clusters.forEach((c, k) => { if (!c.count) st.cells[0].members.push(k); });
          // groups of the first trace were cluster ids; trace again with the cell layout
          if (used.length !== result.clusters.length) { run(false); return; }
        }
        progress.classList.remove("on");
        st.result = result; st.hidden = st.pendingHidden || new Set(); st.pendingHidden = null;
        $("[data-opt=removeBg]", root).checked = bgCell() ? bgCell().transparent : false;
        render(); renderSwatches(); if (st.needFit) { st.needFit = false; fit(); }
        if (st.commitOnDone || !st.history.length) { st.commitOnDone = false; commit(); }
      };
      const local = () => setTimeout(() => {
        if (id !== st.job) return;
        try {
          if (!localSession || localSession.id !== st.imageId) {
            const img = imageDataOf(st.trace); if (st.symmetry) mirror(img);
            localSession = R.createSession(img); localSession.id = st.imageId;
          }
          done(localSession.trace(options, () => {}));
        } catch (err) { showFatal(); }
      }, 30);
      const w = getWorker();
      if (!w) return local();
      if (sentImage !== st.imageId) {
        const img = imageDataOf(st.trace); if (st.symmetry) mirror(img);
        w.postMessage({ type: "image", imageId: st.imageId, image: { width: img.width, height: img.height, data: img.data } }, [img.data.buffer]);
        sentImage = st.imageId;
      }
      const onMsg = (e) => {
        if (e.data.id !== id) return;
        if (e.data.type === "progress") showProgress(e.data.p, e.data.text);
        else { w.removeEventListener("message", onMsg); workerFail = null; if (e.data.type === "done") done(e.data.result); else { sentImage = -1; local(); } }
      };
      w.addEventListener("message", onMsg);
      workerFail = () => { w.removeEventListener("message", onMsg); local(); };
      w.postMessage({ type: "trace", id, imageId: st.imageId, options });
    }

    function bgCell() {
      if (!st.result || st.result.backgroundCluster < 0) return null;
      return st.cells.find((c) => c.members.includes(st.result.backgroundCluster)) || null;
    }

    function buildSvg() {
      const r = st.result, colors = layerColors(), transp = layerTransparent();
      const outline = st.mode === "outline" || st.strokes;
      const gap = !outline && st.gapFill && r.layering === "cutouts";
      const parts = [];
      r.layers.forEach((layer, li) => {
        if (transp.has(li)) return;
        const col = colors[li];
        const attrs = outline ? `fill="none" stroke="${col}" stroke-width="1.2"`
          : gap ? `fill="${col}" stroke="${col}" stroke-width="1" stroke-linejoin="round"` : `fill="${col}"`;
        parts.push(`<g data-layer="${li}" ${attrs}>`);
        layer.shapes.forEach((shape, si) => {
          const k = li + ":" + si;
          parts.push(`<path data-k="${k}"${st.hidden.has(k) ? ' style="display:none"' : ""} d="${R.shapeToPath(shape, 1)}"${outline || gap ? ' vector-effect="non-scaling-stroke"' : ""}/>`);
        });
        parts.push("</g>");
      });
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r.width} ${r.height}" width="${r.width}" height="${r.height}" fill-rule="evenodd" preserveAspectRatio="none">${parts.join("")}</svg>`;
    }

    function render() {
      const r = st.result;
      if (!r) return;
      if (!pixLayer.firstChild || pixLayer.dataset.img !== String(st.imageId)) {
        const srcC = st.rawTrace || st.trace, pc = srcC.cloneNode(); pc.getContext("2d").drawImage(srcC, 0, 0);
        pixLayer.replaceChildren(pc); pixLayer.dataset.img = String(st.imageId);
      }
      vecLayer.innerHTML = buildSvg();
      [pixLayer, vecLayer].forEach((l) => { l.style.width = r.width + "px"; l.style.height = r.height + "px"; });
      canvasEl.classList.toggle("editing", st.edit);
      const transp = layerTransparent();
      const shown = r.layers.reduce((a, l, li) => a + (transp.has(li) ? 0 : l.shapes.filter((_, si) => !st.hidden.has(li + ":" + si)).length), 0);
      const colorsShown = st.cells.filter((c) => !c.transparent).length;
      statsEl.innerHTML = `${colorsShown} ${T("colors")} · ${shown} ${T("shapes")} · ${r.stats.nodes} ${T("curve segments")}<br>${st.orig.width} × ${st.orig.height} px${r.width !== st.orig.width ? ` (${T("traced at")} ${r.width} × ${r.height})` : " · " + T("traced at full size")}`;
      applyView();
    }

    // ---------- swatches, popover, merging ----------
    function swatchBackground(cell) {
      if (cell.transparent) return "";
      if (cell.members.length > 1) {
        const cols = cell.members.filter((k) => st.clusters[k].count > 0).map((k) => st.clusters[k].color);
        if (cols.length > 1) {
          const step = 100 / cols.length;
          const stops = cols.map((c, i) => `${c} ${(i * step).toFixed(1)}% ${((i + 1) * step).toFixed(1)}%`).join(",");
          return `linear-gradient(135deg, ${cell.color} 0 48%, transparent 48%), linear-gradient(135deg, ${stops})`;
        }
      }
      return cell.color;
    }
    function renderSwatches() {
      swatches.innerHTML = "";
      const total = st.cells.reduce((a, c) => a + c.members.reduce((b, k) => b + st.clusters[k].count, 0), 0) || 1;
      st.cells.forEach((cell, ci) => {
        const sw = document.createElement("button");
        sw.type = "button"; sw.className = "swatch" + (cell.transparent ? " is-transparent" : "") + (st.selected.has(ci) || st.pick === ci ? " is-selected" : "");
        const real = cell.members.filter((k) => st.clusters[k].count > 0);
        const cnt = real.reduce((a, k) => a + st.clusters[k].count, 0);
        const d = Math.round(Math.max(40, Math.min(104, 40 + 64 * Math.sqrt(cnt / total))));
        sw.style.setProperty("--d", d + "px");
        sw.style.background = cell.transparent ? "" : cell.color;
        sw.draggable = true; sw.dataset.cell = ci;
        sw.title = `${T("Color")} ${ci + 1}: ${cell.transparent ? T("transparent") : cell.color}${real.length > 1 ? ` (${real.length} ${T("colors merged")})` : ""}`;
        sw.setAttribute("aria-label", sw.title);
        sw.setAttribute("aria-pressed", st.selected.has(ci) || st.pick === ci ? "true" : "false");
        // merged source colours sit inside the output disc, sized by their share of it
        if (real.length > 1) real.forEach((k, j) => {
          const m = document.createElement("span"); m.className = "member";
          const md = Math.max(9, Math.round(d * 0.46 * Math.sqrt(st.clusters[k].count / cnt)));
          const ang = (j / real.length) * Math.PI * 2 - Math.PI / 2, rr = d * 0.24;
          Object.assign(m.style, { width: md + "px", height: md + "px", left: (d / 2 + Math.cos(ang) * rr - md / 2) + "px", top: (d / 2 + Math.sin(ang) * rr - md / 2) + "px", background: st.clusters[k].color });
          sw.appendChild(m);
        });
        sw.addEventListener("click", (e) => {
          e.stopPropagation();
          if (st.merging) { st.selected.has(ci) ? st.selected.delete(ci) : st.selected.add(ci); renderSwatches(); updateMergeBar(); return; }
          st.pick = st.pick === ci ? -1 : ci; closePop(); renderSwatches();
        });
        sw.addEventListener("dblclick", (e) => { e.stopPropagation(); if (!st.merging) { st.pick = ci; renderSwatches(); openPop(ci, swatches.querySelector(`[data-cell="${ci}"]`)); } });
        sw.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/x-cell", String(ci)); e.dataTransfer.effectAllowed = "move"; sw.classList.add("is-dragging"); });
        sw.addEventListener("dragend", () => sw.classList.remove("is-dragging"));
        sw.addEventListener("dragover", (e) => { if (Array.from(e.dataTransfer.types).includes("text/x-cell")) { e.preventDefault(); sw.classList.add("is-drop"); } });
        sw.addEventListener("dragleave", () => sw.classList.remove("is-drop"));
        sw.addEventListener("drop", (e) => {
          e.preventDefault(); e.stopPropagation(); sw.classList.remove("is-drop");
          const from = +e.dataTransfer.getData("text/x-cell");
          if (!isNaN(from) && from !== ci) mergeCells([from, ci], ci);
        });
        swatches.appendChild(sw);
      });
      if (st.pick >= st.cells.length) st.pick = -1;
      const pc = st.pick >= 0 ? st.cells[st.pick] : null;
      $("[data-pal-split]", root).disabled = st.merging || !pc || pc.members.filter((k) => st.clusters[k].count > 0).length < 2;
      $("[data-pal-edit]", root).disabled = st.merging || !pc;
      const nColors = st.cells.filter((c) => !c.transparent).length;
      $("[data-palette-count]", root).textContent = nColors;
      syncPresets();
      updateMergeBar();
    }

    function mergeCells(list, keep) {
      const ids = Array.from(new Set(list)).sort((a, b) => a - b);
      if (ids.length < 2) return;
      const target = keep !== undefined ? keep : ids[0];
      const members = [];
      ids.forEach((ci) => members.push(...st.cells[ci].members));
      const merged = { members, color: null, transparent: st.cells[target].transparent };
      const next = [];
      st.cells.forEach((c, ci) => { if (ci === target) next.push(merged); else if (!ids.includes(ci)) next.push(c); });
      st.cells = next;
      merged.color = cellColorFromMembers(members);
      st.selected.clear(); setMerging(false); closePop();
      st.pick = st.cells.indexOf(merged);
      renderSwatches(); st.commitOnDone = true; run(false);
    }
    function unmergeCell(ci) {
      const cell = st.cells[ci];
      if (!cell || cell.members.length < 2) return;
      const real = cell.members.filter((k) => st.clusters[k].count > 0);
      const empty = cell.members.filter((k) => !st.clusters[k].count);
      const parts = real.map((k, i) => ({ members: i === 0 ? [k].concat(empty) : [k], color: st.clusters[k].color, transparent: cell.transparent }));
      st.cells.splice(ci, 1, ...parts);
      st.pick = -1; closePop(); renderSwatches(); st.commitOnDone = true; run(false);
    }
    function setTransparent(ci, on) {
      st.cells[ci].transparent = on;
      if (st.opts.layering === "stacked") { st.commitOnDone = true; run(false); } else { render(); commit(); }
      renderSwatches();
      const bc = bgCell(); $("[data-opt=removeBg]", root).checked = bc ? bc.transparent : false;
    }

    let popCell = -1;
    function openPop(ci, anchor) {
      popCell = ci;
      const cell = st.cells[ci];
      const real = cell.members.filter((k) => st.clusters[k].count > 0);
      $("[data-pop-title]", pop).textContent = `${T("Color")} ${ci + 1}` + (real.length > 1 ? ` · ${real.length} ${T("merged")}` : "");
      setPicker(cell.color, true);
      const tb = $("[data-pop-transparent]", pop);
      tb.setAttribute("aria-pressed", cell.transparent ? "true" : "false");
      tb.classList.toggle("is-on", cell.transparent);
      const mem = $("[data-pop-members]", pop);
      mem.innerHTML = real.length > 1 ? real.map((k) => `<span class="pop-chip" style="background:${st.clusters[k].color}" title="${st.clusters[k].color}"></span>`).join("") : "";
      $("[data-pop-unmerge]", pop).hidden = real.length < 2;
      pop.hidden = false;
      const rb = root.getBoundingClientRect(), ab = anchor.getBoundingClientRect();
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let left = ab.left - rb.left + ab.width / 2 - pw / 2, top = ab.bottom - rb.top + 8;
      left = clamp(left, 8, rb.width - pw - 8);
      if (top + ph > rb.height - 8) top = ab.top - rb.top - ph - 8;
      pop.style.left = left + "px"; pop.style.top = Math.max(8, top) + "px";
    }
    function closePop() { if (!pop.hidden && popCell >= 0 && st.history[st.hIdx] && JSON.stringify(st.cells) !== st.history[st.hIdx].cells) commit(); pop.hidden = true; popCell = -1; }
    function recolor(ci, value) {
      if (!/^#[0-9a-f]{6}$/i.test(value)) return;
      st.cells[ci].color = value.toLowerCase();
      const transp = st.cells[ci].transparent;
      st.result.layers.forEach((L, li) => {
        if (L.group !== ci) return;
        const g = vecLayer.querySelector(`g[data-layer="${li}"]`);
        if (!g || transp) return;
        if (g.getAttribute("fill") !== "none") g.setAttribute("fill", value);
        if (g.hasAttribute("stroke")) g.setAttribute("stroke", value);
      });
      const sw = swatches.querySelector(`[data-cell="${ci}"]`);
      if (sw) sw.style.background = swatchBackground(st.cells[ci]);
    }
    // ---- custom color picker: saturation/brightness square + hue slider + hex ----
    const svEl = $("[data-pop-sv]", pop), knob = $("[data-pop-knob]", pop), hueEl = $("[data-pop-hue]", pop);
    const hexEl = $("[data-pop-hex]", pop), prevEl = $("[data-pop-preview]", pop);
    const hsv = { h: 0, s: 0, v: 0 };
    function hsvToHex(h, s, v) {
      const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
      return rgb2hex([f(5) * 255, f(3) * 255, f(1) * 255]);
    }
    function hexToHsv(hx) {
      const [r, g, b] = hex2rgb(hx).map((x) => x / 255);
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      let h = 0;
      if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return { h: (h * 60 + 360) % 360, s: mx ? d / mx : 0, v: mx };
    }
    function drawPicker(hx) {
      svEl.style.setProperty("--hue", Math.round(hsv.h));
      knob.style.left = hsv.s * 100 + "%"; knob.style.top = (1 - hsv.v) * 100 + "%";
      knob.style.background = hx; prevEl.style.background = hx;
      hueEl.value = Math.round(hsv.h);
      svEl.setAttribute("aria-valuetext", `saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`);
      if (document.activeElement !== hexEl) hexEl.value = hx;
    }
    function setPicker(hx, fromCell) {
      Object.assign(hsv, hexToHsv(hx));
      drawPicker(hx);
      if (!fromCell && popCell >= 0) recolor(popCell, hx);
    }
    function pickFromHsv() { const hx = hsvToHex(hsv.h, hsv.s, hsv.v); drawPicker(hx); if (popCell >= 0) recolor(popCell, hx); }
    let svDrag = false;
    const svAt = (e) => {
      const r = svEl.getBoundingClientRect();
      hsv.s = clamp((e.clientX - r.left) / r.width, 0, 1); hsv.v = 1 - clamp((e.clientY - r.top) / r.height, 0, 1);
      pickFromHsv();
    };
    svEl.addEventListener("pointerdown", (e) => { svDrag = true; svEl.setPointerCapture(e.pointerId); svAt(e); });
    svEl.addEventListener("pointermove", (e) => { if (svDrag) svAt(e); });
    svEl.addEventListener("pointerup", () => { svDrag = false; });
    svEl.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 0.1 : 0.02;
      if (e.key === "ArrowLeft") hsv.s = clamp(hsv.s - step, 0, 1); else if (e.key === "ArrowRight") hsv.s = clamp(hsv.s + step, 0, 1);
      else if (e.key === "ArrowUp") hsv.v = clamp(hsv.v + step, 0, 1); else if (e.key === "ArrowDown") hsv.v = clamp(hsv.v - step, 0, 1); else return;
      e.preventDefault(); pickFromHsv();
    });
    hueEl.addEventListener("input", () => { hsv.h = +hueEl.value; pickFromHsv(); });
    function applyHex(final) {
      if (popCell < 0) return;
      let v = hexEl.value.trim(); if (!v.startsWith("#")) v = "#" + v;
      if (final && /^#[0-9a-f]{3}$/i.test(v)) v = "#" + v.slice(1).split("").map((c) => c + c).join("");
      if (/^#[0-9a-f]{6}$/i.test(v)) { v = v.toLowerCase(); if (final) hexEl.value = v; setPicker(v, false); }
      else if (final) hexEl.value = st.cells[popCell].color;
    }
    hexEl.addEventListener("input", () => applyHex(false));
    hexEl.addEventListener("change", () => applyHex(true));
    hexEl.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); applyHex(true); } });
    $("[data-pop-reset]", pop).addEventListener("click", () => {
      if (popCell < 0) return;
      setPicker(cellColorFromMembers(st.cells[popCell].members), false);
    });
    $("[data-pop-transparent]", pop).addEventListener("click", (e) => {
      if (popCell < 0) return;
      const on = !st.cells[popCell].transparent;
      e.currentTarget.setAttribute("aria-pressed", on ? "true" : "false"); e.currentTarget.classList.toggle("is-on", on);
      setTransparent(popCell, on);
    });
    $("[data-pop-unmerge]", pop).addEventListener("click", () => { if (popCell >= 0) unmergeCell(popCell); });
    $("[data-pop-close]", pop).addEventListener("click", closePop);
    pop.addEventListener("click", (e) => e.stopPropagation());
    root.addEventListener("click", () => { if (!pop.hidden) closePop(); });

    function setMerging(on) {
      st.merging = on;
      if (!on) st.selected.clear();
      $("[data-merge-toggle]", root).setAttribute("aria-pressed", on ? "true" : "false");
      $("[data-merge-toggle] span", root).textContent = T(on ? "Cancel merge" : "Merge");
      if (on) st.pick = -1;
      swatches.classList.toggle("is-merging", on);
      renderSwatches();
    }
    function updateMergeBar() {
      const btn = $("[data-merge-apply]", root);
      mergeBar.hidden = !st.merging;
      btn.disabled = st.selected.size < 2;
      btn.textContent = st.selected.size < 2 ? T("Pick 2 or more colors") : `${T("Merge colors")} (${st.selected.size})`;
    }
    $("[data-merge-toggle]", root).addEventListener("click", (e) => { e.stopPropagation(); closePop(); setMerging(!st.merging); });
    $("[data-merge-apply]", root).addEventListener("click", (e) => { e.stopPropagation(); if (st.selected.size >= 2) mergeCells(Array.from(st.selected)); });

    // ---------- view ----------
    function applyView() {
      const v = st.view, tf = `translate(${v.tx}px,${v.ty}px) scale(${v.s})`;
      pixLayer.style.transform = tf; vecLayer.style.transform = tf;
      canvasEl.style.setProperty("--seam", st.seam * 100 + "%");
    }
    function fit() {
      if (!st.result) return;
      const cw = canvasEl.clientWidth, ch = canvasEl.clientHeight, w = st.result.width, h = st.result.height;
      const s = Math.min((cw - 48) / w, (ch - 48) / h);
      st.view = { s, tx: (cw - w * s) / 2, ty: (ch - h * s) / 2 };
      applyView();
    }
    function zoomAt(f, cx, cy) {
      const v = st.view, ns = clamp(v.s * f, 0.01, 64);
      v.tx = cx - (cx - v.tx) * (ns / v.s); v.ty = cy - (cy - v.ty) * (ns / v.s); v.s = ns; applyView();
    }

    function setSource(canvas, name) {
      st.name = (name || "image").replace(/\.[a-z0-9]+$/i, "");
      st.orig = canvas;
      const m = Math.max(canvas.width, canvas.height);
      // Never upscale: small pictures are traced at their own size (no 3x blow-up).
      const sc = m > MAX ? MAX / m : 1;
      if (sc === 1) st.trace = canvas;
      else {
        const t = document.createElement("canvas");
        t.width = Math.max(1, Math.round(canvas.width * sc)); t.height = Math.max(1, Math.round(canvas.height * sc));
        const c = t.getContext("2d"); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high"; c.drawImage(canvas, 0, 0, t.width, t.height);
        st.trace = t;
      }
      st.rawTrace = st.trace; const binC = document.createElement("canvas"); binC.width = st.rawTrace.width; binC.height = st.rawTrace.height; binC.getContext("2d", { willReadFrequently: true }); if (R.binarizeCanvas) R.binarizeCanvas(st.rawTrace, binC, st.opts); else binC.getContext("2d").drawImage(st.rawTrace, 0, 0); st.trace = binC;
      st.imageId++; st.clusters = null; st.cells = []; st.result = null; localSession = null;
      st.history = []; st.hIdx = -1; st.pick = -1; updateHistoryButtons();
      fileEl.textContent = `${name || "image"}  ·  ${canvas.width} × ${canvas.height}`;
    }

    function open() {
      root.hidden = false; root.classList.add("open");
      document.documentElement.style.overflow = "hidden";
      if (location.hash !== "#app") history.pushState({ app: 1 }, "", "#app");
    }
    function close(fromHistory) {
      root.classList.remove("open"); root.hidden = true; closePop();
      document.documentElement.style.overflow = "";
      st.job++; progress.classList.remove("on");
      if (!fromHistory && location.hash === "#app") history.back();
    }
    function openCanvas(canvas, name) { setSource(canvas, name); open(); requestAnimationFrame(() => run(true)); }

    async function openFile(file) {
      if (!file) return;
      if (!/^image\//.test(file.type) && !/\.(png|jpe?g|gif|bmp|webp)$/i.test(file.name || "")) { status(T("That file isn't a picture. Try PNG, JPG, GIF, BMP or WebP.")); return; }
      status(T("Loading") + " " + (file.name || "image") + "…");
      try {
        let bmp;
        try { bmp = await createImageBitmap(file); }
        catch (e) {
          const url = URL.createObjectURL(file);
          try { bmp = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url; }); }
          finally { URL.revokeObjectURL(url); }
        }
        const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height;
        c.getContext("2d").drawImage(bmp, 0, 0);
        status("");
        openCanvas(c, file.name || "pasted-image.png");
      } catch (e) { status(T("Sorry, that picture couldn't be opened.")); }
    }

    // ---- inputs: pick, drop, paste ----
    input.addEventListener("change", () => { openFile(input.files[0]); input.value = ""; });
    const pick = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } input.click(); };
    $$("[data-pick]").forEach((b) => b.addEventListener("click", pick));
    $$("[data-dropzone]").forEach((dz) => {
      dz.addEventListener("click", (e) => { if (!e.target.closest("button")) pick(e); });
      dz.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") pick(e); });
    });
    $$("[data-open-upload]").forEach((a) => a.addEventListener("click", pick));
    const zones = $$("[data-dropzone]");
    let dragDepth = 0;
    const isFileDrag = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files");
    window.addEventListener("dragenter", (e) => { if (isFileDrag(e)) { dragDepth++; zones.forEach((z) => z.classList.add("drag")); } });
    window.addEventListener("dragleave", (e) => { if (!isFileDrag(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) zones.forEach((z) => z.classList.remove("drag")); });
    window.addEventListener("dragover", (e) => { if (isFileDrag(e)) e.preventDefault(); });
    window.addEventListener("drop", (e) => {
      if (!isFileDrag(e)) return;
      e.preventDefault(); dragDepth = 0; zones.forEach((z) => z.classList.remove("drag"));
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) openFile(f);
    });
    document.addEventListener("paste", (e) => {
      const items = e.clipboardData ? Array.from(e.clipboardData.items) : [];
      const it = items.find((i) => i.kind === "file" && /^image\//.test(i.type));
      if (it) { e.preventDefault(); openFile(it.getAsFile()); }
    });

    // ---- view controls ----
    $$("[data-mode]", root).forEach((b) => b.addEventListener("click", () => {
      st.mode = b.dataset.mode;
      $$("[data-mode]", root).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      canvasEl.classList.remove("mode-split", "mode-vectors", "mode-pixels", "mode-outline");
      canvasEl.classList.add("mode-" + (st.mode === "outline" ? "vectors" : st.mode));
      render();
    }));
    $("[data-zoom-in]", root).addEventListener("click", () => zoomAt(1.4, canvasEl.clientWidth / 2, canvasEl.clientHeight / 2));
    $("[data-zoom-out]", root).addEventListener("click", () => zoomAt(1 / 1.4, canvasEl.clientWidth / 2, canvasEl.clientHeight / 2));
    $("[data-zoom-fit]", root).addEventListener("click", fit);
    canvasEl.addEventListener("wheel", (e) => {
      e.preventDefault();
      const r = canvasEl.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });

    let pan = null, seamDrag = false, cropStart = null, moved = false;
    canvasEl.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".app-zoom")) return;
      const r = canvasEl.getBoundingClientRect();
      moved = false;
      if (e.target.closest("[data-split]")) { seamDrag = true; canvasEl.setPointerCapture(e.pointerId); return; }
      if (st.crop) { cropStart = { x: e.clientX - r.left, y: e.clientY - r.top }; cropBox.style.display = "block"; Object.assign(cropBox.style, { left: cropStart.x + "px", top: cropStart.y + "px", width: "0px", height: "0px" }); canvasEl.setPointerCapture(e.pointerId); return; }
      pan = { x: e.clientX, y: e.clientY, tx: st.view.tx, ty: st.view.ty };
      canvasEl.setPointerCapture(e.pointerId); canvasEl.classList.add("dragging");
    });
    canvasEl.addEventListener("pointermove", (e) => {
      const r = canvasEl.getBoundingClientRect();
      if (seamDrag) { st.seam = clamp((e.clientX - r.left) / r.width, 0, 1); applyView(); return; }
      if (cropStart) {
        const x = e.clientX - r.left, y = e.clientY - r.top;
        Object.assign(cropBox.style, { left: Math.min(x, cropStart.x) + "px", top: Math.min(y, cropStart.y) + "px", width: Math.abs(x - cropStart.x) + "px", height: Math.abs(y - cropStart.y) + "px" });
        return;
      }
      if (!pan) return;
      if (Math.abs(e.clientX - pan.x) + Math.abs(e.clientY - pan.y) > 3) moved = true;
      st.view.tx = pan.tx + e.clientX - pan.x; st.view.ty = pan.ty + e.clientY - pan.y; applyView();
    });
    canvasEl.addEventListener("pointerup", (e) => {
      canvasEl.classList.remove("dragging");
      if (seamDrag) { seamDrag = false; return; }
      if (cropStart) {
        const r = canvasEl.getBoundingClientRect();
        const x2 = e.clientX - r.left, y2 = e.clientY - r.top, v = st.view;
        cropBox.style.display = "none";
        const toImg = (x, y) => [(x - v.tx) / v.s, (y - v.ty) / v.s];
        const [ax, ay] = toImg(Math.min(cropStart.x, x2), Math.min(cropStart.y, y2));
        const [bx, by] = toImg(Math.max(cropStart.x, x2), Math.max(cropStart.y, y2));
        cropStart = null; setCrop(false);
        const k = st.orig.width / st.result.width;
        const sx = clamp(Math.round(ax * k), 0, st.orig.width - 1), sy = clamp(Math.round(ay * k), 0, st.orig.height - 1);
        const ex = clamp(Math.round(bx * k), sx + 1, st.orig.width), ey = clamp(Math.round(by * k), sy + 1, st.orig.height);
        if (ex - sx < 4 || ey - sy < 4) return;
        const c = document.createElement("canvas"); c.width = ex - sx; c.height = ey - sy;
        c.getContext("2d").drawImage(st.orig, sx, sy, c.width, c.height, 0, 0, c.width, c.height);
        setSource(c, st.name + "-cropped.png"); run(true);
        return;
      }
      pan = null;
      if (!moved && st.edit) {
        const p = e.target.closest("path[data-k]");
        if (p) { st.hidden.add(p.dataset.k); p.style.display = "none"; render(); commit(); }
      }
    });
    canvasEl.addEventListener("pointercancel", () => { pan = null; seamDrag = false; cropStart = null; cropBox.style.display = "none"; canvasEl.classList.remove("dragging"); });

    function setCrop(on) { st.crop = on; $("[data-crop]", root).textContent = T(on ? "Drag a box…" : "Crop"); canvasEl.style.cursor = on ? "crosshair" : ""; }
    $("[data-crop]", root).addEventListener("click", () => setCrop(!st.crop));
    $("[data-reset]", root).addEventListener("click", () => { st.hidden = new Set(); if (st.result) { run(true); } });

    // ---- options ----
    const detailNames = ["Lowest", "Low", "Medium", "High", "Highest"], cornerNames = ["Softest", "Soft", "Balanced", "Crisp", "Crispest"];
    let t = 0;
    const retrace = (reset) => { clearTimeout(t); t = setTimeout(() => run(reset), 220); };
    $$("[data-opt]", root).forEach((el) => el.addEventListener(el.type === "range" ? "input" : "change", () => {
      const k = el.dataset.opt;
      if (["colors", "iconLogoMode", "detail", "corners", "layering", "symmetry", "shapes"].includes(k)) st.commitOnDone = true;
      if (k === "colors") { st.opts.colors = +el.value; if (R.binarizeCanvas && st.rawTrace) R.binarizeCanvas(st.rawTrace, st.trace, st.opts); st.imageId++; localSession = null; retrace(true); }
      else if (k === "iconLogoMode") { st.opts.iconLogoMode = el.checked; if (R.binarizeCanvas && st.rawTrace) R.binarizeCanvas(st.rawTrace, st.trace, st.opts); st.imageId++; localSession = null; retrace(true); }
      else if (k === "detail") { st.opts.detail = +el.value; $("[data-detail-val]", root).textContent = (window.t ? window.t(detailNames[el.value]) : detailNames[el.value]); retrace(false); }
      else if (k === "corners") { st.opts.corners = +el.value; $("[data-corner-val]", root).textContent = (window.t ? window.t(cornerNames[el.value]) : cornerNames[el.value]); syncCornerMode(); retrace(false); }
      else if (k === "layering") { st.opts.layering = el.value; retrace(false); }
      else if (k === "gapFill") { st.gapFill = el.checked; render(); commit(); }
      else if (k === "shapes") { st.opts.shapes = el.checked; retrace(false); }
      else if (k === "removeBg") { const c = bgCell(); if (c) setTransparent(st.cells.indexOf(c), el.checked); }
      else if (k === "symmetry") { st.symmetry = el.checked; st.imageId++; localSession = null; retrace(true); }
      else if (k === "edit") { st.edit = el.checked; render(); }
      else if (k === "strokes") { st.strokes = el.checked; render(); }
    }));


    // ---- editor panels: a tool list, each tool opens its own panel ----
    function showPanel(name) {
      $$("[data-panel]", root).forEach((pn) => { pn.hidden = pn.dataset.panel !== name; });
      closePop(); if (st.merging) setMerging(false);
      const first = $(`[data-panel="${name}"] button, [data-panel="${name}"] input`, root);
      if (first && name !== "home") first.focus({ preventScroll: true });
    }
    $$("[data-tool]", root).forEach((b) => b.addEventListener("click", () => showPanel(b.dataset.tool)));
    $$("[data-tool-back]", root).forEach((b) => b.addEventListener("click", () => showPanel("home")));

    // ---- palette presets (number of colours) ----
    const colorSel = $("[data-opt=colors]", root), presets = $("[data-presets]", root);
    Array.from(colorSel.options).forEach((o) => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.value = o.value; b.textContent = o.value === "0" ? T("Auto") : o.value;
      b.setAttribute("aria-label", o.value === "0" ? T("Auto") : `${o.value} ${T("colors")}`);
      b.addEventListener("click", () => { if (colorSel.value === o.value) return; colorSel.value = o.value; colorSel.dispatchEvent(new Event("change")); syncPresets(); });
      presets.appendChild(b);
    });
    function syncPresets() { $$("button", presets).forEach((b) => b.setAttribute("aria-pressed", b.dataset.value === colorSel.value ? "true" : "false")); }
    $("[data-pal-split]", root).addEventListener("click", (e) => { e.stopPropagation(); if (st.pick >= 0) unmergeCell(st.pick); });
    $("[data-pal-edit]", root).addEventListener("click", (e) => { e.stopPropagation(); if (st.pick >= 0) openPop(st.pick, swatches.querySelector(`[data-cell="${st.pick}"]`) || e.currentTarget); });
    $("[data-pal-reset]", root).addEventListener("click", () => { if (!st.result) return; closePop(); setMerging(false); st.pick = -1; st.commitOnDone = true; run(true); });

    // ---- corners: automatic / all sharp / all round map onto the sharpness slider ----
    const CORNER_MODES = { auto: 2, sharp: 4, round: 0 };
    function syncCornerMode() { $$("[data-corner-mode]", root).forEach((rb) => { rb.checked = CORNER_MODES[rb.value] === st.opts.corners; }); }
    $$("[data-corner-mode]", root).forEach((rb) => rb.addEventListener("change", () => {
      if (!rb.checked) return;
      const sl = $("[data-opt=corners]", root); sl.value = CORNER_MODES[rb.value]; sl.dispatchEvent(new Event("input"));
    }));

    // ---- undo / redo: every step stores the settings, the palette and the removed shapes ----
    function snapshot() {
      return { opts: Object.assign({}, st.opts), symmetry: st.symmetry, gapFill: st.gapFill, hidden: Array.from(st.hidden), clusters: st.clusters, cells: JSON.stringify(st.cells) };
    }
    function sameStep(a, b) {
      return a.clusters === b.clusters && a.cells === b.cells && a.symmetry === b.symmetry && a.gapFill === b.gapFill
        && JSON.stringify(a.opts) === JSON.stringify(b.opts) && a.hidden.join() === b.hidden.join();
    }
    function commit() {
      if (!st.result) return;
      const snap = snapshot(), cur = st.history[st.hIdx];
      if (cur && sameStep(cur, snap)) return;
      st.history = st.history.slice(0, st.hIdx + 1); st.history.push(snap);
      if (st.history.length > 60) st.history.shift();
      st.hIdx = st.history.length - 1; updateHistoryButtons();
    }
    function updateHistoryButtons() {
      $("[data-undo]", root).disabled = st.hIdx <= 0;
      $("[data-redo]", root).disabled = st.hIdx < 0 || st.hIdx >= st.history.length - 1;
    }
    function syncControls() {
      const o = st.opts;
      colorSel.value = String(o.colors); syncPresets();
      $("[data-opt=detail]", root).value = o.detail; $("[data-detail-val]", root).textContent = T(detailNames[o.detail]);
      $("[data-opt=corners]", root).value = o.corners; $("[data-corner-val]", root).textContent = T(cornerNames[o.corners]); syncCornerMode();
      $("[data-opt=layering]", root).value = o.layering;
      $("[data-opt=shapes]", root).checked = o.shapes !== false;
      $("[data-opt=iconLogoMode]", root).checked = !!o.iconLogoMode;
      $("[data-opt=symmetry]", root).checked = st.symmetry;
      $("[data-opt=gapFill]", root).checked = st.gapFill;
    }
    const structureOf = (cells) => JSON.stringify(cells.map((c) => [c.members, c.transparent]));
    function restore(state) {
      const prev = { opts: st.opts, symmetry: st.symmetry, clusters: st.clusters, structure: structureOf(st.cells) };
      st.opts = Object.assign({}, state.opts); st.symmetry = state.symmetry; st.gapFill = state.gapFill;
      st.clusters = state.clusters; st.cells = JSON.parse(state.cells);
      st.pick = -1; st.selected.clear(); pop.hidden = true; popCell = -1; if (st.merging) setMerging(false);
      syncControls();
      const rebin = prev.opts.colors !== st.opts.colors || prev.opts.iconLogoMode !== st.opts.iconLogoMode || prev.symmetry !== st.symmetry;
      if (rebin) { if (R.binarizeCanvas && st.rawTrace) R.binarizeCanvas(st.rawTrace, st.trace, st.opts); st.imageId++; localSession = null; }
      const retraceNeeded = rebin || prev.clusters !== st.clusters || prev.structure !== structureOf(st.cells)
        || ["detail", "corners", "layering", "shapes"].some((k) => prev.opts[k] !== st.opts[k]);
      if (retraceNeeded) { st.pendingHidden = new Set(state.hidden); run(false); }
      else { st.hidden = new Set(state.hidden); render(); renderSwatches(); }
      updateHistoryButtons();
    }
    function undo() { if (st.hIdx > 0) { st.hIdx--; restore(st.history[st.hIdx]); } }
    function redo() { if (st.hIdx < st.history.length - 1) { st.hIdx++; restore(st.history[st.hIdx]); } }
    $("[data-undo]", root).addEventListener("click", undo);
    $("[data-redo]", root).addEventListener("click", redo);
    document.addEventListener("keydown", (e) => {
      if (!root.classList.contains("open") || !(e.ctrlKey || e.metaKey)) return;
      if (e.target && e.target.tagName === "INPUT" && e.target.type === "text") return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (key === "y" || (key === "z" && e.shiftKey)) { e.preventDefault(); redo(); }
    });

    // ---- dialogs ----
    const dialog = (name, on) => { const d = $(`[data-dialog="${name}"]`, root); if (d) d.hidden = !on; };
    $$("[data-dialog-close]", root).forEach((b) => b.addEventListener("click", () => { b.closest(".app-dialog").hidden = true; }));
    $$("[data-feedback]", root).forEach((b) => b.addEventListener("click", () => { dialog("feedback", false); dialog("thanks", true); }));
    let netShown = false;
    showNetwork = () => { if (!netShown) { netShown = true; dialog("network", true); } };
    showFatal = () => { progress.classList.remove("on"); dialog("fatal", true); };
    showError = (text) => { $("[data-error-text]", root).textContent = text; progress.classList.remove("on"); dialog("error", true); };

    // ---- downloads ----
    function save(blob, ext) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `${st.name}.${ext}`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
    let askedFeedback = false;
    const sel = $("[data-dl-format]", root);
    if (sel) {
      try { sel.value = localStorage.getItem("revector.format") || "eps"; } catch (e) { sel.value = "eps"; }
      if (!sel.value) sel.value = "eps";
      sel.addEventListener("change", () => { try { localStorage.setItem("revector.format", sel.value); } catch (e) {} });
    }
    $$("[data-dl]", root).forEach((b) => b.addEventListener("click", () => {
      if (!st.result) return;
      const o = { width: st.orig.width, height: st.orig.height, hidden: st.hidden, colors: layerColors(), transparent: layerTransparent(), strokes: false, gapFill: false };
      const kind = b.dataset.dl === "main" ? ((sel && sel.value) || "eps") : b.dataset.dl;
      if (kind === "svg") save(new Blob([R.toSVG(st.result, o)], { type: "image/svg+xml" }), "svg");
      else if (kind === "pdf") save(new Blob([R.toPDF(st.result, o)], { type: "application/pdf" }), "pdf");
      else if (kind === "eps") save(new Blob([R.toEPS(st.result, o)], { type: "application/postscript" }), "eps");
      else if (kind === "dxf") save(new Blob([R.toDXF(st.result, o)], { type: "application/dxf" }), "dxf");
      else if (kind === "png") {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas"); c.width = o.width; c.height = o.height;
          c.getContext("2d").drawImage(img, 0, 0, o.width, o.height);
          c.toBlob((bl) => bl && save(bl, "png"), "image/png");
        };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(R.toSVG(st.result, o));
      }
      if (!askedFeedback) { askedFeedback = true; setTimeout(() => dialog("feedback", true), 900); }
    }));

    $("[data-app-close]", root).addEventListener("click", () => close(false));
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !root.classList.contains("open")) return;
      const openDialog = $(".app-dialog:not([hidden])", root);
      if (openDialog) { openDialog.hidden = true; return; }
      if (!pop.hidden) { closePop(); return; }
      if (st.crop || cropStart) { cropStart = null; cropBox.style.display = "none"; setCrop(false); return; }
      if (st.merging) { setMerging(false); return; }
      close(false);
    });
    window.addEventListener("popstate", () => { if (root.classList.contains("open") && location.hash !== "#app") close(true); });
    window.addEventListener("resize", () => { if (root.classList.contains("open")) fit(); });
    if (location.hash === "#app") history.replaceState(null, "", location.pathname);

    return { openCanvas, openFile };
  })();
})();
