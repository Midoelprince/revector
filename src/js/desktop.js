// Desktop-only extras: the version, "Check for Updates" and the update banner.
// In a web browser window.revectorDesktop doesn't exist and this file does nothing.
(function () {
  "use strict";
  var desktop = window.revectorDesktop;
  if (!desktop) return;

  var DISMISS_KEY = "revector.update.dismissed";
  var css = [
    ".desk-tools{display:inline-flex;align-items:center;gap:10px;white-space:nowrap}",
    ".desk-version{font-family:var(--font-mono);font-size:13px;color:var(--text-muted);letter-spacing:0}",
    ".desk-check{appearance:none;background:none;border:1px solid var(--border);border-radius:var(--radius-control);height:36px;padding:0 12px;font:inherit;font-size:15px;font-weight:500;color:var(--text);cursor:pointer;transition:color .15s ease,border-color .15s ease}",
    ".desk-check:hover{color:var(--accent);border-color:var(--accent)}",
    ".desk-check:focus-visible,.desk-btn:focus-visible,.desk-close:focus-visible{outline:2px solid var(--accent);outline-offset:2px}",
    ".desk-check[disabled]{color:var(--text-muted);border-color:var(--border-subtle);cursor:default}",
    ".desk-update{position:fixed;right:24px;bottom:24px;z-index:1000;width:360px;max-width:calc(100vw - 48px);box-sizing:border-box;padding:16px 16px 16px 18px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-card-sm);box-shadow:var(--shadow-float);font-family:var(--font-ui);font-size:var(--type-body-sm);line-height:1.4}",
    ".desk-update[hidden]{display:none}",
    ".desk-update-head{display:flex;align-items:flex-start;gap:12px}",
    ".desk-update-text{flex:1;min-width:0}",
    ".desk-update-title{margin:0;font-weight:600;color:var(--text);overflow-wrap:anywhere}",
    ".desk-update-note{margin:4px 0 0;color:var(--text-muted);font-size:14px;overflow-wrap:anywhere}",
    ".desk-update-note[hidden],.desk-bar[hidden],.desk-btn[hidden]{display:none}",
    ".desk-close{appearance:none;flex:none;width:28px;height:28px;margin:-4px -4px 0 0;padding:0;border:0;border-radius:var(--radius-tag);background:none;color:var(--text-muted);font:inherit;font-size:20px;line-height:1;cursor:pointer}",
    ".desk-close:hover{background:var(--surface-sunken);color:var(--text)}",
    ".desk-bar{margin-top:12px;height:8px;border-radius:4px;background:var(--surface-sunken);overflow:hidden}",
    ".desk-bar-fill{height:100%;width:0;border-radius:4px;background:var(--accent);transition:width .2s ease}",
    ".desk-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;margin-top:14px;height:40px;padding:0 16px;border:0;border-radius:var(--radius-button);background:var(--inverse);color:#fff;font:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:background-color .15s ease}",
    ".desk-btn:hover{background:var(--inverse-hover)}",
    "@media (prefers-reduced-motion:reduce){.desk-check,.desk-btn,.desk-bar-fill{transition:none}}"
  ].join("\n");

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var style = el("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ----- top bar: version + Check for Updates -----
  var versionLabel = el("span", "desk-version");
  versionLabel.setAttribute("aria-label", "Current version");
  var checkButton = el("button", "desk-check", "Check for Updates");
  checkButton.type = "button";
  var tools = el("div", "desk-tools");
  tools.appendChild(versionLabel);
  tools.appendChild(checkButton);

  var account = document.querySelector(".nav-account");
  if (account) {
    var firstLink = account.querySelector("a.nav-link");
    if (firstLink) account.insertBefore(tools, firstLink);
    else account.appendChild(tools);
  }

  // ----- banner -----
  var banner = el("div", "desk-update");
  banner.hidden = true;
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  var head = el("div", "desk-update-head");
  var textBox = el("div", "desk-update-text");
  var title = el("p", "desk-update-title");
  var note = el("p", "desk-update-note");
  var close = el("button", "desk-close", "\u00d7");
  close.type = "button";
  close.setAttribute("aria-label", "Dismiss");
  var bar = el("div", "desk-bar");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Download progress");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  var fill = el("div", "desk-bar-fill");
  var action = el("button", "desk-btn");
  action.type = "button";
  bar.appendChild(fill);
  textBox.appendChild(title);
  textBox.appendChild(note);
  head.appendChild(textBox);
  head.appendChild(close);
  banner.appendChild(head);
  banner.appendChild(bar);
  banner.appendChild(action);
  document.body.appendChild(banner);

  var currentVersion = "";
  var current = { status: "idle" };
  var hideTimer = 0;
  var onAction = null;

  function dismissed() {
    try { return sessionStorage.getItem(DISMISS_KEY) || ""; } catch (_) { return ""; }
  }
  function setDismissed(value) {
    try {
      if (value) sessionStorage.setItem(DISMISS_KEY, value);
      else sessionStorage.removeItem(DISMISS_KEY);
    } catch (_) {}
  }

  function show(view) {
    clearTimeout(hideTimer);
    title.textContent = view.title;
    note.textContent = view.note || "";
    note.hidden = !view.note;
    bar.hidden = view.percent == null;
    if (view.percent != null) {
      fill.style.width = view.percent + "%";
      bar.setAttribute("aria-valuenow", String(view.percent));
    }
    action.hidden = !view.button;
    action.textContent = view.button || "";
    onAction = view.onClick || null;
    banner.hidden = false;
    if (view.autoHide) hideTimer = setTimeout(hide, view.autoHide);
  }
  function hide() {
    clearTimeout(hideTimer);
    banner.hidden = true;
  }

  function label(version) {
    return version ? " (v" + version + ")" : "";
  }

  // fresh = the state just changed; false when a page is re-showing an old state.
  function render(state, fresh) {
    current = state || { status: "idle" };
    var status = current.status;
    var busy = status === "checking" || status === "downloading";
    checkButton.disabled = busy;
    checkButton.textContent = status === "checking" ? "Checking\u2026" : "Check for Updates";

    if (status === "available") {
      if (!current.manual && dismissed() === "available:" + current.version) return hide();
      show({
        title: "Update available" + label(current.version),
        note: currentVersion ? "You have v" + currentVersion + "." : "",
        button: "Download & Update",
        onClick: function () { desktop.downloadUpdate(); }
      });
    } else if (status === "downloading") {
      show({
        title: "Downloading update" + label(current.version),
        note: (current.percent || 0) + "% done. You can keep working.",
        percent: current.percent || 0
      });
    } else if (status === "downloaded") {
      if (!current.manual && !fresh && dismissed() === "downloaded:" + current.version) return hide();
      show({
        title: "Update ready" + label(current.version),
        note: "Restart Revector to finish. Save your work first.",
        percent: 100,
        button: "Restart to Apply Update",
        onClick: function () { desktop.installUpdate(); }
      });
    } else if (status === "checking") {
      if (current.manual && fresh) show({ title: "Checking for updates\u2026" });
    } else if (status === "none") {
      if (current.manual && fresh) show({ title: "You're up to date", note: currentVersion ? "v" + currentVersion + " is the newest version." : "", autoHide: 6000 });
      else hide();
    } else if (status === "unsupported") {
      if (current.manual && fresh) show({ title: "Updates aren't available here", note: current.message, autoHide: 9000 });
      else hide();
    } else if (status === "error") {
      // A failed quiet check on launch stays quiet; a failure the person started is shown.
      if (fresh && (current.manual || current.version)) {
        show({
          title: "Couldn't update",
          note: current.message || "Check your internet connection and try again.",
          button: "Try Again",
          onClick: function () { desktop.checkForUpdates(); }
        });
      } else hide();
    } else {
      hide();
    }
  }

  action.addEventListener("click", function () {
    if (onAction) onAction();
  });
  close.addEventListener("click", function () {
    if (current.status === "available" || current.status === "downloaded") {
      setDismissed(current.status + ":" + current.version);
    }
    hide();
  });
  checkButton.addEventListener("click", function () {
    setDismissed("");
    desktop.checkForUpdates();
  });

  desktop.onUpdateEvent(function (state) { render(state, true); });
  desktop.getVersion().then(function (version) {
    currentVersion = version || "";
    versionLabel.textContent = currentVersion ? "v" + currentVersion : "";
    return desktop.getUpdateState();
  }).then(function (state) {
    render(state, false);
  }).catch(function () {});
})();
