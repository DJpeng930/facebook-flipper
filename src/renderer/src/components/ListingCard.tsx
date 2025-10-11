import { MapPin, Clock, TrendingUp, DollarSign, Star, BadgeInfo, X, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Listing } from "src/shared/types";
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
import { cn } from "@renderer/lib/utils";
interface Props {
  listing: Listing;
  showDiscardButton?: boolean;
  showSaveButton?: boolean;
  onButtonActionComplete?: () => void;
}

export default function ListingCard({ listing, showDiscardButton = false, showSaveButton = false, onButtonActionComplete }: Props) {
  async function handleDiscard() {
    await window.api.listingRepo.changeListingStatus(listing.id, "discarded");
    onButtonActionComplete?.();
  }

  async function handleSave() {
    await window.api.listingRepo.changeListingStatus(listing.id, "saved");
    onButtonActionComplete?.();
  }

  async function handleDelete() {
    await window.api.listingRepo.delete(listing.id);
    onButtonActionComplete?.();
  }

  return (
    <Card className="hover:shadow-md transition-all duration-300 p-0 gap-0 overflow-hidden  border-1  h-full flex flex-col group">
      <CardHeader className="p-0 relative">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-40 object-cover" loading="lazy" />
        {/* //delete button */}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this listing <b>({listing.title})</b>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>

              <AlertDialogAction onClick={handleDelete} className={cn("cursor-pointer", buttonVariants({ variant: "destructive" }))}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="space-y-2 flex-1 flex flex-col">
          {/* Title and Price */}
          <div className="space-y-1">
            <a href={`https://www.facebook.com/marketplace/item/${listing.id}/`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <CardTitle className="text-base line-clamp-2 leading-tight text-gray-900 h-10 flex items-start">{listing.title}</CardTitle>
            </a>
            <div className="text-xl font-bold text-primary">
              {listing.currency}
              {listing.price.toLocaleString()}
            </div>
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
              <div className="font-bold text-green-700 text-xs">{listing.valueAnalysis?.recommendation}</div>
            </div>
          </div>

          {/* ROI and Profit Combined */}
          {listing.valueAnalysis && (
            <div className="bg-gray-50 rounded-lg p-2 space-y-2">
              <div
                className={`${
                  listing.valueAnalysis!.potentialProfit >= 0
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
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
          )}
          {/* Location and Time - Inline */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{listing.location.distance === null ? listing.location.name : listing.location.distance.toFixed(1) + " km"}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{listing.ageString}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-2">
            {showDiscardButton && (
              <Button variant={"outline"} className="flex-1 mt-auto" onClick={handleDiscard}>
                <X className="h-3 w-3 mr-1" />
                Discard
              </Button>
            )}

            {showSaveButton && (
              <Button variant={"outline"} className="flex-1 mt-auto" onClick={handleSave}>
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
