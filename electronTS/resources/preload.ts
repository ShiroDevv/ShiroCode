import { ipcRenderer } from "electron";
import { contextBridge } from "electron/renderer";

contextBridge.exposeInMainWorld("ipcRenderer", {
    on: ipcRenderer.on,
    send: ipcRenderer.send
});