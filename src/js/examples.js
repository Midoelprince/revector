/* Original example pictures for the showcase, drawn as pixels so they can be traced live.
   Each one shows something the tracer has to get right: close tints side by side, sharp tips,
   true circles, thin line art, an interface icon, stripes, and hand-made curves. */
(function () {
  "use strict";
  const TAU = Math.PI * 2;
  // points may be given flat [x, y, x, y, ...] or as pairs [[x, y], ...]
  function flat(pts) { return Array.isArray(pts[0]) ? pts.flat() : pts; }
  function poly(c, pts, fill) {
    const p = flat(pts);
    c.beginPath(); c.moveTo(p[0], p[1]);
    for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
    c.closePath(); c.fillStyle = fill; c.fill();
  }
  function circle(c, x, y, r, fill) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = fill; c.fill(); }
  function ellipse(c, x, y, rx, ry, rot, fill) { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fillStyle = fill; c.fill(); }
  function rrect(c, x, y, w, h, r, fill) { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fill; c.fill(); }
  function bg(c, w, h, col) { c.fillStyle = col; c.fillRect(0, 0, w, h); }
  function line(c, pts, width, col, cap) {
    const p = flat(pts);
    c.beginPath(); c.moveTo(p[0], p[1]);
    for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
    c.lineWidth = width; c.strokeStyle = col; c.lineCap = cap || "round"; c.lineJoin = "round"; c.stroke();
  }
  function ring(c, x, y, r, width, col) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.lineWidth = width; c.strokeStyle = col; c.stroke(); }

  const list = [
    // dawn sky in two close tints, a striped tower, light beams with sharp tips
    { name: "lighthouse", w: 160, h: 120, focus: [0.42, 0.42], draw(c, w, h) {
      bg(c, w, h, "#f6ead6");
      poly(c, [0, 0, 160, 0, 160, 46, 0, 62], "#f1dcc0");
      circle(c, 122, 58, 20, "#f4a259");
      poly(c, [[66, 26], [0, 4], [0, 30]], "#fff6dc");
      poly(c, [[66, 26], [160, 12], [160, 36]], "#fff6dc");
      poly(c, [0, 78, 160, 70, 160, 120, 0, 120], "#2c5d8a");
      c.beginPath(); c.moveTo(0, 88);
      for (let x = 0; x <= 160; x += 20) c.quadraticCurveTo(x + 10, 82, x + 20, 88);
      c.lineTo(160, 120); c.lineTo(0, 120); c.closePath(); c.fillStyle = "#3d78ab"; c.fill();
      poly(c, [[30, 98], [42, 84], [96, 84], [110, 98], [104, 104], [36, 104]], "#4a4e5a");
      poly(c, [[54, 86], [58, 34], [74, 34], [78, 86]], "#f8f4ec");
      poly(c, [[55.6, 66], [56.6, 52], [75.4, 52], [76.4, 66]], "#d1495b");
      poly(c, [[57.4, 44], [58, 36], [74, 36], [74.6, 44]], "#d1495b");
      rrect(c, 54, 26, 24, 10, 2, "#1d2a3a");
      rrect(c, 59, 28, 14, 6, 1, "#ffd166");
      poly(c, [[52, 26], [66, 14], [80, 26]], "#1d2a3a");
      line(c, [[112, 22], [116, 18], [120, 22]], 1.6, "#1d2a3a");
      line(c, [[124, 28], [127, 25], [130, 28]], 1.6, "#1d2a3a");
    } },
    // a geometric fox: every outline is straight, every tip is sharp
    { name: "fox", w: 140, h: 140, focus: [0.5, 0.45], draw(c, w, h) {
      bg(c, w, h, "#fff7ec");
      poly(c, [[24, 18], [58, 44], [30, 70]], "#e8702a");
      poly(c, [[116, 18], [82, 44], [110, 70]], "#e8702a");
      poly(c, [[30, 28], [50, 46], [34, 60]], "#3b2a24");
      poly(c, [[110, 28], [90, 46], [106, 60]], "#3b2a24");
      poly(c, [[22, 56], [70, 36], [118, 56], [70, 124]], "#e8702a");
      poly(c, [[22, 56], [52, 70], [70, 124]], "#fbf3e6");
      poly(c, [[118, 56], [88, 70], [70, 124]], "#fbf3e6");
      poly(c, [[70, 36], [58, 58], [70, 70], [82, 58]], "#d15f1d");
      poly(c, [[44, 72], [56, 66], [56, 76]], "#3b2a24");
      poly(c, [[96, 72], [84, 66], [84, 76]], "#3b2a24");
      poly(c, [[62, 108], [78, 108], [70, 120]], "#3b2a24");
    } },
    // rounded pads, a terracotta pot in two tones and a flower
    { name: "cactus", w: 120, h: 150, focus: [0.5, 0.4], draw(c, w, h) {
      bg(c, w, h, "#eef6f0");
      rrect(c, 46, 24, 28, 84, 14, "#3f8f5a");
      rrect(c, 18, 52, 22, 40, 11, "#3f8f5a"); rrect(c, 26, 80, 26, 12, 6, "#3f8f5a");
      rrect(c, 82, 40, 20, 36, 10, "#3f8f5a"); rrect(c, 68, 66, 24, 12, 6, "#3f8f5a");
      rrect(c, 57, 30, 6, 72, 3, "#357a4c");
      [[52, 40], [68, 50], [52, 62], [68, 74], [52, 86], [26, 62], [94, 50]].forEach(([x, y]) => line(c, [x - 3, y - 3, x + 3, y + 3], 1.6, "#e9f2e4"));
      circle(c, 60, 22, 8, "#f28cb1"); circle(c, 60, 22, 3.5, "#ffd166");
      poly(c, [[28, 112], [92, 112], [84, 146], [36, 146]], "#c8643b");
      rrect(c, 24, 104, 72, 12, 3, "#a9512f");
    } },
    // ellipses, a ringed window, fins and a two-colour flame on a starry sky
    { name: "rocket", w: 130, h: 150, focus: [0.5, 0.45], draw(c, w, h) {
      bg(c, w, h, "#1b1f3a");
      [[18, 20, 1.6], [104, 30, 2], [26, 96, 1.4], [110, 110, 1.8], [64, 12, 1.2], [96, 70, 1.3], [16, 136, 1.5]].forEach(([x, y, r]) => circle(c, x, y, r, "#fdf6e3"));
      poly(c, [[44, 88], [26, 116], [46, 110]], "#e4572e");
      poly(c, [[86, 88], [104, 116], [84, 110]], "#e4572e");
      poly(c, [[52, 114], [78, 114], [72, 142], [65, 130], [58, 142]], "#f0b429");
      poly(c, [[58, 114], [72, 114], [68, 130], [65, 124], [62, 130]], "#e4572e");
      c.beginPath(); c.moveTo(65, 14); c.bezierCurveTo(92, 36, 92, 86, 82, 116); c.lineTo(48, 116); c.bezierCurveTo(38, 86, 38, 36, 65, 14); c.closePath(); c.fillStyle = "#eef1f6"; c.fill();
      c.beginPath(); c.moveTo(65, 14); c.bezierCurveTo(78, 24, 84, 34, 86, 42); c.lineTo(44, 42); c.bezierCurveTo(46, 34, 52, 24, 65, 14); c.closePath(); c.fillStyle = "#e4572e"; c.fill();
      circle(c, 65, 66, 15, "#8c97ad"); circle(c, 65, 66, 10.5, "#3ba6c4"); circle(c, 61, 62, 3.4, "#bfe6f2");
      rrect(c, 58, 100, 14, 16, 2, "#8c97ad");
    } },
    // long smooth curves: a whale with its belly, tail and spout
    { name: "whale", w: 160, h: 120, focus: [0.45, 0.55], draw(c, w, h) {
      bg(c, w, h, "#e6f4f8");
      c.beginPath(); c.moveTo(18, 70); c.bezierCurveTo(18, 38, 60, 30, 92, 40); c.bezierCurveTo(112, 46, 122, 58, 128, 62);
      c.bezierCurveTo(134, 52, 142, 42, 152, 40); c.bezierCurveTo(148, 52, 144, 60, 146, 70); c.bezierCurveTo(150, 76, 154, 84, 154, 92);
      c.bezierCurveTo(142, 86, 134, 80, 124, 80); c.bezierCurveTo(106, 98, 66, 104, 40, 96); c.bezierCurveTo(26, 92, 18, 84, 18, 70); c.closePath(); c.fillStyle = "#2f6f9f"; c.fill();
      c.beginPath(); c.moveTo(22, 78); c.bezierCurveTo(44, 88, 84, 90, 116, 80); c.bezierCurveTo(98, 96, 62, 100, 40, 94); c.bezierCurveTo(30, 90, 24, 86, 22, 78); c.closePath(); c.fillStyle = "#cfe6f2"; c.fill();
      circle(c, 42, 62, 4, "#12182b"); circle(c, 43, 61, 1.3, "#ffffff");
      c.beginPath(); c.moveTo(70, 70); c.bezierCurveTo(74, 80, 82, 80, 86, 74); c.lineWidth = 2.4; c.strokeStyle = "#1f557d"; c.lineCap = "round"; c.stroke();
      line(c, [[60, 34], [56, 20]], 3, "#7cc3e0"); line(c, [[62, 34], [64, 16]], 3, "#7cc3e0"); line(c, [[64, 34], [72, 22]], 3, "#7cc3e0");
      c.beginPath(); c.moveTo(0, 108);
      for (let x = 0; x <= 160; x += 16) c.quadraticCurveTo(x + 8, 102, x + 16, 108);
      c.lineTo(160, 120); c.lineTo(0, 120); c.closePath(); c.fillStyle = "#7cc3e0"; c.fill();
    } },
    // a striped sunset over hills: parallel cuts through one circle
    { name: "retro-sun", w: 150, h: 120, focus: [0.5, 0.5], draw(c, w, h) {
      bg(c, w, h, "#fdf0d5");
      const cols = ["#f7b538", "#f08a24", "#e4572e", "#c1272d"];
      c.save(); c.beginPath(); c.arc(75, 78, 50, Math.PI, 0); c.closePath(); c.clip();
      for (let i = 0; i < 4; i++) { c.fillStyle = cols[i]; c.fillRect(0, 28 + i * 13, 150, 13 - (i ? 3 : 0)); }
      c.restore();
      c.beginPath(); c.moveTo(0, 86); c.bezierCurveTo(30, 70, 50, 70, 78, 84); c.bezierCurveTo(100, 74, 126, 72, 150, 82); c.lineTo(150, 120); c.lineTo(0, 120); c.closePath(); c.fillStyle = "#3a2e5c"; c.fill();
      c.beginPath(); c.moveTo(0, 102); c.bezierCurveTo(40, 92, 90, 96, 150, 104); c.lineTo(150, 120); c.lineTo(0, 120); c.closePath(); c.fillStyle = "#251c40"; c.fill();
    } },
    // an interface icon: rounded rectangles and concentric circles
    { name: "camera-icon", w: 140, h: 120, focus: [0.5, 0.55], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      rrect(c, 46, 18, 34, 16, 5, "#12182b");
      rrect(c, 14, 28, 112, 78, 16, "#12182b");
      rrect(c, 96, 38, 18, 9, 3, "#f0b429");
      circle(c, 70, 68, 30, "#f6f7f4");
      circle(c, 70, 68, 22, "#3ba6c4");
      circle(c, 70, 68, 12, "#12182b");
      circle(c, 64, 62, 4, "#ffffff");
    } },
    // thin line art: two wheels, a frame and handlebars drawn as strokes
    { name: "bicycle", w: 160, h: 110, focus: [0.5, 0.6], draw(c, w, h) {
      bg(c, w, h, "#f7f4ee");
      ring(c, 38, 72, 26, 4, "#12182b"); ring(c, 122, 72, 26, 4, "#12182b");
      circle(c, 38, 72, 3, "#12182b"); circle(c, 122, 72, 3, "#12182b");
      line(c, [[38, 72], [70, 72], [104, 40], [60, 40], [38, 72]], 4.5, "#e4572e");
      line(c, [[70, 72], [56, 30]], 4.5, "#e4572e");
      line(c, [[104, 40], [122, 72]], 4.5, "#e4572e");
      line(c, [[104, 40], [100, 26], [112, 22]], 4, "#12182b");
      rrect(c, 46, 25, 22, 7, 3.5, "#12182b");
      circle(c, 70, 72, 6, "#12182b"); line(c, [[70, 72], [76, 82]], 3, "#12182b");
    } },
    // a slice with crust, cheese drips and round toppings
    { name: "pizza", w: 140, h: 140, focus: [0.5, 0.45], draw(c, w, h) {
      bg(c, w, h, "#fff5e6");
      c.beginPath(); c.moveTo(70, 128); c.lineTo(18, 30); c.quadraticCurveTo(70, 4, 122, 30); c.closePath(); c.fillStyle = "#f6d365"; c.fill();
      c.beginPath(); c.moveTo(14, 28); c.quadraticCurveTo(70, -2, 126, 28); c.lineTo(122, 38); c.quadraticCurveTo(70, 12, 18, 38); c.closePath(); c.fillStyle = "#d9963a"; c.fill();
      c.beginPath(); c.moveTo(40, 72); c.quadraticCurveTo(44, 92, 50, 86); c.lineTo(52, 74); c.closePath(); c.fillStyle = "#f6d365"; c.fill();
      [[52, 44, 9], [86, 48, 8], [70, 74, 8], [62, 100, 6]].forEach(([x, y, r]) => circle(c, x, y, r, "#c0392b"));
      [[74, 36], [46, 64], [92, 70]].forEach(([x, y]) => ring(c, x, y, 3.6, 2.4, "#2f3a2f"));
      [[60, 60], [96, 40], [80, 92]].forEach(([x, y]) => ellipse(c, x, y, 4, 2.2, 0.6, "#4f9a52"));
    } },
    // a round camping badge: rings, a tent, pines and a crescent moon
    { name: "camping-badge", w: 140, h: 140, focus: [0.5, 0.55], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      circle(c, 70, 70, 66, "#2f5d50"); circle(c, 70, 70, 58, "#f6d9a8");
      c.save(); c.beginPath(); c.arc(70, 70, 58, 0, TAU); c.clip();
      poly(c, [[0, 104], [40, 62], [70, 90], [100, 56], [140, 104], [140, 140], [0, 140]], "#8fb3a3");
      poly(c, [[0, 112], [140, 112], [140, 140], [0, 140]], "#2f5d50");
      c.restore();
      circle(c, 96, 40, 10, "#fdf6e3"); circle(c, 101, 36, 9, "#f6d9a8");
      poly(c, [[52, 112], [70, 74], [88, 112]], "#d94f30");
      poly(c, [[64, 112], [70, 96], [76, 112]], "#3a2b24");
      [[30, 112, 26], [112, 112, 22]].forEach(([x, y, hh]) => { poly(c, [[x - 9, y - 6], [x, y - hh], [x + 9, y - 6]], "#1f4038"); poly(c, [[x - 11, y + 2], [x, y - hh + 10], [x + 11, y + 2]], "#1f4038"); });
    } },
    { name: "calligraphy", w: 160, h: 110, focus: [0.5, 0.5], draw(c, w, h) {
      bg(c, w, h, "#fbf8f1");
      c.fillStyle = "#151515";
      c.beginPath();
      c.moveTo(14, 70); c.bezierCurveTo(30, 20, 52, 18, 60, 40);
      c.bezierCurveTo(66, 58, 50, 82, 40, 78); c.bezierCurveTo(34, 76, 44, 56, 56, 52);
      c.bezierCurveTo(52, 60, 46, 70, 48, 72); c.bezierCurveTo(54, 70, 62, 52, 56, 36);
      c.bezierCurveTo(48, 24, 30, 34, 20, 70); c.closePath(); c.fill();
      c.beginPath();
      c.moveTo(62, 74); c.bezierCurveTo(78, 30, 96, 30, 100, 50);
      c.bezierCurveTo(104, 66, 112, 74, 128, 52); c.bezierCurveTo(138, 40, 146, 46, 148, 60);
      c.bezierCurveTo(140, 52, 134, 56, 126, 66); c.bezierCurveTo(110, 84, 98, 76, 94, 56);
      c.bezierCurveTo(90, 40, 80, 42, 68, 76); c.closePath(); c.fill();
      c.beginPath();
      c.moveTo(20, 92); c.bezierCurveTo(60, 84, 110, 84, 150, 90);
      c.bezierCurveTo(110, 92, 60, 92, 20, 96); c.closePath(); c.fill();
      circle(c, 104, 28, 4, "#151515"); circle(c, 140, 30, 3, "#151515");
    } },
    { name: "mascot", w: 140, h: 140, focus: [0.5, 0.5], draw(c, w, h) {
      bg(c, w, h, "#e9f6ff");
      circle(c, 40, 34, 17, "#1d1d2b"); circle(c, 100, 34, 17, "#1d1d2b");
      circle(c, 40, 34, 12, "#f59e0b"); circle(c, 100, 34, 12, "#f59e0b");
      circle(c, 70, 78, 50, "#1d1d2b");
      circle(c, 70, 78, 45, "#f59e0b");
      ellipse(c, 70, 92, 28, 22, 0, "#fde68a");
      circle(c, 52, 66, 10, "#ffffff"); circle(c, 88, 66, 10, "#ffffff");
      circle(c, 54, 68, 5, "#1d1d2b"); circle(c, 90, 68, 5, "#1d1d2b");
      poly(c, [[64, 82], [76, 82], [70, 89]], "#1d1d2b");
      c.fillStyle = "#e11d48"; c.beginPath(); c.ellipse(70, 99, 9, 5, 0, 0, Math.PI); c.fill();
      circle(c, 40, 88, 6, "#fb7185"); circle(c, 100, 88, 6, "#fb7185");
    } }
  ];

  function render(ex, scale) {
    const cv = document.createElement("canvas");
    const s = scale || 2400 / Math.max(ex.w, ex.h);
    cv.width = Math.round(ex.w * s); cv.height = Math.round(ex.h * s);
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
    if (s !== 1) c.scale(s, s);
    ex.draw(c, ex.w, ex.h);
    return cv;
  }

  window.RevectorExamples = { list, render, defaultIndex: 0 };
})();
