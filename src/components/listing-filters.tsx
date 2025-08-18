"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import * as React from "react";

interface ListingFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ListingFilters({ onFilterChange }: ListingFiltersProps) {
  const [filters, setFilters] = React.useState({
    landType: "all",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFilters((prev) => ({ ...prev, landType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 border-b bg-background"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="landType">Land Type</Label>
          <Select
            name="landType"
            value={filters.landType}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="landType">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Type</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="agricultural">Agricultural</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Price Range (INR)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleInputChange}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Area (sq. ft.)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="minArea"
            placeholder="Min"
            value={filters.minArea}
            onChange={handleInputChange}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            name="maxArea"
            placeholder="Max"
            value={filters.maxArea}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        <Search className="mr-2 h-4 w-4" /> Apply Filters
      </Button>
    </form>
  );
}
