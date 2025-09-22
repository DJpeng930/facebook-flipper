import { FacebookScraper } from "../services/facebook/scraper";

export async function getFBMarketListings() {
  // Path to store your Facebook session
  console.log("Starting Facebook Marketplace listing extraction...");

  const listings = await FacebookScraper.getMarketplaceListings({
    numListings: 10,
    query: "bicycle"
  });

  console.log("Listing Data Extracted:");
  console.log(listings);

  //save to file for debugging
  // await fs.promises.writeFile(`listings.json`, JSON.stringify(listings, null, 2));

  // Example of how to use the extracted data

  return listings;
}
