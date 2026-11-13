/* Small original example pictures, drawn as pixels so the showcase can trace them live. */
(function () {
  "use strict";
  const TAU = Math.PI * 2;
  function circle(c, x, y, r, fill) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = fill; c.fill(); }
  function poly(c, pts, fill) { c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.closePath(); c.fillStyle = fill; c.fill(); }
  function rrect(c, x, y, w, h, r, fill) { c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fill; c.fill(); }
  function bg(c, w, h, col) { c.fillStyle = col; c.fillRect(0, 0, w, h); }

  const list = [
    { name: "coffee-cup", w: 132, h: 156, focus: [0.62, 0.55], draw(c, w, h) {
      bg(c, w, h, "#f4e9d8");
      c.strokeStyle = "#6b3f24"; c.lineWidth = 5; c.lineCap = "round";
      [[46, 30], [66, 22], [86, 30]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x, y + 26); c.bezierCurveTo(x - 8, y + 16, x + 8, y + 10, x, y); c.stroke(); });
      circle(c, 66, 128, 52, "#e2c9a6"); c.save(); c.globalCompositeOperation = "source-over"; c.restore();
      poly(c, [24, 66, 108, 66, 98, 126, 34, 126], "#c2410c");
      c.beginPath(); c.arc(108, 92, 16, -1.3, 1.3); c.lineWidth = 8; c.strokeStyle = "#c2410c"; c.stroke();
      rrect(c, 20, 60, 92, 10, 5, "#8a2f0a");
      circle(c, 66, 98, 13, "#f4e9d8"); poly(c, [60, 92, 74, 98, 60, 104], "#c2410c");
    } },
    { name: "sun-badge", w: 140, h: 150, focus: [0.5, 0.35], draw(c, w, h) {
      bg(c, w, h, "#fbf6ec");
      circle(c, 70, 75, 64, "#12182b");
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; poly(c, [70 + Math.cos(a - 0.12) * 30, 75 + Math.sin(a - 0.12) * 30, 70 + Math.cos(a) * 54, 75 + Math.sin(a) * 54, 70 + Math.cos(a + 0.12) * 30, 75 + Math.sin(a + 0.12) * 30], "#f0b429"); }
      circle(c, 70, 75, 28, "#f0b429"); circle(c, 62, 70, 4, "#12182b"); circle(c, 80, 70, 4, "#12182b");
      c.beginPath(); c.arc(71, 80, 10, 0.2, Math.PI - 0.2); c.lineWidth = 3.5; c.strokeStyle = "#12182b"; c.stroke();
    } },
    { name: "mountain-badge", w: 146, h: 144, focus: [0.4, 0.5], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      circle(c, 73, 72, 68, "#2f5d50"); circle(c, 73, 72, 58, "#f6d9a8");
      c.save(); c.beginPath(); c.arc(73, 72, 58, 0, TAU); c.clip();
      circle(c, 96, 52, 14, "#e4572e");
      poly(c, [0, 120, 46, 54, 86, 120], "#3d7a5f"); poly(c, [40, 120, 92, 44, 146, 120], "#2f5d50"); poly(c, [80, 61, 92, 44, 104, 61, 96, 58, 92, 64, 87, 58], "#ffffff");
      poly(c, [0, 104, 146, 98, 146, 144, 0, 144], "#1f3f36");
      c.restore();
    } },
    { name: "paper-plane", w: 156, h: 140, focus: [0.55, 0.45], draw(c, w, h) {
      bg(c, w, h, "#dcebf1");
      c.strokeStyle = "#3ba6c4"; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(10, 120); c.bezierCurveTo(40, 80, 60, 130, 84, 84); c.stroke(); c.setLineDash([]);
      poly(c, [60, 76, 146, 22, 104, 110], "#ffffff"); poly(c, [84, 84, 146, 22, 92, 112], "#b9c0cc"); poly(c, [60, 76, 146, 22, 84, 84], "#f6f7f4");
    } },
    { name: "pine-badge", w: 140, h: 140, focus: [0.5, 0.45], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      circle(c, 70, 70, 66, "#17723f"); circle(c, 70, 70, 56, "#ffffff"); circle(c, 70, 70, 52, "#17723f");
      poly(c, [70, 22, 92, 56, 80, 56, 100, 84, 84, 84, 106, 110, 34, 110, 56, 84, 40, 84, 60, 56, 48, 56], "#ffffff");
      rrect(c, 64, 108, 12, 14, 2, "#ffffff");
    } },
    { name: "chili-pepper", w: 150, h: 136, focus: [0.45, 0.55], draw(c, w, h) {
      bg(c, w, h, "#fff4e8");
      c.beginPath(); c.moveTo(108, 34); c.bezierCurveTo(140, 60, 120, 120, 30, 120); c.bezierCurveTo(70, 104, 84, 70, 86, 40); c.closePath(); c.fillStyle = "#b42340"; c.fill();
      c.beginPath(); c.moveTo(100, 44); c.bezierCurveTo(116, 60, 112, 84, 96, 96); c.lineWidth = 5; c.strokeStyle = "#e4572e"; c.stroke();
      poly(c, [84, 36, 110, 30, 104, 44, 90, 46], "#2f9e6a");
      c.beginPath(); c.moveTo(98, 34); c.bezierCurveTo(98, 20, 106, 12, 118, 10); c.lineWidth = 6; c.strokeStyle = "#2f9e6a"; c.lineCap = "round"; c.stroke();
    } },
    { name: "donut", w: 146, h: 146, focus: [0.4, 0.4], draw(c, w, h) {
      bg(c, w, h, "#f6f7f4");
      circle(c, 73, 76, 58, "#d9a066");
      c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = 50 + Math.sin(i * 1.7) * 5; i ? c.lineTo(73 + Math.cos(a) * r, 74 + Math.sin(a) * r) : c.moveTo(73 + Math.cos(a) * r, 74 + Math.sin(a) * r); } c.closePath(); c.fillStyle = "#f28cb1"; c.fill();
      circle(c, 73, 76, 18, "#f6f7f4");
      const sp = ["#3ba6c4", "#f0b429", "#ffffff", "#2f9e6a"];
      [[50, 50, .4], [92, 46, 1.2], [108, 78, .2], [42, 92, 2], [62, 112, .9], [96, 106, 2.4], [70, 40, 1.8], [114, 58, .7]].forEach(([x, y, a], i) => { c.save(); c.translate(x, y); c.rotate(a); rrect(c, -6, -2, 12, 4, 2, sp[i % 4]); c.restore(); });
    } },
    { name: "night-harbor", w: 160, h: 118, focus: [0.6, 0.6], draw(c, w, h) {
      bg(c, w, h, "#0c1424");
      poly(c, [0, 0, 60, 0, 40, 118, 0, 118], "#163a5c");
      rrect(c, 4, 10, 30, 52, 2, "#2b6b4f"); rrect(c, 8, 16, 22, 40, 2, "#0f2a40"); rrect(c, 2, 64, 6, 54, 1, "#f3b56b");
      c.beginPath(); c.moveTo(60, 0); c.bezierCurveTo(80, 30, 100, 40, 160, 46); c.lineTo(160, 0); c.closePath(); c.fillStyle = "#0a1220"; c.fill();
      c.beginPath(); c.moveTo(46, 54); c.bezierCurveTo(70, 20, 110, 10, 128, 0); c.lineTo(150, 0); c.bezierCurveTo(130, 40, 120, 70, 140, 118); c.lineTo(96, 118); c.bezierCurveTo(98, 90, 80, 70, 46, 54); c.closePath(); c.fillStyle = "#1f4f7a"; c.fill();
      c.beginPath(); c.moveTo(70, 66); c.bezierCurveTo(110, 64, 140, 90, 156, 118); c.lineTo(146, 118); c.bezierCurveTo(130, 92, 108, 74, 70, 66); c.closePath(); c.fillStyle = "#c9a57a"; c.fill();
      circle(c, 120, 26, 7, "#f3e3b5");
      c.strokeStyle = "#7fa6b8"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(40, 30); c.lineTo(58, 8); c.stroke();
    } },
    { name: "night-owl", w: 130, h: 150, focus: [0.5, 0.42], draw(c, w, h) {
      bg(c, w, h, "#e9eef5");
      c.beginPath(); c.ellipse(65, 86, 48, 58, 0, 0, TAU); c.fillStyle = "#4b5470"; c.fill();
      poly(c, [22, 50, 30, 18, 50, 38], "#4b5470"); poly(c, [108, 50, 100, 18, 80, 38], "#4b5470");
      c.beginPath(); c.ellipse(65, 104, 30, 34, 0, 0, TAU); c.fillStyle = "#dcebf1"; c.fill();
      circle(c, 46, 62, 17, "#ffffff"); circle(c, 84, 62, 17, "#ffffff"); circle(c, 46, 62, 8, "#12182b"); circle(c, 84, 62, 8, "#12182b"); circle(c, 49, 59, 2.5, "#ffffff"); circle(c, 87, 59, 2.5, "#ffffff");
      poly(c, [58, 76, 72, 76, 65, 90], "#f0b429");
      [[52, 100], [65, 108], [78, 100], [58, 118], [72, 118]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 5, 0.2, Math.PI - 0.2); c.lineWidth = 2; c.strokeStyle = "#4b5470"; c.stroke(); });
    } },
    { name: "cloud-sync", w: 150, h: 140, focus: [0.5, 0.5], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      rrect(c, 28, 86, 94, 40, 6, "#d5d9e0"); rrect(c, 34, 92, 82, 28, 3, "#3ba6c4"); poly(c, [18, 126, 132, 126, 140, 134, 10, 134], "#b9c0cc");
      circle(c, 58, 52, 22, "#eaf3f6"); circle(c, 84, 44, 28, "#eaf3f6"); circle(c, 108, 58, 18, "#eaf3f6"); rrect(c, 40, 52, 84, 26, 13, "#eaf3f6");
      c.strokeStyle = "#0b7894"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(75, 82); c.lineTo(75, 56); c.moveTo(66, 64); c.lineTo(75, 54); c.lineTo(84, 64); c.stroke();
    } },
    { name: "geometric-shapes", w: 160, h: 140, focus: [0.48, 0.5], draw(c, w, h) {
      bg(c, w, h, "#f6f7f4");
      circle(c, 56, 62, 34, "#3ba6c4"); poly(c, [70, 120, 112, 30, 150, 120], "#e4572e"); poly(c, [16, 120, 52, 84, 88, 120], "#12182b");
      c.save(); c.globalAlpha = 1; c.beginPath(); c.arc(56, 62, 34, 0, TAU); c.clip(); poly(c, [70, 120, 112, 30, 150, 120], "#7a5c8a"); c.restore();
      rrect(c, 112, 14, 30, 30, 4, "#f0b429");
    } },
    { name: "bubble-tea", w: 118, h: 156, focus: [0.5, 0.7], draw(c, w, h) {
      bg(c, w, h, "#fdf3dd");
      rrect(c, 64, 6, 10, 60, 3, "#e4572e");
      poly(c, [20, 46, 98, 46, 88, 146, 30, 146], "#e9d3b0");
      c.beginPath(); c.ellipse(59, 46, 42, 10, 0, 0, TAU); c.fillStyle = "#f1eee6"; c.fill();
      for (let i = 0; i < 12; i++) circle(c, 36 + (i % 6) * 9.5, 126 + Math.floor(i / 6) * 10 - (i % 2) * 3, 4.6, "#3a2a24");
      circle(c, 46, 92, 3.5, "#12182b"); circle(c, 72, 92, 3.5, "#12182b");
      c.beginPath(); c.arc(59, 98, 5, 0.3, Math.PI - 0.3); c.lineWidth = 2; c.strokeStyle = "#12182b"; c.stroke();
      circle(c, 40, 100, 4, "#f28cb1"); circle(c, 78, 100, 4, "#f28cb1");
    } },
    { name: "calligraphy", w: 160, h: 110, focus: [80, 55], draw(c, w, h) {
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
    { name: "mascot", w: 140, h: 140, focus: [70, 70], draw(c, w, h) {
      bg(c, w, h, "#e9f6ff");
      circle(c, 40, 34, 17, "#1d1d2b"); circle(c, 100, 34, 17, "#1d1d2b");
      circle(c, 40, 34, 12, "#f59e0b"); circle(c, 100, 34, 12, "#f59e0b");
      circle(c, 70, 78, 50, "#1d1d2b");
      circle(c, 70, 78, 45, "#f59e0b");
      c.fillStyle = "#fde68a"; c.beginPath(); c.ellipse(70, 92, 28, 22, 0, 0, TAU); c.fill();
      circle(c, 52, 66, 10, "#ffffff"); circle(c, 88, 66, 10, "#ffffff");
      circle(c, 54, 68, 5, "#1d1d2b"); circle(c, 90, 68, 5, "#1d1d2b");
      poly(c, [[64, 82], [76, 82], [70, 89]], "#1d1d2b");
      c.fillStyle = "#e11d48"; c.beginPath(); c.ellipse(70, 99, 9, 5, 0, 0, Math.PI); c.fill();
      circle(c, 40, 88, 6, "#fb7185"); circle(c, 100, 88, 6, "#fb7185");
    } },
    { name: "geo-badge", w: 140, h: 140, focus: [70, 70], draw(c, w, h) {
      bg(c, w, h, "#ffffff");
      const hex = (r) => { const p = []; for (let i = 0; i < 6; i++) { const a = TAU * i / 6 - Math.PI / 2; p.push([70 + r * Math.cos(a), 70 + r * Math.sin(a)]); } return p; };
      poly(c, hex(64), "#0f3d5e");
      poly(c, hex(54), "#f2c14e");
      circle(c, 70, 70, 42, "#0f3d5e");
      circle(c, 70, 70, 34, "#e8eef3");
      const st = []; for (let i = 0; i < 10; i++) { const a = TAU * i / 10 - Math.PI / 2, r = i % 2 ? 12 : 28; st.push([70 + r * Math.cos(a), 70 + r * Math.sin(a)]); }
      poly(c, st, "#d94f30");
      poly(c, [[40, 118], [70, 104], [100, 118], [100, 128], [70, 114], [40, 128]], "#d94f30");
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

  window.RevectorExamples = { list, render, defaultIndex: 7 };
})();
