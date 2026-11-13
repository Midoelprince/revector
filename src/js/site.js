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
    const saved = (() => { try { return localStorage.getItem("revector-locale"); } catch (e) { return null; } })();
    if (saved) {
      $$(".lang-menu a", lang).forEach((a) => a.toggleAttribute("aria-current", a.dataset.locale === saved));
      $$(".lang-menu a[aria-current]", lang).forEach((a) => a.setAttribute("aria-current", "true"));
      const cur = $('.lang-menu a[aria-current="true"] span:last-child', lang);
      if (cur) btn.setAttribute("aria-label", "Language: " + cur.textContent);
    }
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

  // ---- pricing ----
  const table = $("[data-credits]");
  if (table) {
    const rates = { USD: [1, "$"], EUR: [0.92, "€"], GBP: [0.79, "£"], CAD: [1.36, "CA$"], AUD: [1.52, "A$"] };
    let cur = "USD";
    const fmt = (v, d) => rates[cur][1] + (v * rates[cur][0]).toFixed(d);
    const draw = () => {
      $$("[data-usd]").forEach((el) => {
        const v = +el.dataset.usd, d = +(el.dataset.dec || 2);
        el.textContent = fmt(v, d) + (el.dataset.suffix || "");
      });
      $("[data-currency-label]").textContent = "Currency: " + cur;
    };
    $$("input[name=plan]", table).forEach((r) => r.addEventListener("change", () => {
      $$("tr", table).forEach((tr) => tr.classList.toggle("sel", tr.contains(r) && r.checked));
    }));
    $$("tbody tr", table).forEach((tr) => tr.addEventListener("click", (e) => { const r = $("input", tr); if (r && e.target !== r) { r.checked = true; r.dispatchEvent(new Event("change")); } }));
    const planForm = $("[data-plan-form]");
    if (planForm) planForm.addEventListener("submit", (e) => e.preventDefault());
    const more = $("[data-show-more]");
    if (more) more.addEventListener("click", () => { const on = table.classList.toggle("show-more"); more.textContent = on ? "Show fewer plans" : "Show more plans"; });
    const cbox = $(".currency"), cbtn = $(".currency > button");
    if (cbox && cbtn) {
      cbtn.addEventListener("click", (e) => { e.stopPropagation(); cbox.classList.toggle("open"); });
      document.addEventListener("click", () => cbox.classList.remove("open"));
      $$(".currency-menu button").forEach((b) => b.addEventListener("click", () => { cur = b.dataset.cur; cbox.classList.remove("open"); draw(); }));
    }
    draw();
  }

  // ---- support form ----
  const form = $("[data-support-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $("[data-form-msg]", form);
      const email = form.email.value.trim(), text = form.message.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.className = "form-msg err"; msg.textContent = "Please enter a valid email address."; form.email.focus(); return; }
      if (text.length < 10) { msg.className = "form-msg err"; msg.textContent = "Please tell us a little more in your message."; form.message.focus(); return; }
      msg.className = "form-msg";
      msg.textContent = "Thanks! Your request is ready. This copy of the site isn't connected to a support inbox yet, so nothing was sent.";
    });
  }
})();
