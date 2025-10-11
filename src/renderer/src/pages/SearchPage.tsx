import { SearchBar } from "@renderer/components/SearchBar";
import { SearchFilters } from "src/shared/types";
import ListingCard from "@renderer/components/ListingCard";
import { Ban, Search } from "lucide-react";
import Header from "@renderer/components/Header";
import { useSearch } from "@renderer/contexts/SearchContext";
import { useEffect } from "react";
import { Progress } from "@renderer/components/ui/progress";
import IconTextPage from "@renderer/components/IconTextPage";

export default function MarketplaceSearch() {
  const { listings, isLoading, hasSearched, executeSearch, removeListing, isAnalyzing, isScraping, scraperProgress, setScraperProgress } = useSearch();

  useEffect(() => {
    const unsubscribe = window.api.facebook.onScrapeProgress((progress) => {
      console.log("Scrape progress:", progress);
      setScraperProgress(progress);
    });

    return () => {
      unsubscribe();
    };
  }, [setScraperProgress]);

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
          <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-2xl space-y-6">
              {/* Main Card Container */}
              <div className="p-8 ">
                {/* Spinner and Title */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-foreground">
                      {isScraping && scraperProgress
                        ? scraperProgress.phase === "starting"
                          ? "Initializing..."
                          : scraperProgress.phase === "scrolling"
                            ? "Searching Marketplace"
                            : "Processing Listings"
                        : isAnalyzing
                          ? "AI Analysis"
                          : "Loading..."}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isScraping && scraperProgress
                        ? scraperProgress.phase === "starting"
                          ? "Opening Facebook Marketplace"
                          : scraperProgress.phase === "scrolling"
                            ? "Discovering available listings"
                            : "Extracting listing details"
                        : isAnalyzing
                          ? "Evaluating listings with AI"
                          : "Please wait..."}
                    </p>
                  </div>
                </div>

                {/* Progress Content */}
                {isScraping && scraperProgress && (
                  <div className="space-y-5">
                    {/* Main Progress Bar */}
                    {scraperProgress.phase !== "starting" && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">Progress</span>
                          <span className="text-sm font-semibold text-primary">{scraperProgress.percentage}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={scraperProgress.percentage} className="h-3" />
                        </div>
                      </div>
                    )}

                    {/* Status Message */}
                    {scraperProgress.message && (
                      <div className="flex items-start gap-2 bg-muted/30 rounded-lg p-3 border border-border/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 animate-pulse"></div>
                        <p className="text-sm text-muted-foreground flex-1">{scraperProgress.message}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Analysis State */}
                {isAnalyzing && !isScraping && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">Analyzing each listing for profit potential</p>
                  </div>
                )}
              </div>
            </div>
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
        {!hasSearched && !isLoading && <IconTextPage heading="No search performed" description="Enter a search term above to find listings" icon={Search} />}

        {/* Empty State - No Listings Found After Search */}
        {hasSearched && listings.length === 0 && !isLoading && <IconTextPage heading="No listings found" description="Try adjusting your search criteria" icon={Ban} />}
      </div>
    </div>
  );
}
