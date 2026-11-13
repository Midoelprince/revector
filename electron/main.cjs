"use strict";
// Revector desktop shell.
// - Serves the built site (dist/) from inside the app over app://revector/,
//   so every /assets/... address, the Web Worker and the language switch work
//   with no internet connection.
// - Checks for updates on launch and on request (electron-updater).
const { app, BrowserWindow, Menu, ipcMain, protocol, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const pkg = require("../package.json");

const SCHEME = "app";
const HOST = "revector";
const ORIGIN = SCHEME + "://" + HOST;
const SITE_ROOT = path.join(__dirname, "..", "dist");
const ICON = path.join(__dirname, "icon.png");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8"
};

// Must run before the app is ready: makes app:// behave like https:// (its own
// origin, localStorage, workers, fetch).
protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);

function isFile(file) {
  try { return fs.statSync(file).isFile(); } catch (_) { return false; }
}

// Turns an app://revector/... address into a file inside dist/, or null.
function resolveFile(address) {
  let url;
  try { url = new URL(address); } catch (_) { return null; }
  if (url.host !== HOST) return null;
  let rel;
  try { rel = decodeURIComponent(url.pathname); } catch (_) { return null; }
  if (rel.includes("\0")) return null;
  const full = path.normalize(path.join(SITE_ROOT, rel));
  if (full !== SITE_ROOT && !full.startsWith(SITE_ROOT + path.sep)) return null; // no escaping dist/
  const candidates = path.extname(full) ? [full] : [path.join(full, "index.html"), full + ".html"];
  for (const file of candidates) if (isFile(file)) return file;
  return null;
}

async function serve(request) {
  const file = resolveFile(request.url);
  if (!file) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  const body = await fs.promises.readFile(file);
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-cache"
    }
  });
}

// ---------- updates ----------
let autoUpdater = null;
let updaterProblem = "";
try {
  autoUpdater = require("electron-updater").autoUpdater;
} catch (error) {
  updaterProblem = "The updater isn't part of this build.";
}

// Where to look for updates. By default: the GitHub repository named under
// build.publish in package.json. To use your own server instead, set
// revector.updateUrl in package.json or the REVECTOR_UPDATE_URL environment
// variable to a folder that holds latest.yml and the installer.
const UPDATE_URL = process.env.REVECTOR_UPDATE_URL || (pkg.revector && pkg.revector.updateUrl) || "";
const IS_PORTABLE = Boolean(process.env.PORTABLE_EXECUTABLE_FILE);

let mainWindow = null;
let state = { status: "idle", version: "", percent: 0, message: "", manual: false };

function setState(next) {
  state = Object.assign({ status: "idle", version: "", percent: 0, message: "", manual: state.manual }, next);
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("update:event", state);
  return state;
}

function tidy(error) {
  const text = String((error && error.message) || error || "").split("\n")[0].trim();
  return text.length > 220 ? text.slice(0, 217) + "..." : text;
}

function whyNoUpdates() {
  if (!app.isPackaged) return "Updates work in the installed app. This is a development run.";
  if (IS_PORTABLE) return "The portable version can't update itself. Download the newest one, or use the installer.";
  if (!autoUpdater) return updaterProblem;
  return "";
}

if (autoUpdater) {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  if (UPDATE_URL) {
    try { autoUpdater.setFeedURL({ provider: "generic", url: UPDATE_URL }); } catch (error) { updaterProblem = tidy(error); }
  }
  autoUpdater.on("checking-for-update", () => setState({ status: "checking" }));
  autoUpdater.on("update-available", (info) => setState({ status: "available", version: info.version }));
  autoUpdater.on("update-not-available", () => setState({ status: "none" }));
  autoUpdater.on("download-progress", (progress) => setState({ status: "downloading", version: state.version, percent: Math.max(0, Math.min(100, Math.round(progress.percent || 0))) }));
  autoUpdater.on("update-downloaded", (info) => setState({ status: "downloaded", version: info.version, percent: 100 }));
  autoUpdater.on("error", (error) => setState({ status: "error", version: state.version, message: tidy(error) }));
}

async function checkForUpdates(manual) {
  if (state.status === "checking" || state.status === "downloading" || state.status === "downloaded") {
    return setState(Object.assign({}, state, { manual: manual }));
  }
  state.manual = manual;
  const reason = whyNoUpdates();
  if (reason) return setState({ status: "unsupported", message: reason });
  setState({ status: "checking" });
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    if (state.status !== "error") setState({ status: "error", message: tidy(error) });
  }
  return state;
}

ipcMain.handle("app:version", () => app.getVersion());
ipcMain.handle("update:state", () => state);
ipcMain.handle("update:check", () => checkForUpdates(true));
ipcMain.handle("update:download", async () => {
  if (!autoUpdater || state.status !== "available") return state;
  setState({ status: "downloading", version: state.version, percent: 0 });
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    if (state.status !== "error") setState({ status: "error", version: state.version, message: tidy(error) });
  }
  return state;
});
ipcMain.handle("update:install", () => {
  if (!autoUpdater || state.status !== "downloaded") return false;
  setImmediate(() => autoUpdater.quitAndInstall());
  return true;
});

// ---------- window ----------
function openOutside(address) {
  if (/^(https?:|mailto:)/i.test(address)) shell.openExternal(address);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 800,
    title: "Revector",
    backgroundColor: "#f6f7f4",
    icon: isFile(ICON) ? ICON : undefined,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => { mainWindow = null; });

  // Pages inside the app stay in the window; anything else opens in the browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(ORIGIN + "/")) return { action: "allow" };
    openOutside(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.startsWith(ORIGIN + "/")) return;
    event.preventDefault();
    openOutside(url);
  });

  if (!app.isPackaged) {
    mainWindow.webContents.on("before-input-event", (_event, input) => {
      if (input.type === "keyDown" && input.key === "F12") mainWindow.webContents.toggleDevTools();
    });
  }

  mainWindow.loadURL(ORIGIN + "/");
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    if (process.platform === "win32") app.setAppUserModelId("com.revector.desktop");
    Menu.setApplicationMenu(null); // clean window: no File/Edit/View bar
    protocol.handle(SCHEME, serve);
    createWindow();

    // Quiet check a few seconds after launch (installed app only).
    if (!whyNoUpdates()) {
      setTimeout(() => { checkForUpdates(false); }, 3000);
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
