import { ElectronAPI } from "@electron-toolkit/preload";
import type { Listing, SearchFilters, User } from "../shared/types";

export interface Api {
  // Define your custom API methods and properties here
  ping: () => void;
  openFBLogin: () => Promise<User | null>;
  checkForFBSession: () => Promise<User | null>;
  fbLogOut: () => Promise<boolean>;
  getFBMarketListings: (settings: SearchFilters) => Promise<Listing[]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
