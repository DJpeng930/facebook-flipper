import Store from "electron-store";
import { Listing, ListingStatus } from "../../../shared/types";

interface ListingHashTable {
  [id: string]: Listing;
}

export class ListingRepository {
  private static store = new Store<{ listings: ListingHashTable }>({
    name: "savedListings",
    defaults: {
      listings: {}
    }
  });

  public static getById(id: string): Listing | null {
    const listings = this.store.get("listings");
    return listings[id] || null;
  }

  public static getPending(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "pending");
  }

  public static getDiscarded(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "discarded");
  }

  public static getSaved(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "saved");
  }

  public static getAll(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings);
  }

  public static updateStatus(id: string, status: ListingStatus): void {
    const listings = this.store.get("listings");
    if (listings[id]) {
      listings[id].status = status;
      this.store.set("listings", listings);
    }
  }

  public static saveAll(listings: Listing[]): void {
    const currentListings = this.store.get("listings");

    listings.forEach((listing) => {
      currentListings[listing.id] = listing;
    });

    this.store.set("listings", currentListings);
  }

  public static delete(id: string): void {
    const listings = this.store.get("listings");
    if (listings[id]) {
      delete listings[id];
      this.store.set("listings", listings);
    }
  }

  public static deleteAllByStatus(status: ListingStatus): void {
    const listings = this.store.get("listings");
    Object.entries(listings).forEach(([id, listing]) => {
      if (listing.status === status) {
        delete listings[id];
      }
    });
    this.store.set("listings", listings);
  }

  private static hashToList(listings: ListingHashTable): Listing[] {
    return Object.entries(listings).map(([_id, listing]) => listing);
  }
}
