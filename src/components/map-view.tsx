"use client";

import type { Listing } from "@/lib/types";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MapViewProps {
  listings: Listing[];
  selectedListingId: string | null;
  onSelectListing: (id: string) => void;
}

export function MapView({
  listings,
  selectedListingId,
  onSelectListing,
}: MapViewProps) {
  // These are placeholder scaling factors. A real map implementation would use projection logic.
  const MAP_BOUNDS = {
    lat: { min: 12.9, max: 13.1 },
    lng: { min: 80.05, max: 80.3 },
  };

  const getPosition = (lat: number, lng: number) => {
    const top =
      ((MAP_BOUNDS.lat.max - lat) /
        (MAP_BOUNDS.lat.max - MAP_BOUNDS.lat.min)) *
      100;
    const left =
      ((lng - MAP_BOUNDS.lng.min) /
        (MAP_BOUNDS.lng.max - MAP_BOUNDS.lng.min)) *
      100;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="flex-1 bg-gray-300 relative overflow-hidden">
      <Image
        src="https://placehold.co/1600x1200.png"
        alt="Map of Chennai"
        layout="fill"
        objectFit="cover"
        data-ai-hint="city map"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      {/* In a real app, this would be a <MapboxGL> or <Leaflet> component */}
      <div className="absolute inset-0" aria-label="Map of land listings">
        {listings.map((listing) => {
          const { top, left } = getPosition(
            listing.location.lat,
            listing.location.lng
          );
          const isSelected = listing.id === selectedListingId;

          return (
            <button
              key={listing.id}
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
              style={{ top, left }}
              onClick={() => onSelectListing(listing.id)}
              aria-label={`Select listing: ${listing.title}`}
            >
              <div className="relative flex flex-col items-center">
                <MapPin
                  className={cn(
                    "h-10 w-10 drop-shadow-lg",
                    isSelected
                      ? "text-accent fill-accent/50"
                      : "text-primary fill-primary/50"
                  )}
                  strokeWidth={1.5}
                />
                {isSelected && (
                  <Star className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
       <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <p className="text-xs text-muted-foreground">Map is for illustration only.</p>
        </div>
    </div>
  );
}
