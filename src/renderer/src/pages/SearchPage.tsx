import { useState } from "react";
import { Search, MapPin, Clock, TrendingUp, DollarSign, Star, BadgeInfo, X, Check } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { SidebarTrigger } from "@renderer/components/ui/sidebar";
import { Separator } from "@renderer/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@renderer/components/ui/breadcrumb";
import { SearchBar } from "@renderer/components/SearchBar";
import { Listing, SearchFilters } from "src/shared/types";

export default function MarketplaceSearch() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(settings: SearchFilters) {
    setIsLoading(true);
    setHasSearched(true);

    const mockListings = await window.api.getFBMarketListings(settings);
    console.log("Listings received in renderer:", mockListings);

    setListings(mockListings);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen ">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="pt-2  p-10">
        {/* Search Form */}

        <div className="mb-4">
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
        {!isLoading && hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Search Results:</h2>
              <p className="text-muted-foreground">{listings.length} listings found and saved</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
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

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 p-0 gap-0 overflow-hidden  border-1  h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-40 object-cover" />
      </CardHeader>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Title and Price */}
          <div className="space-y-1">
            <a href={`https://www.facebook.com/marketplace/item/${listing.id}/`} target="_blank" rel="noopener noreferrer">
              <CardTitle className="text-base line-clamp-2 leading-tight text-gray-900 h-10 flex items-start">{listing.title}</CardTitle>
            </a>
            <div className="text-xl font-bold text-primary">${listing.price.toLocaleString()}</div>
          </div>

          {/* Deal Score and Status - Combined */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                Score
              </div>
              <div className="font-bold text-amber-600 text-sm">{listing.valueAnalysis?.dealScore}/10</div>
            </div>
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <BadgeInfo className="h-3 w-3 mr-1 text-green-500" />
                Status
              </div>
              <div className="font-bold text-green-700 text-xs">{listing.valueAnalysis!.recommendation}</div>
            </div>
          </div>

          {/* ROI and Profit Combined */}
          <div className="bg-gray-50 rounded-lg p-2 space-y-2">
            <div
              className={`${
                listing.valueAnalysis!.dealScore >= 0 ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200" : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
              } p-2 rounded-md`}
            >
              <div className="flex items-center justify-center">
                <TrendingUp className={`h-3 w-3 mr-1 ${listing.valueAnalysis!.potentialProfit >= 0 ? "text-emerald-600" : "text-red-600"}`} />
                <span className={`text-xs font-medium ${listing.valueAnalysis!.potentialProfit >= 0 ? "text-emerald-800" : "text-red-800"}`}>ROI:</span>
                <span className={`text-sm font-bold ml-1 ${listing.valueAnalysis!.potentialProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>{listing.valueAnalysis!.roi}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <DollarSign className="h-3 w-3 mr-1 text-blue-500" />
                  Resale
                </div>
                <div className="font-bold text-blue-700 text-sm">${listing.valueAnalysis!.estResaleValue.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <DollarSign className="h-3 w-3 mr-1 text-emerald-500" />
                  Profit
                </div>
                <div className="font-bold text-emerald-700 text-sm">${listing.valueAnalysis!.potentialProfit.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Location and Time - Inline */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{listing.location.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{listing.ageString}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-2">
            <Button variant={"outline"} className="flex-1 mt-auto">
              <X className="h-3 w-3 mr-1" />
              Discard
            </Button>

            <Button variant={"outline"} className="flex-1 mt-auto ">
              <Check className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
