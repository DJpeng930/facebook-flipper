import { ipcMain } from "electron";
import { IPC_EVENTS } from "../shared/ipc-events";
import { FacebookAuth } from "./services/facebook/auth";
import { FacebookScraper } from "./services/facebook/scraper";
import { LargeLanguageModel } from "./services/open-ai/llm";
import { ListingRepository } from "./services/repositories/listing-repository";

// --- Facebook ---
ipcMain.handle(IPC_EVENTS.FB_OPEN_LOGIN, async () => {
  return await FacebookAuth.login();
});

ipcMain.handle(IPC_EVENTS.FB_CHECK_SESSION, async () => {
  return await FacebookAuth.checkSession();
});

ipcMain.handle(IPC_EVENTS.FB_LOG_OUT, async () => {
  return await FacebookAuth.logout();
});

ipcMain.handle(IPC_EVENTS.FB_SCRAPE_MARKET_LISTINGS, async (_event, settings) => {
  return await FacebookScraper.getMarketplaceListings(settings);
});

// --- LLM ---
ipcMain.handle(IPC_EVENTS.LLM_ANALYZE_LISTINGS, async (_event, listings) => {
  return await LargeLanguageModel.analyzeListings(listings);
});

// --- Listing Repo ---
ipcMain.handle(IPC_EVENTS.LISTING_GET_SAVED, async () => {
  return await ListingRepository.getSavedListings();
});

ipcMain.handle(IPC_EVENTS.LISTING_GET_PENDING, async () => {
  return await ListingRepository.getPendingListings();
});

ipcMain.handle(IPC_EVENTS.LISTING_GET_DISCARDED, async () => {
  return await ListingRepository.getDiscardedListings();
});

ipcMain.handle(IPC_EVENTS.LISTING_CHANGE_STATUS, async (_event, listingId, status) => {
  return await ListingRepository.updateListingStatus(listingId, status);
});
