// Desktop-only extras: the version, "Check for Updates", the update banner and
// the "File saved" popup with "Show in Folder".
// In a web browser window.revectorDesktop doesn't exist and this file does nothing.
(function () {
  "use strict";
  var desktop = window.revectorDesktop;
  if (!desktop) return;

  // i18n.js (loaded first) provides window.t for the Arabic interface.
  function tr(text) { return typeof window.t === "function" ? window.t(text) : text; }
  var css = [
    ".desk-tools{display:inline-flex;align-items:center;gap:10px;white-space:nowrap}",
    ".desk-version{font-family:var(--font-mono);font-size:13px;color:var(--text-muted);letter-spacing:0}",
    ".desk-check{appearance:none;background:none;border:1px solid var(--border);border-radius:var(--radius-control);height:36px;padding:0 12px;font:inherit;font-size:15px;font-weight:500;color:var(--text);cursor:pointer;transition:color .15s ease,border-color .15s ease}",
    ".desk-check:hover{color:var(--accent);border-color:var(--accent)}",
    ".desk-check:focus-visible,.desk-btn:focus-visible,.desk-close:focus-visible{outline:2px solid var(--accent);outline-offset:2px}",
    ".desk-check[disabled]{color:var(--text-muted);border-color:var(--border-subtle);cursor:default}",
    ".desk-check.is-available,.desk-check.is-ready{color:var(--accent);border-color:var(--accent);background:var(--accent-tint,rgba(11,120,148,.08));font-weight:600}",
    ".desk-check.is-available::before{content:'';display:inline-block;width:8px;height:8px;margin-inline-end:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--accent-tint,rgba(11,120,148,.18))}",
    ".desk-check.is-ready{background:var(--accent);color:#fff}",
    ".desk-check.is-ready:hover{color:#fff;filter:brightness(1.08)}",
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
    ".desk-saved{position:fixed;left:50%;bottom:24px;z-index:1001;display:flex;align-items:flex-start;gap:12px;width:440px;max-width:calc(100vw - 48px);box-sizing:border-box;padding:14px 14px 14px 16px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-card-sm);box-shadow:var(--shadow-float);font-family:var(--font-ui);font-size:var(--type-body-sm);line-height:1.4;transform:translateX(-50%);animation:desk-in .18s ease-out}",
    ".desk-saved[hidden]{display:none}",
    ".desk-saved-icon{flex:none;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:var(--accent);color:#fff}",
    ".desk-saved-icon svg{width:18px;height:18px}",
    ".desk-saved.is-failed .desk-saved-icon{background:var(--text-muted)}",
    ".desk-saved-text{flex:1;min-width:0}",
    ".desk-saved-name{margin:2px 0 0;font-family:var(--font-mono);font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:start}",
    ".desk-saved-folder{margin:2px 0 0;color:var(--text-muted);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:start}",
    ".desk-saved-folder[hidden],.desk-saved-actions[hidden]{display:none}",
    ".desk-saved-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}",
    ".desk-saved-actions .desk-btn{margin-top:0;height:36px;padding:0 14px;font-size:14px}",
    ".desk-link{appearance:none;height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-button);background:none;color:var(--text);font:inherit;font-size:14px;font-weight:500;cursor:pointer}",
    ".desk-link:hover{border-color:var(--accent);color:var(--accent)}",
    ".desk-link:focus-visible{outline:2px solid var(--accent);outline-offset:2px}",
    "@keyframes desk-in{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}",
    "@media (prefers-reduced-motion:reduce){.desk-check,.desk-btn,.desk-bar-fill{transition:none}.desk-saved{animation:none}}"
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
  versionLabel.setAttribute("aria-label", tr("Current version"));
  var checkButton = el("button", "desk-check", tr("Check for Updates"));
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
  close.setAttribute("aria-label", tr("Dismiss"));
  var bar = el("div", "desk-bar");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", tr("Download progress"));
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

  // ----- "File saved" popup -----
  var CHECK_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ALERT_ICON = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 5v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="10" cy="15" r="1.4" fill="currentColor"/></svg>';
  var saved = el("div", "desk-saved");
  saved.hidden = true;
  saved.setAttribute("role", "status");
  saved.setAttribute("aria-live", "polite");
  var savedIcon = el("span", "desk-saved-icon");
  var savedText = el("div", "desk-saved-text");
  var savedTitle = el("p", "desk-update-title");
  var savedName = el("p", "desk-saved-name");
  savedName.setAttribute("data-no-i18n", "");
  var savedFolder = el("p", "desk-saved-folder");
  savedFolder.setAttribute("data-no-i18n", "");
  var savedActions = el("div", "desk-saved-actions");
  var revealButton = el("button", "desk-btn");
  revealButton.type = "button";
  var openButton = el("button", "desk-link");
  openButton.type = "button";
  var savedClose = el("button", "desk-close", "×");
  savedClose.type = "button";
  savedActions.appendChild(revealButton);
  savedActions.appendChild(openButton);
  savedText.appendChild(savedTitle);
  savedText.appendChild(savedName);
  savedText.appendChild(savedFolder);
  savedText.appendChild(savedActions);
  saved.appendChild(savedIcon);
  saved.appendChild(savedText);
  saved.appendChild(savedClose);
  document.body.appendChild(saved);

  var savedInfo = null;
  var savedTimer = 0;
  var savedHeld = false;

  function hideSaved() {
    clearTimeout(savedTimer);
    saved.hidden = true;
    savedInfo = null;
    savedHeld = false;
  }
  function armSaved() {
    clearTimeout(savedTimer);
    if (!savedHeld && !saved.hidden) savedTimer = setTimeout(hideSaved, 12000);
  }
  function labelSaved() {
    revealButton.textContent = tr("Show in Folder");
    openButton.textContent = tr("Open File");
    savedClose.setAttribute("aria-label", tr("Dismiss"));
    if (savedInfo) savedTitle.textContent = tr(savedInfo.status === "saved" ? "File saved" : "Couldn't save the file");
  }
  function showSaved(info) {
    if (!info || (info.status !== "saved" && info.status !== "failed")) return;
    savedInfo = info;
    var ok = info.status === "saved";
    saved.classList.toggle("is-failed", !ok);
    savedIcon.innerHTML = ok ? CHECK_ICON : ALERT_ICON;
    savedName.textContent = info.name || "";
    savedName.title = info.name || "";
    savedFolder.textContent = ok ? (info.folder || "") : "";
    savedFolder.title = savedFolder.textContent;
    savedFolder.hidden = !savedFolder.textContent;
    savedActions.hidden = !ok;
    labelSaved();
    saved.hidden = false;
    armSaved();
  }

  revealButton.addEventListener("click", function () {
    if (savedInfo && savedInfo.id) desktop.showSavedFile(savedInfo.id);
    hideSaved();
  });
  openButton.addEventListener("click", function () {
    if (savedInfo && savedInfo.id) desktop.openSavedFile(savedInfo.id);
    hideSaved();
  });
  savedClose.addEventListener("click", hideSaved);
  // Stays open while the pointer or keyboard focus is on it.
  saved.addEventListener("mouseenter", function () { savedHeld = true; clearTimeout(savedTimer); });
  saved.addEventListener("mouseleave", function () { savedHeld = false; armSaved(); });
  saved.addEventListener("focusin", function () { savedHeld = true; clearTimeout(savedTimer); });
  saved.addEventListener("focusout", function () { savedHeld = false; armSaved(); });
  // Escape inside the popup closes only the popup, not the editor behind it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !saved.hidden && saved.contains(document.activeElement)) { e.stopPropagation(); hideSaved(); }
  }, true);
  if (desktop.onDownloadEvent) desktop.onDownloadEvent(showSaved);
  labelSaved();

  var currentVersion = "";
  var current = { status: "idle" };
  var hideTimer = 0;
  var onAction = null;

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

  // The top-bar button carries the whole update flow:
  //   Check for Updates -> Checking\u2026 -> Update available (click: download) -> Downloading 43%
  //   -> Restart to update (click: silent install + relaunch). The banner is only used for the
  //   answers to a manual check (up to date, unsupported, failed).
  var restarting = false;
  function setButton(text, cls, disabled, tip) {
    checkButton.textContent = text;
    checkButton.className = "desk-check" + (cls ? " " + cls : "");
    checkButton.disabled = !!disabled;
    checkButton.title = tip || "";
  }

  // fresh = the state just changed; false when a page is re-showing an old state.
  function render(state, fresh) {
    current = state || { status: "idle" };
    var status = current.status;
    var v = current.version ? " \u00b7 v" + current.version : "";

    if (status === "checking") setButton(tr("Checking\u2026"), "", true);
    else if (status === "available") setButton(tr("Update available") + v, "is-available", false, currentVersion ? tr("You have") + " v" + currentVersion + ". " + tr("Click to download.") : tr("Click to download."));
    else if (status === "downloading") setButton(tr("Downloading\u2026") + " " + (current.percent || 0) + "%", "", true);
    else if (status === "downloaded") setButton(restarting ? tr("Restarting\u2026") : tr("Restart to update") + v, "is-ready", restarting, tr("Installs the update and starts Revector again. Save your work first."));
    else setButton(tr("Check for Updates"), "", false);

    if (status === "available" || status === "downloading" || status === "downloaded") {
      hide();
    } else if (status === "checking") {
      if (current.manual && fresh) show({ title: tr("Checking for updates\u2026") });
    } else if (status === "none") {
      if (current.manual && fresh) show({ title: tr("You're up to date"), note: currentVersion ? "v" + currentVersion + " \u2014 " + tr("the newest version.") : "", autoHide: 6000 });
      else hide();
    } else if (status === "unsupported") {
      if (current.manual && fresh) show({ title: tr("Updates aren't available here"), note: tr(current.message), autoHide: 9000 });
      else hide();
    } else if (status === "error") {
      // A failed quiet check on launch stays quiet; a failure the person started is shown.
      if (fresh && (current.manual || current.version)) {
        show({
          title: tr("Couldn't update"),
          note: tr(current.message || "Check your internet connection and try again."),
          button: tr("Try Again"),
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
  close.addEventListener("click", hide);
  checkButton.addEventListener("click", function () {
    if (current.status === "available") desktop.downloadUpdate();
    else if (current.status === "downloaded") {
      restarting = true;
      render(current, true);
      desktop.installUpdate().then(function (ok) {
        // false: the updater refused (nothing downloaded any more); let the person try again
        if (ok === false) { restarting = false; desktop.checkForUpdates(); }
      }).catch(function () { restarting = false; render(current, true); });
    } else if (current.status !== "checking" && current.status !== "downloading") desktop.checkForUpdates();
  });

  desktop.onUpdateEvent(function (state) { render(state, true); });
  // Language switched: redraw the desktop text in the new language.
  window.addEventListener("langchange", function () {
    versionLabel.setAttribute("aria-label", tr("Current version"));
    close.setAttribute("aria-label", tr("Dismiss"));
    bar.setAttribute("aria-label", tr("Download progress"));
    labelSaved();
    render(current, !banner.hidden);
  });
  desktop.getVersion().then(function (version) {
    currentVersion = version || "";
    versionLabel.textContent = currentVersion ? "v" + currentVersion : "";
    return desktop.getUpdateState();
  }).then(function (state) {
    render(state, false);
  }).catch(function () {});
})();
