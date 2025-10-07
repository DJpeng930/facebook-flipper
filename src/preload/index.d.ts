import { ElectronAPI } from "@electron-toolkit/preload";
import type { Listing, ListingStatus, SearchFilters, User, SerializableError, ScraperProgress } from "../shared/types";

export interface Api {
  facebook: {
    openLogin: () => Promise<User | null>;
    checkSession: () => Promise<User | null>;
    logout: () => Promise<boolean>;
    scrapeMarketListings: (settings: SearchFilters) => Promise<Omit<Listing, "valueAnalysis">[]>;
    onScrapeProgress: (callback: (progress: ScraperProgress) => void) => () => void;
    openBrowser: () => Promise<void>;
  };

  llm: {
    analyzeListings: (listings: Omit<Listing, "valueAnalysis">[]) => Promise<{ error?: SerializableError; listings: Listing[] }>;
  };

  listingRepo: {
    getSaved: () => Promise<Listing[]>;
    getPending: () => Promise<Listing[]>;
    getDiscarded: () => Promise<Listing[]>;
    save: (listing: Listing[]) => Promise<boolean>;
    changeListingStatus: (listingId: string, status: ListingStatus) => Promise<void>;
  };

  settingsRepo: {
    getApiKey: () => Promise<string>;
    setApiKey: (apiKey: string) => Promise<void>;
    getLocation: () => Promise<{ latitude: number; longitude: number } | null>;
    setLocation: (latitude: number | null, longitude: number | null) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
