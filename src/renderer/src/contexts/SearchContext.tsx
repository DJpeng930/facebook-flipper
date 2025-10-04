import { createContext, useContext, useState, ReactNode } from "react";
import { Listing, SearchFilters } from "src/shared/types";
import { toast } from "sonner";

interface SearchContextType {
  listings: Listing[];
  isLoading: boolean;
  hasSearched: boolean;
  executeSearch: (settings: SearchFilters) => Promise<void>;
  removeListing: (listingId: string) => void;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function executeSearch(settings: SearchFilters) {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const listings = await window.api.facebook.scrapeMarketListings(settings);

      const res = await window.api.llm.analyzeListings(listings);

      if (res.error?.code === 401) {
        toast.error(`Error: Unauthorized. Please check your API key in Settings.`);
      } else if (res.error) {
        toast.error(`Error analyzing listings: ${res.error.message}`);
      } else {
        await window.api.listingRepo.save(res.listings);
        setListings(res.listings);
        toast.success(`Found ${res.listings.length} listings!`);
      }
    } catch (error) {
      toast.error(`Error during search: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }

  function removeListing(listingId: string) {
    setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
  }

  function clearResults() {
    setListings([]);
    setHasSearched(false);
  }

  return (
    <SearchContext.Provider
      value={{
        listings,
        isLoading,
        hasSearched,
        executeSearch,
        removeListing,
        clearResults
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

//eslint-disable-next-line react-refresh/only-export-components
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
