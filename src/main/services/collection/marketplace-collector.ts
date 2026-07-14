import { Listing, SearchFilters } from "../../../shared/types";
import { FacebookScraper } from "../facebook/scraper";
import { BicycleIdentifier } from "../identification/bicycle-identifier";
import { ListingRepository } from "../repositories/listing-repository";

export class MarketplaceCollector {
  public static async collectFacebookListings(settings: SearchFilters): Promise<Listing[]> {
    const scrapedListings = await FacebookScraper.getMarketplaceListings(settings);
    const uniqueListings = this.deduplicateListings(scrapedListings);

    ListingRepository.saveSearchResults(uniqueListings, {
      query: settings.query || "",
      searchLocation: settings.location || null,
      radiusKm: null
    });
    ListingRepository.saveBicycleIdentifications(uniqueListings.map((listing) => BicycleIdentifier.identify(listing)));

    return uniqueListings;
  }

  private static deduplicateListings(listings: Listing[]): Listing[] {
    const byId = new Map<string, Listing>();

    listings.forEach((listing) => {
      if (!byId.has(listing.id)) {
        byId.set(listing.id, listing);
      }
    });

    return Array.from(byId.values());
  }
}
