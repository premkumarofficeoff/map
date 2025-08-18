"use client";

import * as React from "react";
import type { Listing } from "@/lib/types";
import { ListingCard } from "./listing-card";
import { ListingFilters } from "./listing-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingSidebarProps {
  listings: Listing[];
  selectedListingId: string | null;
  onSelectListing: (id: string) => void;
  onFilterChange: (filters: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ListingSidebar({
  listings,
  selectedListingId,
  onSelectListing,
  onFilterChange,
  isOpen,
  setIsOpen,
}: ListingSidebarProps) {
  return (
    <>
      <div
        className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out flex flex-col",
          "md:w-96 lg:w-[450px]",
          isOpen ? "w-full md:w-96 lg:w-[450px]" : "w-0 p-0 border-0"
        )}
      >
        <div
          className={cn(
            "flex flex-col h-full",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="p-4 border-b">
            <h2 className="text-xl font-headline font-semibold">
              Explore Properties
            </h2>
          </div>
          <ListingFilters onFilterChange={onFilterChange} />
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isSelected={listing.id === selectedListingId}
                  onSelect={() => onSelectListing(listing.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full rounded-none"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelRightClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </>
  );
}
