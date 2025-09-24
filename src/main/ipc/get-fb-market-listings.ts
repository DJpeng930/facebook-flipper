import { FBMarketListing } from "../../shared/types";
import { FacebookScraper } from "../services/facebook/scraper";
import { SearchFilters } from "../../shared/types";
import { LargeLanguageModel } from "../services/open-ai/llm";
import fs from "fs";

export async function getFBMarketListings(settings: SearchFilters): Promise<FBMarketListing[]> {
  //load listings from mock file for testing
  const listings: FBMarketListing[] = JSON.parse(await fs.promises.readFile(`mocks/listings.json`, "utf-8"));

  console.log("Sending listings to LLM for analysis...");
  const res = await LargeLanguageModel.analyzeListings(listings);
  console.log("LLM Response:", res);

  //save response to file for debugging
  await fs.promises.writeFile(`mocks/llm-response.json`, JSON.stringify(res, null, 2));

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
