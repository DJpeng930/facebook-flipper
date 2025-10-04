import Store from "electron-store";
import { Listing, ListingStatus } from "../../../shared/types";

interface ListingHashTable {
  [id: string]: Listing;
}

export class ListingRepository {
  private static store = new Store<{ listings: ListingHashTable }>({
    name: "listings",
    defaults: {
      listings: {}
    }
  });

  public static getListingById(id: string): Listing | null {
    const listings = this.store.get("listings");
    return listings[id] || null;
  }

  public static getPendingListings(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "pending");
  }

  public static getDiscardedListings(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "discarded");
  }

  public static getSavedListings(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings).filter((listing) => listing.status === "saved");
  }

  public static getAllListings(): Listing[] {
    const listings = this.store.get("listings");
    return this.hashToList(listings);
  }

  public static updateListingStatus(id: string, status: ListingStatus): void {
    const listings = this.store.get("listings");
    if (listings[id]) {
      listings[id].status = status;
      this.store.set("listings", listings);
    }
  }

  public static saveListings(listings: Listing[]): void {
    const currentListings = this.store.get("listings");

    listings.forEach((listing) => {
      currentListings[listing.id] = listing;
    });

    this.store.set("listings", currentListings);
  }

  private static hashToList(listings: ListingHashTable): Listing[] {
    return Object.entries(listings).map(([_id, listing]) => listing);
  }
}
