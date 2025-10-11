import ListingCard from "@renderer/components/ListingCard";
import { ArchiveX, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Listing } from "src/shared/types";
import Header from "@renderer/components/Header";
import { calculateListingsDistance } from "@renderer/lib/utils";
import FilterBar from "@renderer/components/FilterBar";
import { useListingFilters } from "@renderer/hooks/useListingFilters";
import { usePagination } from "@renderer/hooks/usePagination";
import Pagination from "@renderer/components/Pagination";
import IconTextPage from "@renderer/components/IconTextPage";
import LoadingPage from "@renderer/components/LoadingPage";

export default function SavedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the custom hook for filtering and sorting
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filteredListings } = useListingFilters(listings);

  // Use pagination hook
  const { currentPage, totalPages, paginatedItems, goToNextPage, goToPreviousPage, hasNextPage, hasPreviousPage } = usePagination({
    items: filteredListings,
    resetDependencies: [searchQuery, sortBy]
  });

  useEffect(() => {
    async function fetchSavedListings() {
      setIsLoading(true);
      const savedListings = await window.api.listingRepo.getSaved();
      const listingsWithDistance = await calculateListingsDistance(savedListings);

      console.log("Saved listings:", listingsWithDistance);

      setListings(listingsWithDistance);
      setIsLoading(false);
    }

    fetchSavedListings();
  }, []);

  async function onListingActionComplete() {
    const savedListings = await window.api.listingRepo.getSaved();
    const listingsWithDistance = await calculateListingsDistance(savedListings);
    setListings(listingsWithDistance);
  }

  return (
    <div className="min-h-screen ">
      <Header pageName="Saved Listings" />

      <div className="pt-6  p-10">
        {/* Loading State */}
        {isLoading && <LoadingPage />}

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
              {paginatedItems.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showDiscardButton onButtonActionComplete={onListingActionComplete} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPreviousPage={goToPreviousPage} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} />
          </div>
        )}

        {/* Empty State - No Results from Search */}
        {!isLoading && listings.length > 0 && filteredListings.length === 0 && <IconTextPage heading="No results found" description="Try adjusting your search query" icon={Search} />}

        {/* Empty State - No Saved Listings */}
        {listings.length === 0 && !isLoading && <IconTextPage heading="No saved listings" description="You don't have any listings saved" icon={ArchiveX} />}
      </div>
    </div>
  );
}
