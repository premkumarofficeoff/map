"use client";

import * as React from "react";
import type { Listing } from "@/lib/types";
import { mockListings } from "@/lib/mock-data";
import { Header } from "@/components/header";
import { ListingSidebar } from "@/components/listing-sidebar";
import { ChatPanel } from "@/components/chat-panel";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import type { MapViewProps } from "@/components/map-view";

// Dynamically import MapView with SSR disabled
const MapView = dynamic<MapViewProps>(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => <div className="flex-1 bg-gray-300 animate-pulse" />,
  }
);

export default function Home() {
  const [listings] = React.useState<Listing[]>(mockListings);
  const [selectedListingId, setSelectedListingId] = React.useState<
    string | null
  >(mockListings[0]?.id || null);
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const { toast } = useToast();

  const handleFilterChange = (filters: any) => {
    // A real implementation would fetch from an API
    console.log("Applying filters:", filters);
    toast({
      title: "Filters Applied",
      description: "Listing results have been updated.",
    });
  };

  const selectedListing = React.useMemo(
    () => listings.find((l) => l.id === selectedListingId) || null,
    [listings, selectedListingId]
  );
  
  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <ListingSidebar
          listings={listings}
          selectedListingId={selectedListingId}
          onSelectListing={setSelectedListingId}
          onFilterChange={handleFilterChange}
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <MapView
          listings={listings}
          selectedListing={selectedListing}
          onSelectListing={setSelectedListingId}
        />
      </main>
      <ChatPanel selectedListing={selectedListing} />
    </div>
  );
}
