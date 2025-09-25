import { FacebookScraper } from "../services/facebook/scraper";
import { Listing, SearchFilters } from "../../shared/types";
import { LargeLanguageModel } from "../services/open-ai/llm";
import { ListingRepository } from "../services/repositories/listing-repository";

export async function getFBMarketListings(settings: SearchFilters): Promise<Listing[]> {
  //load listings from mock file for testing
  console.log("Starting Facebook Marketplace listing extraction...");
  const listings = await FacebookScraper.getMarketplaceListings(settings);

  console.log("Starting analysis of listings...");
  const analyzedListings = await LargeLanguageModel.analyzeListings(listings);

  console.log("Saving analyzed listings to repo");
  await ListingRepository.saveListings(analyzedListings);

  console.log("Listings with analysis saved to:", ListingRepository.getSavedListingsFilePath());

  return analyzedListings;
}
