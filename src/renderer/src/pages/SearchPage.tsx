import { SearchBar } from "@renderer/components/SearchBar";
import { SearchFilters } from "src/shared/types";
import ListingCard from "@renderer/components/ListingCard";
import { Search } from "lucide-react";
import Header from "@renderer/components/Header";
import { useSearch } from "@renderer/contexts/SearchContext";

export default function MarketplaceSearch() {
  const { listings, isLoading, hasSearched, executeSearch, removeListing } = useSearch();

  async function handleSearch(settings: SearchFilters) {
    await executeSearch(settings);
  }

  const handleButtonActionComplete = (listingId: string) => {
    removeListing(listingId);
  };

  return (
    <div className="min-h-screen ">
      <Header pageName="Marketplace Search" />

      <div className="pt-8  p-10">
        {/* Search Form */}

        <div className="mb-4 ">
          <SearchBar isLoading={isLoading} onSearch={handleSearch}></SearchBar>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching marketplaces...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && listings.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Search Results:</h2>
              <p className="text-muted-foreground">{listings.length} listings found and saved</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} showSaveButton showDiscardButton onButtonActionComplete={() => handleButtonActionComplete(listing.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!hasSearched || listings.length === 0) && !isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Ready to find deals?</h3>
              <p className="text-muted-foreground">Enter a search term above to scrape listings from Facebook Marketplace</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
