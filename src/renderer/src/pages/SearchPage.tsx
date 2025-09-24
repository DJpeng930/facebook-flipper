import { useState } from "react";
import { Search, MapPin, Clock, TrendingUp, DollarSign, Star, BadgeInfo, X, Check } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { SidebarTrigger } from "@renderer/components/ui/sidebar";
import { Separator } from "@renderer/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@renderer/components/ui/breadcrumb";
import { SearchBar } from "@renderer/components/SearchBar";

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  seller: string;
  postedTime: string;
  image: string;
  description: string;
  dealScore: number;
  askingPrice: number;
  estResaleValue: number;
  potentialProfit: number;
  roi: string;
}

// Mock data generator for marketplace listings
const generateMockListings = (): MarketplaceListing[] => {
  const categories = ["Electronics", "Furniture", "Clothing", "Books", "Sports", "Home & Garden"];
  const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"];
  const sellers = ["TechDeals Pro", "Vintage Finds", "Quick Sales", "Premium Goods", "Local Trader"];

  return Array.from({ length: 8 }, (_, i) => {
    const price = Math.floor(Math.random() * 500) + 20;

    // Create a mix of good and bad deals
    const isGoodDeal = Math.random() > 0.4; // 60% good deals, 40% bad deals

    let estResaleValue: number;
    let dealScore: number;

    if (isGoodDeal) {
      // Good deals: 20-80% markup potential
      estResaleValue = Math.floor(price * (1.2 + Math.random() * 0.6));
      dealScore = Math.floor(Math.random() * 4) + 6; // Score between 6-9
    } else {
      // Bad deals: break even to slight loss or minimal profit
      const dealType = Math.random();
      if (dealType < 0.3) {
        // Break even or slight loss (90-100% of asking price)
        estResaleValue = Math.floor(price * (0.9 + Math.random() * 0.1));
        dealScore = Math.floor(Math.random() * 3) + 1; // Score between 1-3
      } else if (dealType < 0.7) {
        // Minimal profit (100-115% of asking price)
        estResaleValue = Math.floor(price * (1.0 + Math.random() * 0.15));
        dealScore = Math.floor(Math.random() * 2) + 4; // Score between 4-5
      } else {
        // Overpriced items (85-95% of asking price - loss)
        estResaleValue = Math.floor(price * (0.85 + Math.random() * 0.1));
        dealScore = Math.floor(Math.random() * 2) + 1; // Score between 1-2
      }
    }

    const potentialProfit = estResaleValue - price;
    const roi = Math.floor((potentialProfit / price) * 100);

    return {
      id: `listing-${i + 1}`,
      title: `${"test"} - ${isGoodDeal ? "Premium Quality" : Math.random() > 0.5 ? "Fair Condition" : "As-Is"} Item ${i + 1}`,
      price,
      location: locations[Math.floor(Math.random() * locations.length)],
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 10,
      category: categories[Math.floor(Math.random() * categories.length)],
      seller: sellers[Math.floor(Math.random() * sellers.length)],
      postedTime: `${Math.floor(Math.random() * 7) + 1} days ago`,
      image: `https://scontent.fcbr1-1.fna.fbcdn.net/v/t45.5328-4/548084461_1511594003347147_6726051255817694825_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=102&ccb=1-7&_nc_sid=247b10&_nc_ohc=Ud13dS37yVcQ7kNvwGeLcC-&_nc_oc=AdkoPAfgzfN4TDX_D9i8t8ZhecHknRPcdNW9ISmzzzUDDbFTFQ1bx-AUW4dak0k5XOM&_nc_zt=23&_nc_ht=scontent.fcbr1-1.fna&_nc_gid=VbFT9ZYpP3TAdwAFjzCRrw&oh=00_AfZQJmh5zn6OkxX1H-TfFI6LFW_cb8ctFwWwrySxuRluzg&oe=68D8381E`,
      description: `${isGoodDeal ? "High-quality" : "Standard"} ${"".toLowerCase()} in ${isGoodDeal ? "excellent" : "fair"} condition. ${isGoodDeal ? "Perfect for anyone looking for reliable and affordable options." : "Sold as-is, may need some attention."}`,
      dealScore,
      askingPrice: price,
      estResaleValue,
      potentialProfit,
      roi: `${roi}%`
    };
  });
};

export default function MarketplaceSearch() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockListings = generateMockListings();
    setListings(mockListings);
    setIsLoading(false);
  };

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
          <SearchBar
            isLoading={isLoading}
            onSearch={() => {
              handleSearch();
            }}
          ></SearchBar>
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

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  return (
    <Card className="hover:shadow-md transition-all duration-300 p-0 gap-0 overflow-hidden  border-1  h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <img src={listing.image} alt={listing.title} className="w-full h-40 object-cover" />
      </CardHeader>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Title and Price */}
          <div className="space-y-1">
            <CardTitle className="text-base line-clamp-2 leading-tight text-gray-900 h-10 flex items-start">{listing.title}</CardTitle>
            <div className="text-xl font-bold text-primary">${listing.price.toLocaleString()}</div>
          </div>

          {/* Deal Score and Status - Combined */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Star className="h-3 w-3 mr-1 text-amber-500" />
                Score
              </div>
              <div className="font-bold text-amber-600 text-sm">{listing.dealScore}/10</div>
            </div>
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <BadgeInfo className="h-3 w-3 mr-1 text-green-500" />
                Status
              </div>
              <div className="font-bold text-green-700 text-xs">INSTA BUY</div>
            </div>
          </div>

          {/* ROI and Profit Combined */}
          <div className="bg-gray-50 rounded-lg p-2 space-y-2">
            <div
              className={`${
                listing.potentialProfit >= 0 ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200" : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
              } p-2 rounded-md`}
            >
              <div className="flex items-center justify-center">
                <TrendingUp className={`h-3 w-3 mr-1 ${listing.potentialProfit >= 0 ? "text-emerald-600" : "text-red-600"}`} />
                <span className={`text-xs font-medium ${listing.potentialProfit >= 0 ? "text-emerald-800" : "text-red-800"}`}>ROI:</span>
                <span className={`text-sm font-bold ml-1 ${listing.potentialProfit >= 0 ? "text-emerald-700" : "text-red-700"}`}>{listing.roi}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <DollarSign className="h-3 w-3 mr-1 text-blue-500" />
                  Resale
                </div>
                <div className="font-bold text-blue-700 text-sm">${listing.estResaleValue.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-md p-2 border border-gray-200">
                <div className="flex items-center text-xs text-gray-600 mb-1">
                  <DollarSign className="h-3 w-3 mr-1 text-emerald-500" />
                  Profit
                </div>
                <div className="font-bold text-emerald-700 text-sm">${listing.potentialProfit.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Location and Time - Inline */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{listing.postedTime}</span>
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
