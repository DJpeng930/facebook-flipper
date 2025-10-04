import ListingCard from "@renderer/components/ListingCard";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Listing } from "src/shared/types";
import Header from "@renderer/components/Header";
import { calculateListingsDistance } from "@renderer/lib/utils";
import FilterBar from "@renderer/components/FilterBar";
import { useListingFilters } from "@renderer/hooks/useListingFilters";

export default function SavedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the custom hook for filtering and sorting
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filteredListings } = useListingFilters(listings);

  useEffect(() => {
    async function fetchSavedListings() {
      setIsLoading(true);
      const savedListings = await calculateListingsDistance(await window.api.listingRepo.getSaved());

      console.log("Saved listings:", savedListings);

      setListings(savedListings);
      setIsLoading(false);
    }

    fetchSavedListings();
  }, []);

  async function onListingActionComplete() {
    const savedListings = await window.api.listingRepo.getSaved();
    setListings(savedListings);
  }

  return (
    <div className="min-h-screen ">
      <Header pageName="Saved Listings" />

      <div className="pt-6  p-10">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Listings...</p>
          </div>
        )}

        {/* Search and Filter Bar */}
        {listings.length > 0 && (
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={listings.length}
            filteredCount={filteredListings.length}
            pageType="saved"
          />
        )}

        {/* Results */}
        {!isLoading && filteredListings.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showDiscardButton onButtonActionComplete={onListingActionComplete} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State - No Results from Search */}
        {!isLoading && listings.length > 0 && filteredListings.length === 0 && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          </div>
        )}

        {/* Empty State - No Saved Listings */}
        {listings.length === 0 && !isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved listings</h3>
              <p className="text-muted-foreground">You don&apos;t have any listings saved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
