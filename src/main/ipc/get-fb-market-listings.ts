import { FB_PROFILE_PATH } from "../constants/paths";
import playwright from "patchright";
import * as cheerio from "cheerio";
import { FBMarketListing, GetFbMarketListingsSettings } from "../../shared/types";

const SELECTORS = {
  listingsParent: {
    type: "div",
    class: "x8gbvx8 x78zum5 x1q0g3np x1a02dak x1nhvcw1 x1rdy4ex x1lxpwgx x4vbgl9 x165d6jo"
  },
  listingLink: {
    type: "a",
    class:
      "x1i10hfl xjbqb8w x1ejq31n x18oe1m7 x1sy0etr xstzfhl x972fbf x10w94by x1qhh985 x14e42zd x9f619 x1ypdohk xt0psk2 x3ct3a4 xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xkrqix3 x1sur9pj x1s688f x1lku1pv"
  },
  listingTitle: {
    type: "span",
    class: "x1lliihq x6ikm8r x10wlt62 x1n2onr6"
  },
  listingPrice: {
    type: "span",
    class:
      "x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 x1s688f xzsf02u"
  },
  listingLocation: {
    type: "span",
    class: "x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84"
  }
};

export async function getFBMarketListings(settings: GetFbMarketListingsSettings) {
  // Path to store your Facebook session

  const browser = await playwright.chromium.launchPersistentContext(FB_PROFILE_PATH, {
    channel: "chrome",
    headless: true
  });

  const [page] = browser.pages(); // get the blank page created by launchPersistentContext
  await page.goto("https://www.facebook.com/marketplace/sydney/electronics");
  const content = await page.content();
  let $ = cheerio.load(content);

  // Scroll to load more listings until we have at least settings.numListings
  let listingsDivParent;
  const uniqueListings = new Set<string>();

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function extractListingData(element: any): FBMarketListing | null {
    const title = $(element)
      .find(`${SELECTORS.listingTitle.type}.${SELECTORS.listingTitle.class.split(" ").join(".")}`)
      .text();

    const price = $(element)
      .find(`${SELECTORS.listingPrice.type}.${SELECTORS.listingPrice.class.split(" ").join(".")}`)
      .text();

    const location = $(element)
      .find(
        `${SELECTORS.listingLocation.type}.${SELECTORS.listingLocation.class.split(" ").join(".")}`
      )
      .text();

    const link = $(element)
      .find(`${SELECTORS.listingLink.type}.${SELECTORS.listingLink.class.split(" ").join(".")}`)
      .attr("href");

    if (location && price && title && link) {
      return {
        id: link.match(/\/item\/(\d+)\//)?.[1] || "NA",
        title: title,
        priceString: price,
        price: parseFloat(price.replace(/[^0-9.-]+/g, "")),
        location: location
      };
    }
    return null;
  }

  while (uniqueListings.size < settings.numListings) {
    console.log("Current number of unique listings found:", uniqueListings.size);

    console.log("Scrolling to load more listings...");
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await page.waitForTimeout(2000); // wait for 2 seconds to load more listings
    const newContent = await page.content();
    $ = cheerio.load(newContent);

    // Re-select the listings parent div after loading more content
    listingsDivParent = $(
      `${SELECTORS.listingsParent.type}.${SELECTORS.listingsParent.class.split(" ").join(".")}`
    );

    // Select each child listing div and add to set
    listingsDivParent.children("div").each((_, element) => {
      const listingData = extractListingData(element);
      if (listingData) uniqueListings.add(JSON.stringify(listingData));
    });
  }

  console.log("Finished scraping. Total unique listings found:", uniqueListings.size);
  await browser.close();

  const listings: FBMarketListing[] = [];

  // Convert uniqueListings set back to array of objects
  uniqueListings.forEach((listing) => {
    listings.push(JSON.parse(listing));
  });

  return listings;
}
