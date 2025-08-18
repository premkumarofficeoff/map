"use client";

import type { Listing } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { IndianRupee, LandPlot, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  isSelected: boolean;
  onSelect: () => void;
}

export function ListingCard({
  listing,
  isSelected,
  onSelect,
}: ListingCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected
          ? "ring-2 ring-primary shadow-lg"
          : "hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint="property land"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline mb-1 leading-tight">
            {listing.title}
          </CardTitle>
          <Badge variant={listing.negotiable ? "default" : "secondary"} className={cn(listing.negotiable ? "bg-accent text-accent-foreground" : "")}>
            {listing.negotiable ? "Negotiable" : "Fixed Price"}
          </Badge>
        </div>
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {listing.address}
        </CardDescription>

        <div className="flex items-center justify-between text-sm text-foreground">
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="font-semibold text-base">
              {formatPrice(listing.price)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LandPlot className="w-4 h-4 text-primary" />
            <span className="font-semibold text-base">
              {listing.areaSqFt.toLocaleString("en-IN")} sq.ft.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
