import { ElectronAPI } from "@electron-toolkit/preload";
import type { FBMarketListing, SearchFilters } from "../shared/types";

export interface Api {
  // Define your custom API methods and properties here
  ping: () => void;
  openFBLogin: () => Promise<boolean>;
  checkForFBSession: () => Promise<boolean>;
  fbLogOut: () => Promise<void>;
  getFBMarketListings: (settings: SearchFilters) => Promise<FBMarketListing[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
