// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("load-config"),
  connectToServer: (data) => ipcRenderer.send("connect-to-server", data),
  onServerConnected: (callback) => ipcRenderer.on("server-connected", callback),
  onServerData: (callback) =>
    ipcRenderer.on("server-data", (event, data) => callback(data)),
  onServerClosed: (callback) => ipcRenderer.on("server-closed", callback),
  onServerError: (callback) =>
    ipcRenderer.on("server-error", (event, error) => callback(error)),
  sendData: (data) => ipcRenderer.send("send-data", data),
  updateRoom: (room) => ipcRenderer.send("update-room", room),
  updateGameState: (gameState) =>
    ipcRenderer.send("update-game-state", gameState),
});
