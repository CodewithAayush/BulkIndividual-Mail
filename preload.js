const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendEmails: (data) => ipcRenderer.send("send-emails", data),
  onLog: (callback) => ipcRenderer.on("log", (event, msg) => callback(msg))
});