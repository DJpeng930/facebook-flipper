import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@renderer/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select";
import { SortOption } from "@renderer/hooks/useListingFilters";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  pageType?: string; // e.g., "pending", "saved", "discarded"
}

export default function FilterBar({ searchQuery, onSearchChange, sortBy, onSortChange, totalCount, filteredCount, pageType = "pending" }: FilterBarProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search by title, description, or location..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 sm:w-auto w-full">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="sm:w-[200px] w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score (Highest)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="distance">Distance (Nearest)</SelectItem>
              <SelectItem value="profit">Profit (Highest)</SelectItem>
              <SelectItem value="recommendation">Recommendation (Best)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredCount} of {totalCount} {pageType} listings
          {searchQuery && " (filtered)"}
        </p>
      </div>
    </div>
  );
}
