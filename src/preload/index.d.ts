import { ElectronAPI } from "@electron-toolkit/preload";
import type { Listing, ListingStatus, SearchFilters, User } from "../shared/types";

export interface Api {
  facebook: {
    openLogin: () => Promise<User | null>;
    checkSession: () => Promise<User | null>;
    logout: () => Promise<boolean>;
    scrapeMarketListings: (settings: SearchFilters) => Promise<Omit<Listing, "valueAnalysis">[]>;
  };

  llm: {
    analyzeListings: (listings: Omit<Listing, "valueAnalysis">[]) => Promise<Listing[]>;
  };

  listingRepo: {
    getSaved: () => Promise<Listing[]>;
    getPending: () => Promise<Listing[]>;
    getDiscarded: () => Promise<Listing[]>;
    save: (listing: Listing) => Promise<boolean>;
    changeListingStatus: (listingId: string, status: ListingStatus) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
