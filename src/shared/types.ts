export interface FBMarketListing {
  id: string;
  title: string;
  curreny: string;
  age: string;
  description: string;
  price: number;
  location: string;
  photo: string;
  exactLocation: {
    radius: number;
    latitude: number;
    longitude: number;
    vanityPageId: string;
  };
}

export const ITEM_CONDITIONS = ["new", "used_like_new", "used_good", "used_fair"] as const;
type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export const LOCATIONS = ["new_york", "california", "texas", "florida", "illinois", "pennsylvania", "ohio", "georgia", "north_carolina", "michigan"] as const;
type Location = (typeof LOCATIONS)[number];

export const CATEGORIES = ["all", "antiques"] as const;
type Category = (typeof CATEGORIES)[number];

export interface SearchFilters {
  query: string; // Search term to filter listings (previously searchTerm)
  numListings: number; // Number of listings to fetch
  minPrice?: number; // Optional minimum price filter
  maxPrice?: number; // Optional maximum price filter
  daysSinceListed?: number; // Optional days since listed filter
  location?: Location; // Optional location filter
  itemCondition?: ItemCondition; // Optional item condition filter
  category?: Category;
}
