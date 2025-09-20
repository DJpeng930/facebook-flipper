export interface FBMarketListing {
  id: string;
  title: string;
  priceString: string;
  price: number;
  location: string;
}

export interface GetFbMarketListingsSettings {
  numListings: number; // Number of listings to fetch
  location?: string; // Optional location filter
  minPrice?: number; // Optional minimum price filter
  maxPrice?: number; // Optional maximum price filter
}
