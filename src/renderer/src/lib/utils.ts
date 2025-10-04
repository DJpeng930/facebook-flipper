import { clsx, type ClassValue } from "clsx";
import { Listing } from "src/shared/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function kebabToTitle(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function snakeToTitle(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function calculateListingsDistance(listings: Listing[]): Promise<Listing[]> {
  const userLocation = await window.api.settingsRepo.getLocation();
  if (!userLocation) return listings;

  function calculateDistance(listing: Listing): number {
    const { latitude: lat1, longitude: lon1 } = listing.location;
    const { latitude: lat2, longitude: lon2 } = userLocation!;

    // Calculate distance using Haversine formula
    const R = 6371; // Earth radius in km

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c;
  }

  listings.forEach((listing) => {
    listing.location.distance = calculateDistance(listing);
  });

  return listings;
}
