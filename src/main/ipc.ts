import { ipcMain } from "electron";
import { IPC_EVENTS } from "../shared/ipc-events";
import { FacebookAuth } from "./services/facebook/auth";
import { MarketplaceCollector } from "./services/collection/marketplace-collector";
import { LargeLanguageModel } from "./services/open-ai/llm";
import { ListingRepository } from "./services/repositories/listing-repository";
import { SettingsRepository } from "./services/repositories/settings-repository";
import { PlaywrightManager } from "./services/browser/playwright";

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
  return await MarketplaceCollector.collectFacebookListings(settings);
});

ipcMain.handle(IPC_EVENTS.FB_OPEN_BROWSER, () => {
  PlaywrightManager.openBrowserWithFacebookContext();
});

// --- LLM ---
ipcMain.handle(IPC_EVENTS.LLM_ANALYZE_LISTINGS, async (_event, listings) => {
  return await LargeLanguageModel.analyzeListings(listings);
});

// --- Listing Repo ---
ipcMain.handle(IPC_EVENTS.LISTING_GET_SAVED, () => {
  return ListingRepository.getSaved();
});

ipcMain.handle(IPC_EVENTS.LISTING_GET_PENDING, () => {
  return ListingRepository.getPending();
});

ipcMain.handle(IPC_EVENTS.LISTING_GET_DISCARDED, () => {
  return ListingRepository.getDiscarded();
});

ipcMain.handle(IPC_EVENTS.LISTING_CHANGE_STATUS, (_event, listingId, status) => {
  ListingRepository.updateStatus(listingId, status);
});

ipcMain.handle(IPC_EVENTS.LISTING_SAVE, (_event, listings) => {
  return ListingRepository.saveAll(listings);
});
ipcMain.handle(IPC_EVENTS.LISTING_DELETE, (_event, listingId) => {
  return ListingRepository.delete(listingId);
});

ipcMain.handle(IPC_EVENTS.LISTING_DELETE_ALL_BY_STATUS, (_event, status) => {
  return ListingRepository.deleteAllByStatus(status);
});

// --- Settings Repo ---
ipcMain.handle(IPC_EVENTS.SETTINGS_GET_API_KEY, async () => {
  return SettingsRepository.getApiKey();
});

ipcMain.handle(IPC_EVENTS.SETTINGS_SET_API_KEY, async (_event, apiKey) => {
  return SettingsRepository.setApiKey(apiKey);
});

ipcMain.handle(IPC_EVENTS.SETTINGS_GET_LOCATION, async () => {
  return SettingsRepository.getLocation();
});

ipcMain.handle(IPC_EVENTS.SETTINGS_SET_LOCATION, async (_event, latitude, longitude) => {
  return SettingsRepository.setLocation(latitude, longitude);
});
