export const ITEM_CONDITIONS = ["new", "used_like_new", "used_good", "used_fair"] as const;
type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export const LOCATIONS = ["new_york", "california", "texas", "florida", "illinois", "pennsylvania", "ohio", "georgia", "north_carolina", "michigan"] as const;
type Location = (typeof LOCATIONS)[number];

export const CATEGORIES = ["all", "antiques"] as const;
type Category = (typeof CATEGORIES)[number];

export const RECOMMENDATIONS = ["AVOID", "LOW_POTENTIAL", "CONSIDER", "STRONG_BUY"] as const;
type Recommendation = (typeof RECOMMENDATIONS)[number];

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
// Type for the analysis result
export interface ListingValueAnalysis {
  listingId: string;
  estResaleValue: number;
  potentialProfit: number;
  roi: string;
  dealScore: number; // 1-10
  recommendation: Recommendation;
}
export interface Listing {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: "rejected" | "saved" | "pending";
  price: number;
  currency: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
  };
  ageString: string; // e.g., "2 days ago"
  age: number; // milliseconds since 1970
  valueAnalysis?: Omit<ListingValueAnalysis, "listingId">; // Optional field for value analysis
}
