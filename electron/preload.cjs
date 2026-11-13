"use strict";
// The only bridge between the page and the desktop shell. The page gets five
// small functions and nothing else (no Node, no file access).
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("revectorDesktop", {
  getVersion: () => ipcRenderer.invoke("app:version"),
  getUpdateState: () => ipcRenderer.invoke("update:state"),
  checkForUpdates: () => ipcRenderer.invoke("update:check"),
  downloadUpdate: () => ipcRenderer.invoke("update:download"),
  installUpdate: () => ipcRenderer.invoke("update:install"),
  onUpdateEvent: (callback) => {
    if (typeof callback !== "function") return () => {};
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("update:event", listener);
    return () => ipcRenderer.removeListener("update:event", listener);
  }
});
