import { useState, useMemo } from "react";
import { Listing } from "src/shared/types";

export type SortOption = "date" | "price" | "distance" | "profit" | "score" | "recommendation";

export function useListingFilters(listings: Listing[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("score");

  // Filter and sort listings
  const filteredAndSortedListings = useMemo(() => {
    return listings
      .filter((listing) => {
        if (!searchQuery) return true;

        const searchLower = searchQuery.toLowerCase();
        return listing.title.toLowerCase().includes(searchLower) || listing.description?.toLowerCase().includes(searchLower) || listing.location.name.toLowerCase().includes(searchLower);
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price":
            return (a.price || 0) - (b.price || 0);
          case "distance":
            return (a.location.distance || Infinity) - (b.location.distance || Infinity);
          case "profit":
            return (b.valueAnalysis?.potentialProfit || 0) - (a.valueAnalysis?.potentialProfit || 0);
          case "score":
            return (b.valueAnalysis?.dealScore || 0) - (a.valueAnalysis?.dealScore || 0);
          case "recommendation": {
            const recommendationOrder = { STRONG_BUY: 4, CONSIDER: 3, LOW_POTENTIAL: 2, AVOID: 1 };
            const aRec = a.valueAnalysis?.recommendation || "AVOID";
            const bRec = b.valueAnalysis?.recommendation || "AVOID";
            return recommendationOrder[bRec] - recommendationOrder[aRec];
          }
          default:
            return b.age - a.age;
        }
      });
  }, [listings, searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredListings: filteredAndSortedListings
  };
}
