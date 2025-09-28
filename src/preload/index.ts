import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { IPC_EVENTS } from "../shared/ipc-events";
import type { Api } from "./index.d";
import { SearchFilters } from "../shared/types";

// Custom APIs for renderer
const api: Api = {
  ping: () => {
    ipcRenderer.send("ping");
  },
  openFBLogin: () => {
    return ipcRenderer.invoke(IPC_EVENTS.OPEN_FB_LOGIN);
  },

  checkForFBSession: () => {
    return ipcRenderer.invoke(IPC_EVENTS.CHECK_FOR_FB_SESSION);
  },

  fbLogOut: () => {
    return ipcRenderer.invoke(IPC_EVENTS.FB_LOG_OUT);
  },

  getFBMarketListings: (settings: SearchFilters) => {
    return ipcRenderer.invoke(IPC_EVENTS.GET_FB_MARKET_LISTINGS, settings);
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
