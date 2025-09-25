import { FacebookScraper } from "../services/facebook/scraper";
import { Listing, SearchFilters } from "../../shared/types";
import { LargeLanguageModel } from "../services/open-ai/llm";
import fs from "fs";
import { ListingRepository } from "../services/repositories/listing-repository";

export async function getFBMarketListings(settings: SearchFilters): Promise<Listing[]> {
  //load listings from mock file for testing
  console.log("Starting Facebook Marketplace listing extraction...");
  const listings = await FacebookScraper.getMarketplaceListings(settings);

  //save response to file for debugging
  console.log("Saving raw listings to mocks/listings.json for debugging...");
  await fs.promises.writeFile(`mocks/listings.json`, JSON.stringify(listings, null, 2));

  console.log("Starting analysis of listings...");
  const analyzedListings = await LargeLanguageModel.analyzeListings(listings);

  console.log("Saving analyzed listings to repo");
  await ListingRepository.saveListings(analyzedListings);

  console.log("Listings with analysis saved to:", ListingRepository.getSavedListingsFilePath());

  return analyzedListings;

  // return [];
  // console.log("Starting Facebook Marketplace listing extraction...");

  // const listings = await FacebookScraper.getMarketplaceListings({
  //   numListings: 10,
  //   query: "laptop"
  // });

  //  save to file for debugging
  // await fs.promises.writeFile(`mocks/listings.json`, JSON.stringify(listings, null, 2));

  return listings;
}
