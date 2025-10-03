import path from "path";
import { app } from "electron";
import { Listing, ListingStatus } from "../../../shared/types";
import fs from "fs";

interface ListingHashTable {
  [id: string]: Listing;
}

export class ListingRepository {
  private static readonly LISTINGS_FILE_PATH: string = path.join(app.getPath("userData"), "listings.json");

  // Simple in-memory cache
  private static cache: ListingHashTable | null = null;

  public static async getListingById(id: string): Promise<Listing | null> {
    await this.initCache();
    return this.cache![id] || null;
  }

  public static async getPendingListings(): Promise<Listing[]> {
    await this.initCache();
    return this.hashToList(this.cache!).filter((listing) => listing.status === "pending");
  }

  public static async getDiscardedListings(): Promise<Listing[]> {
    await this.initCache();
    return this.hashToList(this.cache!).filter((listing) => listing.status === "discarded");
  }

  public static async getSavedListings(): Promise<Listing[]> {
    await this.initCache();
    return this.hashToList(this.cache!).filter((listing) => listing.status === "saved");
  }

  public static async getAllListings(): Promise<Listing[]> {
    await this.initCache();
    return this.hashToList(this.cache!);
  }

  public static async updateListingStatus(id: string, status: ListingStatus): Promise<void> {
    await this.initCache(); // Ensure cache is loaded
    if (this.cache![id]) this.cache![id].status = status;
    await this.saveCacheToFile();
  }

  public static async saveListings(listings: Listing[]): Promise<void> {
    await this.initCache(); // Ensure cache is loaded

    listings.forEach((listing) => {
      this.cache![listing.id] = listing;
    });

    await this.saveCacheToFile();
  }

  private static async initCache(): Promise<void> {
    // Return cached data if we have it
    if (this.cache) return;

    // If file not found, initialize cache
    if (!fs.existsSync(this.LISTINGS_FILE_PATH)) {
      this.cache = {};
      return;
    }

    // Read from file and populate cache
    const fileContent = await fs.promises.readFile(this.LISTINGS_FILE_PATH, "utf-8");
    this.cache = JSON.parse(fileContent) as ListingHashTable;
    return;
  }

  private static async saveCacheToFile(): Promise<void> {
    await this.initCache(); // Ensure cache is loaded

    await fs.promises.writeFile(this.LISTINGS_FILE_PATH, JSON.stringify(this.cache, null, 2), "utf-8");
  }

  private static hashToList(listings: ListingHashTable): Listing[] {
    return Object.entries(listings).map(([_id, listing]) => listing);
  }
}
