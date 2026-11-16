"use strict";
// The only bridge between the page and the desktop shell. The page gets a few
// small functions and nothing else (no Node, no file access). Saved files are
// referred to by a number; only the desktop shell knows their real path.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("revectorDesktop", {
  getVersion: () => ipcRenderer.invoke("app:version"),
  getUpdateState: () => ipcRenderer.invoke("update:state"),
  checkForUpdates: () => ipcRenderer.invoke("update:check"),
  downloadUpdate: () => ipcRenderer.invoke("update:download"),
  installUpdate: () => ipcRenderer.invoke("update:install"),
  showSavedFile: (id) => ipcRenderer.invoke("download:reveal", id),
  openSavedFile: (id) => ipcRenderer.invoke("download:open", id),
  onDownloadEvent: (callback) => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, info) => callback(info);
    ipcRenderer.on("download:event", listener);
    return () => ipcRenderer.removeListener("download:event", listener);
  },
  onUpdateEvent: (callback) => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("update:event", listener);
    return () => ipcRenderer.removeListener("update:event", listener);
  }
});
