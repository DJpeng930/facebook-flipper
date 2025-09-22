import { FacebookScraper } from "../services/facebook/scraper";

export async function getFBMarketListings() {
  console.log("Starting Facebook Marketplace listing extraction...");

  // Record start time
  const startTime = performance.now();

  const listings = await FacebookScraper.getMarketplaceListings({
    numListings: 10,
    query: "bicycle"
  });

  // Calculate execution time in seconds
  const executionTime = (performance.now() - startTime) / 1000;
  console.log(`Execution time: ${executionTime.toFixed(2)} seconds`);

  console.log("Listing Data Extracted:");
  console.log(listings);

  //save to file for debugging
  // await fs.promises.writeFile(`listings.json`, JSON.stringify(listings, null, 2));

  return listings;
}
