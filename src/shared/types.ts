export const ITEM_CONDITIONS = ["new", "used_like_new", "used_good", "used_fair"] as const;
type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export const LOCATIONS = ["sydney"] as const;
type Location = (typeof LOCATIONS)[number];

export const CATEGORIES = [
  "all",
  "electronics",
  "vehicles",
  "apparel",
  "classifieds",
  "entertainment",
  "family",
  "free",
  "garden",
  "hobbies",
  "home",
  "home-improvements",
  "instruments",
  "office-supplies",
  "pets",
  "sports",
  "toys"
] as const;
type Category = (typeof CATEGORIES)[number];

export const RECOMMENDATIONS = ["AVOID", "LOW_POTENTIAL", "CONSIDER", "STRONG_BUY"] as const;
type Recommendation = (typeof RECOMMENDATIONS)[number];

export interface User {
  name: string;
  profilePicture?: string;
}

export interface SearchFilters {
  query: string; // Search term to filter listings (previously searchTerm)
  numListings: number; // Number of listings to fetch
  minPrice?: number; // Optional minimum price filter
  maxPrice?: number; // Optional maximum price filter
  daysSinceListed?: number; // Optional days since listed filter
  location?: Location; // Optional location filter
  itemCondition?: ItemCondition; // Optional item condition filter
  category: Category;
  maxScrolls?: number; // Max number of scrolls it can perfom to search for unique listings (default 5)
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

export type ListingStatus = "pending" | "saved" | "discarded";
export interface Listing {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: ListingStatus;
  price: number;
  currency: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    distance: number | null;
  };
  ageString: string; // e.g., "2 days ago"
  age: number; // milliseconds since 1970
  valueAnalysis?: Omit<ListingValueAnalysis, "listingId">; // Optional field for value analysis
}

export type BicycleCategory =
  | "road"
  | "mountain"
  | "gravel"
  | "hybrid"
  | "commuter"
  | "electric"
  | "bmx"
  | "kids"
  | "triathlon"
  | "cyclocross"
  | "component_or_accessory"
  | "unknown";

export type BicycleComponentType = "groupset" | "derailleur" | "brakes" | "fork" | "shock" | "wheels" | "drivetrain" | "frame" | "other";

export interface BicycleComponent {
  componentType: BicycleComponentType;
  brand?: string;
  model?: string;
  tier?: string;
  conditionNote?: string;
  confidence: number;
  rawText: string;
}

export interface BicycleIdentification {
  listingId: string;
  isBicycle: boolean;
  brand?: string;
  modelFamily?: string;
  exactModelCandidate?: string;
  alternativeCandidates: string[];
  probableYear?: number;
  probableYearRange?: string;
  category: BicycleCategory;
  frameMaterial?: string;
  frameSize?: string;
  confidence: number;
  extractionMethod: "deterministic_text";
  explanation: string;
  components: BicycleComponent[];
}
export interface AppSettings {
  apiKey: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

export interface SerializableError {
  message: string;
  code?: number | string;
  status?: number;
  type?: string;
  name: string;
}

export interface ScraperProgress {
  phase: "starting" | "scrolling" | "extracting";
  listingsToExtract: number; // Total listings to extract
  listingsExtracted: number; // Number of listings extracted so far
  message: string; // Status message to display
  currentScroll?: number; // Current scroll number (for scrolling phase)
  maxScrolls?: number; // Maximum scrolls (for scrolling phase)
  percentage: number; // Overall percentage (0-100)
}
