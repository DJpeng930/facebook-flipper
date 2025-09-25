import { useState } from "react";
import { Search, Funnel, DollarSign, Calendar, MapPin, Package, Hash, LoaderCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { ITEM_CONDITIONS, LOCATIONS, CATEGORIES, SearchFilters } from "../../../shared/types";
import { kebabToTitle, snakeToTitle } from "@renderer/lib/utils";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  isLoading: boolean;
}

const dayOptions = [
  { value: 1, label: "24h" },
  { value: 7, label: "7d" },
  { value: 30, label: "30d" }
];

export function SearchBar({ onSearch, initialFilters, isLoading }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters?.query || "",
    numListings: initialFilters?.numListings || 10,
    minPrice: initialFilters?.minPrice,
    maxPrice: initialFilters?.maxPrice,
    daysSinceListed: initialFilters?.daysSinceListed,
    location: initialFilters?.location || LOCATIONS[0],
    itemCondition: initialFilters?.itemCondition,
    category: initialFilters?.category || "all"
  });

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`flex w-full mx-auto  border border-border rounded-xl overflow-hidden`}>
      {/* Left: Categories/Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 sm:h-14 px-4 sm:px-6 rounded-none border-r border-border bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:hover:from-gray-800 dark:hover:to-gray-700 flex items-center gap-3 justify-between transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Filter search options"
          >
            <div className="flex items-center gap-2">
              <Funnel className="h-4 w-4 text-blue-500" />
              <span className="truncate text-sm sm:text-base font-medium">Filters</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg max-h-[70vh] overflow-y-auto" align="start">
          <DropdownMenuLabel className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3 px-1">
            <Funnel className="h-4 w-4 text-blue-500" />
            Filters
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 mb-4" />

          <div className="space-y-4">
            {/* Number of Results & Listed Time - Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  Results
                </label>
                <Select value={filters.numListings.toString()} onValueChange={(value) => updateFilter("numListings", Number.parseInt(value))}>
                  <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                  <Calendar className="h-3.5 w-3.5 text-orange-500" />
                  Listed
                </label>
                <Select value={filters.daysSinceListed?.toString() || "any_time"} onValueChange={(value) => updateFilter("daysSinceListed", value === "any_time" ? undefined : Number.parseInt(value))}>
                  <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_time">Any time</SelectItem>
                    {dayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                <Package className="h-3.5 w-3.5 text-indigo-500" />
                Category
              </label>
              <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value as SearchFilters["category"])}>
                <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.filter((cat) => cat !== "all").map((category) => (
                    <SelectItem key={category} value={category}>
                      {kebabToTitle(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                <DollarSign className="h-3.5 w-3.5 text-green-500" />
                Price Range
              </label>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => updateFilter("minPrice", e.target.value ? Number.parseInt(e.target.value) : undefined)}
                  className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-xs text-gray-400 font-medium px-1">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => updateFilter("maxPrice", e.target.value ? Number.parseInt(e.target.value) : undefined)}
                  className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location & Condition - Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  Location
                </label>
                <Select value={filters.location || "sydney"} onValueChange={(value) => updateFilter("location", value as SearchFilters["location"])}>
                  <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                    <SelectValue placeholder="Sydney" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {snakeToTitle(location)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium mb-2 flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
                  <Package className="h-3.5 w-3.5 text-purple-500" />
                  Condition
                </label>
                <Select value={filters.itemCondition || "any_condition"} onValueChange={(value) => updateFilter("itemCondition", (value as SearchFilters["itemCondition"]) || undefined)}>
                  <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_condition">Any</SelectItem>
                    {ITEM_CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {snakeToTitle(condition)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Center: Search Input */}
      <div className="flex-1 relative border-t sm:border-t-0">
        <Input
          placeholder="Search listings, products, services..."
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
          className="h-12 sm:h-14 border-0 text-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0  px-4 sm:px-6 shadow-none transition-colors"
          onKeyDown={handleKeyDown}
          aria-label="Search input"
        />
      </div>

      {/* Right: Search Button */}
      <Button
        onClick={handleSearch}
        disabled={isLoading || (!filters.query && filters.category === "all")}
        className="h-12 sm:h-14 aspect-square rounded-l-none  bg-blue-500 hover:bg-blue-600"
        aria-label="Search"
      >
        {!isLoading && <Search className="h-4 w-4 sm:h-5 sm:w-5" />}
        {isLoading && <LoaderCircle className="h-5 w-5 animate-spin text-white" />}
      </Button>
    </div>
  );
}
