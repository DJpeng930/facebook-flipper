import path from "path";
import { app } from "electron";
import { Listing } from "../../../shared/types";
import fs from "fs";

interface ListingHashTable {
  [id: string]: Listing;
}

export class ListingRepository {
  private static readonly LISTINGS_FILE_PATH: string = path.join(app.getPath("userData"), "listings.json");

  // Simple in-memory cache
  private static cache: ListingHashTable | null = null;

  public static async getListingById(id: string): Promise<Listing | null> {
    const listings = await this.getListings();
    return listings[id] || null;
  }

  public static async getListings(): Promise<ListingHashTable> {
    // Return cached data if we have it
    if (this.cache) {
      return this.cache;
    }

    // Load from file
    if (!fs.existsSync(this.LISTINGS_FILE_PATH)) {
      this.cache = {};
      return this.cache;
    }

    const fileContent = await fs.promises.readFile(this.LISTINGS_FILE_PATH, "utf-8");
    this.cache = JSON.parse(fileContent) as ListingHashTable;
    return this.cache;
  }

  public static async saveListings(listings: Listing[]): Promise<void> {
    await this.getListings(); // Ensure cache is loaded

    // Update cache with all listings
    for (const listing of listings) {
      this.cache![listing.id] = listing;
    }

    // Save once
    await this.saveToFile();
  }

  static async saveListing(listing: Listing): Promise<void> {
    await this.getListings(); // Ensure cache is loaded
    this.cache![listing.id] = listing;
    await this.saveToFile();
  }

  static async updateListing(id: string, updates: Partial<Listing>): Promise<void> {
    await this.getListings(); // Ensure cache is loaded
    this.cache![id] = { ...this.cache![id], ...updates };
    await this.saveToFile();
  }

  private static async saveToFile(): Promise<void> {
    await fs.promises.writeFile(this.LISTINGS_FILE_PATH, JSON.stringify(this.cache, null, 2), "utf-8");
  }

  static getSavedListingsFilePath(): string {
    return this.LISTINGS_FILE_PATH;
  }
}
