
"use client";

import * as React from "react";
import type { Listing } from "@/lib/types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactDOMServer from "react-dom/server";

export interface MapViewProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (id: string) => void;
  center: L.LatLngExpression;
  zoom: number;
}

// Custom component to update map view without re-rendering MapContainer
const ChangeView = ({ center, zoom }: { center: L.LatLngExpression, zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapView({
  listings,
  selectedListing,
  onSelectListing,
  center,
  zoom,
}: MapViewProps) {
  
  // Custom Icon rendering
  const createIcon = (isSelected: boolean) => {
    return L.divIcon({
      html: ReactDOMServer.renderToString(
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
      ),
      className: "bg-transparent border-0",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  return (
    <div className="flex-1 bg-gray-300 relative overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {listings.map((listing) => {
            const isSelected = listing.id === selectedListing?.id;
            return (
              <Marker
                key={listing.id}
                position={[listing.location.lat, listing.location.lng]}
                icon={createIcon(isSelected)}
                eventHandlers={{
                  click: () => {
                    onSelectListing(listing.id);
                  },
                }}
              >
                <Popup>
                  <div className="font-sans">
                    <h3 className="font-bold text-base mb-1">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.address}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm p-2 rounded-lg shadow-lg z-10">
        <p className="text-xs text-muted-foreground">
          Map data &copy; OpenStreetMap contributors.
        </p>
      </div>
    </div>
  );
}
