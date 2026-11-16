/* Shared behaviour for every page: menu, language list, small interactive bits. */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  // ---- mobile menu ----
  const nav = $(".nav"), toggle = $(".nav-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- language menu ----
  const lang = $(".lang");
  if (lang) {
    const btn = $(".lang-toggle", lang);
    // i18n.js owns the language (localStorage key "lang"); the menu only mirrors it.
    const syncLang = () => {
      const cur = window.getLang ? window.getLang() : "en";
      $$(".lang-menu a", lang).forEach((a) => {
        if (a.dataset.locale === cur) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      const label = $('.lang-menu a[aria-current="true"] span:last-child', lang);
      if (label) btn.setAttribute("aria-label", "Language: " + label.textContent);
    };
    syncLang();
    window.addEventListener("langchange", () => { syncLang(); lang.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
    const setOpen = (o) => { lang.classList.toggle("open", o); btn.setAttribute("aria-expanded", String(o)); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!lang.classList.contains("open")); if (lang.classList.contains("open")) { const c = $('[aria-current="true"]', lang); if (c) c.focus(); } });
    document.addEventListener("click", (e) => { if (!lang.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    $(".lang-menu", lang).addEventListener("keydown", (e) => {
      const items = $$(".lang-menu a", lang), i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    });
  }

  // ---- rotating words in the home eyebrow ----
  const rots = $$(".rot[data-words]");
  if (rots.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // the real words stay in the heading; another word briefly shows over them now and then
    let step = 0;
    setInterval(() => {
      const r = rots[step % rots.length], words = r.dataset.words.split("|");
      const over = r.querySelector(".rot-over");
      over.textContent = words[Math.floor(step / rots.length) % words.length];
      r.classList.add("swap");
      setTimeout(() => r.classList.remove("swap"), 1700);
      step++;
    }, 5200);
  }

  // ---- headline lines shrink to fit narrow screens ----
  const fits = $$("[data-fit]");
  function fitLines() {
    fits.forEach((p) => {
      const avail = p.clientWidth;
      $$(".dl", p).forEach((l) => {
        l.style.fontSize = "";
        const w = l.scrollWidth;
        if (w > avail && w > 0) l.style.fontSize = (parseFloat(getComputedStyle(l).fontSize) * avail / w * 0.995) + "px";
      });
    });
  }
  if (fits.length) {
    fitLines();
    window.addEventListener("resize", fitLines);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLines);
  }

  // ---- Mac keyboard hint ----
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) $$(".ctl-key").forEach((k) => { k.textContent = "⌘"; });
})();
