"use client";

import * as React from "react";
import type { Listing } from "@/lib/types";
import L from "leaflet";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactDOMServer from "react-dom/server";

const DEFAULT_CENTER: L.LatLngExpression = [13.0827, 80.2707];
const DEFAULT_ZOOM = 10;
const SELECTED_ZOOM = 14;

export interface MapViewProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (id: string) => void;
}

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

export function MapView({
  listings,
  selectedListing,
  onSelectListing,
}: MapViewProps) {
  const mapRef = React.useRef<L.Map | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const markersRef = React.useRef<L.Marker[]>([]);

  // Initialize map
  React.useEffect(() => {
    if (mapRef.current === null && containerRef.current) {
      const map = L.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    }
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update view when selectedListing changes
  React.useEffect(() => {
    const map = mapRef.current;
    if (map) {
      if (selectedListing) {
        const center: L.LatLngExpression = [selectedListing.location.lat, selectedListing.location.lng];
        map.setView(center, SELECTED_ZOOM);
      } else {
        map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      }
    }
  }, [selectedListing]);
  
  // Update markers when listings change
  React.useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      listings.forEach(listing => {
        const isSelected = listing.id === selectedListing?.id;
        const marker = L.marker([listing.location.lat, listing.location.lng], {
          icon: createIcon(isSelected),
        })
        .addTo(map)
        .on('click', () => {
          onSelectListing(listing.id);
        })
        .bindPopup(
          ReactDOMServer.renderToString(
            <div className="font-sans">
              <h3 className="font-bold text-base mb-1">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">{listing.address}</p>
            </div>
          )
        );
        markersRef.current.push(marker);
      });
    }
  }, [listings, selectedListing, onSelectListing]);


  return (
    <div className="flex-1 bg-gray-300 relative overflow-hidden">
      <div ref={containerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
      <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm p-2 rounded-lg shadow-lg z-10">
        <p className="text-xs text-muted-foreground">
          Map data &copy; OpenStreetMap contributors.
        </p>
      </div>
    </div>
  );
}
