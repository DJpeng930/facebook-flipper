import ListingCard from "@renderer/components/ListingCard";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Listing } from "src/shared/types";
import Header from "@renderer/components/Header";

export default function DiscardedPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscardedListings() {
      setIsLoading(true);
      const discardedListings = await window.api.listingRepo.getDiscarded();
      setListings(discardedListings);
      setIsLoading(false);
    }

    fetchDiscardedListings();
  }, []);

  async function onListingActionComplete() {
    const discardedListings = await window.api.listingRepo.getDiscarded();
    setListings(discardedListings);
  }

  return (
    <div className="min-h-screen ">
      <Header pageName="Discarded Listings" />

      <div className="pt-2  p-10">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Listings...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{listings.length} discarded listings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showSaveButton onButtonActionComplete={onListingActionComplete} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
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
