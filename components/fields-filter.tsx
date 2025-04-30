"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"

export function FieldsFilter() {
  const [filters, setFilters] = useState({
    search: "",
    priceRange: [0, 100],
    surfaceTypes: {
      "Natural Grass": false,
      "Artificial Turf": false,
      Indoor: false,
      "5-a-side": false,
      "7-a-side": false,
      "11-a-side": false,
    },
    fieldTypes: {
      open: false,
      closed: false,
    },
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: value })
  }

  const handleSurfaceTypeChange = (type: string, checked: boolean) => {
    setFilters({
      ...filters,
      surfaceTypes: {
        ...filters.surfaceTypes,
        [type]: checked,
      },
    })
  }

  const handleFieldTypeChange = (type: string, checked: boolean) => {
    setFilters({
      ...filters,
      fieldTypes: {
        ...filters.fieldTypes,
        [type]: checked,
      },
    })
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      priceRange: [0, 100],
      surfaceTypes: {
        "Natural Grass": false,
        "Artificial Turf": false,
        Indoor: false,
        "5-a-side": false,
        "7-a-side": false,
        "11-a-side": false,
      },
      fieldTypes: {
        open: false,
        closed: false,
      },
    })
  }

  const hasActiveFilters = () => {
    return (
      filters.search !== "" ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 100 ||
      Object.values(filters.surfaceTypes).some((v) => v) ||
      Object.values(filters.fieldTypes).some((v) => v)
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </span>
          {hasActiveFilters() && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or location"
              className="pl-8"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price Range ($ per hour)</Label>
          <div className="pt-2">
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="my-4"
            />
            <div className="flex justify-between">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Surface Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(filters.surfaceTypes).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`surface-${type}`}
                  checked={filters.surfaceTypes[type as keyof typeof filters.surfaceTypes]}
                  onCheckedChange={(checked) => handleSurfaceTypeChange(type, checked === true)}
                />
                <Label htmlFor={`surface-${type}`} className="text-sm font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Field Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-open"
                checked={filters.fieldTypes.open}
                onCheckedChange={(checked) => handleFieldTypeChange("open", checked === true)}
              />
              <Label htmlFor="field-open" className="text-sm font-normal">
                Open Field
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-closed"
                checked={filters.fieldTypes.closed}
                onCheckedChange={(checked) => handleFieldTypeChange("closed", checked === true)}
              />
              <Label htmlFor="field-closed" className="text-sm font-normal">
                Closed Field
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
