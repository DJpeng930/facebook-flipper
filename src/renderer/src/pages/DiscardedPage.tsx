import ListingCard from "@renderer/components/ListingCard";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Listing } from "src/shared/types";
import Header from "@renderer/components/Header";
import { calculateListingsDistance, cn } from "@renderer/lib/utils";
import FilterBar from "@renderer/components/FilterBar";
import { useListingFilters } from "@renderer/hooks/useListingFilters";
import { usePagination } from "@renderer/hooks/usePagination";
import Pagination from "@renderer/components/Pagination";
import { Button, buttonVariants } from "@renderer/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@renderer/components/ui/alert-dialog";
import { toast } from "sonner";

export default function DiscardedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the custom hook for filtering and sorting
  const { searchQuery, setSearchQuery, sortBy, setSortBy, filteredListings } = useListingFilters(listings);

  // Use pagination hook
  const { currentPage, totalPages, paginatedItems, goToNextPage, goToPreviousPage, hasNextPage, hasPreviousPage } = usePagination({
    items: filteredListings,

    resetDependencies: [searchQuery, sortBy]
  });

  useEffect(() => {
    async function fetchDiscardedListings() {
      setIsLoading(true);
      const discardedListings = await window.api.listingRepo.getDiscarded();
      const listingsWithDistance = await calculateListingsDistance(discardedListings);
      setListings(listingsWithDistance);
      setIsLoading(false);
    }

    fetchDiscardedListings();
  }, []);

  async function onListingActionComplete() {
    const discardedListings = await window.api.listingRepo.getDiscarded();
    const listingsWithDistance = await calculateListingsDistance(discardedListings);
    setListings(listingsWithDistance);
  }

  async function handleDeleteAll() {
    if (listings.length === 0) return;

    try {
      setIsDeleting(true);
      await window.api.listingRepo.deleteAllByStatus("discarded");
      setListings([]);
    } catch (error) {
      console.error("Error deleting all discarded listings:", error);
      toast.error("Failed to delete listings. Please try again.", { duration: 5000 });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen ">
      <Header pageName="Discarded Listings" />

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
          <div className="space-y-4 relative ">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={listings.length}
              filteredCount={filteredListings.length}
              pageType="discarded"
            />
            <div className="absolute top-12 right-0 ">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive" disabled={isDeleting || listings.length === 0}>
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : `Delete All (${listings.length})`}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to permanently delete all {listings.length} discarded listings? This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleDeleteAll} className={cn("cursor-pointer", buttonVariants({ variant: "destructive" }))}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && filteredListings.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedItems.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showSaveButton onButtonActionComplete={onListingActionComplete} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onNextPage={goToNextPage} onPreviousPage={goToPreviousPage} hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} />
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

        {/* Empty State - No Discarded Listings */}
        {listings.length === 0 && !isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No discarded listings</h3>
              <p className="text-muted-foreground">You don&apos;t have any listings discarded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
