import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { IPC_EVENTS } from "../shared/ipc-events";
import type { Api } from "./index.d";
import type { ScraperProgress } from "../shared/types";

// Custom APIs for renderer
const api: Api = {
  facebook: {
    openLogin: () => ipcRenderer.invoke(IPC_EVENTS.FB_OPEN_LOGIN),
    checkSession: () => ipcRenderer.invoke(IPC_EVENTS.FB_CHECK_SESSION),
    logout: () => ipcRenderer.invoke(IPC_EVENTS.FB_LOG_OUT),
    scrapeMarketListings: (settings) => ipcRenderer.invoke(IPC_EVENTS.FB_SCRAPE_MARKET_LISTINGS, settings),
    onScrapeProgress: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, progress: ScraperProgress) => callback(progress);
      ipcRenderer.on(IPC_EVENTS.FB_ON_SCRAPE_PROGRESS, listener);
      return () => ipcRenderer.removeListener(IPC_EVENTS.FB_ON_SCRAPE_PROGRESS, listener);
    },
    openBrowser: () => ipcRenderer.invoke(IPC_EVENTS.FB_OPEN_BROWSER)
  },
  llm: {
    analyzeListings: (listings) => ipcRenderer.invoke(IPC_EVENTS.LLM_ANALYZE_LISTINGS, listings)
  },

  listingRepo: {
    getSaved: () => ipcRenderer.invoke(IPC_EVENTS.LISTING_GET_SAVED),
    getPending: () => ipcRenderer.invoke(IPC_EVENTS.LISTING_GET_PENDING),
    getDiscarded: () => ipcRenderer.invoke(IPC_EVENTS.LISTING_GET_DISCARDED),
    save: (listing) => ipcRenderer.invoke(IPC_EVENTS.LISTING_SAVE, listing),
    changeListingStatus: (listingId, status) => ipcRenderer.invoke(IPC_EVENTS.LISTING_CHANGE_STATUS, listingId, status),
    delete: (listingId) => ipcRenderer.invoke(IPC_EVENTS.LISTING_DELETE, listingId),
    deleteAllByStatus: (status) => ipcRenderer.invoke(IPC_EVENTS.LISTING_DELETE_ALL_BY_STATUS, status)
  },

  settingsRepo: {
    getApiKey: () => ipcRenderer.invoke(IPC_EVENTS.SETTINGS_GET_API_KEY),
    setApiKey: (apiKey) => ipcRenderer.invoke(IPC_EVENTS.SETTINGS_SET_API_KEY, apiKey),
    getLocation: () => ipcRenderer.invoke(IPC_EVENTS.SETTINGS_GET_LOCATION),
    setLocation: (latitude, longitude) => ipcRenderer.invoke(IPC_EVENTS.SETTINGS_SET_LOCATION, latitude, longitude)
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
