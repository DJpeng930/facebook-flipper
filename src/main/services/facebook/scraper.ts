import * as cheerio from "cheerio";
import { PlaywrightManager } from "../browser/playwright";
import type { Element } from "domhandler";
import { Listing, SearchFilters } from "../../../shared/types";
import type { BrowserContext } from "playwright";
import { ListingRepository } from "../repositories/listing-repository";

export class FacebookScraper {
  private static readonly SELECTORS = {
    listingLink: "div.x3ct3a4 a",
    listingDivParent: "div.x8gbvx8.x78zum5.x1q0g3np.x1a02dak.x1nhvcw1.x1rdy4ex.x1lxpwgx.x4vbgl9.x165d6jo",
    listingTitle: "div.xyamay9.xv54qhq.x18d9i69.xf7dkkf h1",
    listingPrice: "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x676frb.x1lkfr7t.x1lbecb7.xk50ysn.xzsf02u",
    listingDescription: "div.xz9dl7a.xyri2b.xsag5q8.x1c1uobl.x126k92a",
    listingLocation: "a span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa",
    listingAge: "span abbr span",
    listingPhoto: "img",
    listingMap: "div.x1n2onr6.xqtp20y.x6ikm8r.x10wlt62 div.x1o0tod.x10l6tqk.x13vifvy",
    noListingsFound: "h2"
  };

  /**
   * Retrieves marketplace listings based on the provided settings.
   *
   * This method performs the following steps:
   * 1. Extracts listing IDs using the provided settings
   * 2. For each ID, extracts detailed listing data from the corresponding page
   * 3. Compiles all listing data into an array
   *
   * @param settings - Configuration settings for retrieving marketplace listings
   * @returns A promise that resolves to an array of marketplace listing objects
   * @async
   */
  public static async getMarketplaceListings(settings: SearchFilters): Promise<Listing[]> {
    const listingIds = await this.extractListingIds(settings);

    const listings: Listing[] = [];
    const batchSize = 10; // Number of listings to process in parallel

    const context = await PlaywrightManager.createFacebookContext();

    for (let i = 0; i < listingIds.length; i += batchSize) {
      const batch = listingIds.slice(i, i + batchSize);

      console.log(`Processing batch of ${batch.length} listings...`);

      await Promise.all(
        batch.map(async (id) => {
          console.log(`Extracting data for listing ID: ${id}`);
          const listingData = await this.extractListingDataFromPage(id, context);
          listings.push(listingData);
          console.log(`Extracted ${listings.length}/${listingIds.length} listings.`);
        })
      );
    }
    await context.close();

    return listings;
  }

  /**
   * Extracts listing data from a Facebook Marketplace page given its id.
   *
   * This method navigates to a Facebook Marketplace listing page using Playwright,
   * scrapes the content using Cheerio, and extracts key information about the listing
   * such as title, price, description, location, and age.
   *
   * @param id - The unique identifier of the Facebook Marketplace listing
   * @returns A Promise that resolves to a FBMarketListing object containing the extracted listing data
   * @throws May throw errors if the page cannot be loaded or if elements cannot be found
   */
  private static async extractListingDataFromPage(id: string, context?: BrowserContext): Promise<Listing> {
    const isExternalContext = context !== undefined;
    if (!isExternalContext) context = await PlaywrightManager.createFacebookContext();

    const page = await context!.newPage();

    await page.goto(`https://www.facebook.com/marketplace/item/${id}`);
    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract basic fields
    const title = $(this.SELECTORS.listingTitle).text().trim();
    const description = $(this.SELECTORS.listingDescription).text().trim();
    const location = $(this.SELECTORS.listingLocation).first().text().trim();
    const age = $(this.SELECTORS.listingAge).text();
    const photo = $(this.SELECTORS.listingPhoto).first().attr("src");

    const price = $(this.SELECTORS.listingPrice)
      .contents()
      .filter(function () {
        return this.nodeType === 3; // Text nodes only
      })
      .text()
      .trim();

    //Extract location coordinates from map div style attr if available
    const exactLocation = {
      name: location,
      latitude: 0,
      longitude: 0,
      distance: null
    };

    const locationStyle = $(this.SELECTORS.listingMap).first().attr("style");

    if (locationStyle) {
      // Extract the URL inside background-image
      const urlMatch = locationStyle.match(/url\(([^)]+)\)/);
      if (urlMatch) {
        // Decode HTML entities (&amp;)
        const url = urlMatch[1].replace(/&amp;/g, "&");

        // Use URL API to parse query parameters
        const params = new URL(url).searchParams;
        const center = params.get("center");

        if (center) {
          const [lat, lng] = center.split(",").map(Number);
          exactLocation.latitude = lat;
          exactLocation.longitude = lng;
        }
      }
    }

    if (!isExternalContext) await context!.close();

    return {
      id,
      title: this.cleanText(title),
      description: this.cleanText(description),
      ageString: age || "Unknown",
      currency: price.replace(/[0-9.,\s]/g, "") || "Unknown",
      price: parseFloat(price.replace(/[^0-9.-]+/g, "")) || 0,
      imageUrl: photo || "https://support.heberjahiz.com/hc/article_attachments/21013076295570",
      location: exactLocation,
      age: 0,
      status: "pending"
    };
  }

  /**
   * Extracts a list of unique Facebook Marketplace listing IDs from search results.
   *
   * This method:
   * 1. Creates a Facebook browser context using PlaywrightManager
   * 2. Navigates to the search URL based on provided settings
   * 3. Scrolls the page incrementally to load more listings via infinite scroll
   * 4. Extracts listing IDs from the page content using Cheerio
   * 5. Continues until the requested number of unique listings is found
   *
   * @param settings - Configuration settings for the Facebook Marketplace search
   * @returns A promise that resolves to an array of unique listing ID strings
   * @throws May throw errors if browser automation fails or if the page structure changes
   */
  private static async extractListingIds(settings: SearchFilters): Promise<string[]> {
    const context = await PlaywrightManager.createFacebookContext();
    const page = await context.newPage();
    await page.goto(this.generateSearchUrl(settings));

    let listingsDivParent: cheerio.Cheerio<Element>;
    const uniqueListingIds = new Set<string>();
    let numScrolls = 0;
    const maxScrolls = settings.maxScrolls || 5;

    while (uniqueListingIds.size < settings.numListings && numScrolls < maxScrolls) {
      const newContent = await page.content();
      const $ = cheerio.load(newContent);

      // If no listings found, break
      if ($(this.SELECTORS.noListingsFound).filter((_, el) => $(el).text().includes("No listings found")).length > 0) {
        console.log("No listings found for the given search criteria.");
        break;
      }

      console.log("Scrolling to load more listings...");
      numScrolls++;
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 2);
      });

      await page.waitForTimeout(2000); // wait for 2 seconds to load more listings

      // Re-select the listings parent div after loading more content
      listingsDivParent = $(this.SELECTORS.listingDivParent) as cheerio.Cheerio<Element>;

      // Select each child listing div and add to set
      const elements = listingsDivParent.children("div").toArray();
      for (const element of elements) {
        const listingId = this.extractListingIdFromCard(element);

        const listingInRepo = listingId ? ListingRepository.getListingById(listingId) : null;
        //If listingId is valid and not already in repo or on previous batch
        if (listingId && listingInRepo === null) {
          uniqueListingIds.add(listingId);
        }
      }

      console.log("Current number of unique listings found:", uniqueListingIds.size);
    }

    // Clean up
    await context.close();

    const finalListings = Array.from(uniqueListingIds).slice(0, settings.numListings);
    console.log(`Extracted ${finalListings.length} unique listing IDs.`);

    return finalListings;
  }

  /**
   * Generates a Facebook Marketplace search URL based on the provided settings.
   *
   * @param settings - The settings to use for the search query.
   * @returns A fully formatted Facebook Marketplace search URL with query parameters.
   * @private
   */
  private static generateSearchUrl(settings: SearchFilters): string {
    //https://www.facebook.com/marketplace/sydney/electronics/?query=laptop
    //https://www.facebook.com/marketplace/sydney/search?query=laptop

    let baseUrl = `https://www.facebook.com/marketplace/${settings.location || "sydney"}/`;

    if (settings.category === "all") {
      baseUrl += "search/?";
    } else {
      baseUrl += `${settings.category}/?`;
    }

    const params = new URLSearchParams();

    if (settings.query) {
      params.append("query", settings.query);
    }
    if (settings.minPrice !== undefined) {
      params.append("minPrice", settings.minPrice.toString());
    }
    if (settings.maxPrice !== undefined) {
      params.append("maxPrice", settings.maxPrice.toString());
    }
    if (settings.daysSinceListed !== undefined) {
      params.append("daysSinceListed", settings.daysSinceListed.toString());
    }
    if (settings.itemCondition) {
      params.append("itemCondition", settings.itemCondition);
    }

    console.log("Generated search URL:", baseUrl + params.toString());

    return baseUrl + params.toString();
  }

  /**
   * Extracts the listing ID from a card element in the Facebook Marketplace.
   *
   * @param card - The DOM Element representing a marketplace listing card
   * @returns The listing ID as a string if found, 'NA' if the ID pattern doesn't match,
   *          or null if the listing link is not found
   * @private
   */
  private static extractListingIdFromCard(card: Element): string | null {
    const $card = cheerio.load(card);

    const link = $card(this.SELECTORS.listingLink).attr("href");

    if (!link) return null;

    const idMatch = link?.match(/\/item\/(\d+)\//);
    return idMatch ? idMatch[1] : "NA";
  }

  /**
   * Cleans text by replacing various Unicode special characters with their ASCII equivalents.
   *
   * @param text - The string to clean
   * @returns A cleaned string with special Unicode characters replaced with standard ASCII equivalents
   */
  private static cleanText(text: string): string {
    return (
      text
        // First handle the Unicode curly quotes directly by character code
        .replace(/\u2019/g, "'") // Right single quotation mark (what we see as ΓÇÖ with code 8217)
        .replace(/\u2018/g, "'") // Left single quotation mark
        .replace(/\u201C/g, '"') // Left double quotation mark
        .replace(/\u201D/g, '"') // Right double quotation mark
        .replace(/\u2013/g, "-") // En dash
        .replace(/\u2014/g, "—") // Em dash
        .replace(/\u00A0/g, " ") // Non-breaking space to regular space
        .replace("×", "x") // Multiplication sign
        .trim()
    );
  }
}
