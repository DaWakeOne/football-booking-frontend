"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FieldsFilterProps {
  surfaceTypes: string[]
  locations: string[]
  searchParams: {
    location?: string
    surface_type?: string
    date?: string
    min_price?: string
    max_price?: string
  }
}

export function FieldsFilter({ surfaceTypes, locations, searchParams }: FieldsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [location, setLocation] = useState(searchParams.location || "")
  const [surfaceType, setSurfaceType] = useState(searchParams.surface_type || "")
  const [date, setDate] = useState(searchParams.date || "")
  const [priceRange, setPriceRange] = useState([
    searchParams.min_price ? Number.parseInt(searchParams.min_price) : 0,
    searchParams.max_price ? Number.parseInt(searchParams.max_price) : 100,
  ])

  const handleFilter = () => {
    const params = new URLSearchParams()

    if (location) params.set("location", location)
    if (surfaceType) params.set("surface_type", surfaceType)
    if (date) params.set("date", date)

    params.set("min_price", priceRange[0].toString())
    params.set("max_price", priceRange[1].toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleReset = () => {
    setLocation("")
    setSurfaceType("")
    setDate("")
    setPriceRange([0, 100])
    router.push(pathname)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="surface-type">Surface Type</Label>
          <Select value={surfaceType} onValueChange={setSurfaceType}>
            <SelectTrigger id="surface-type">
              <SelectValue placeholder="Select surface type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Surface Types</SelectItem>
              {surfaceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Price Range ($/hour)</Label>
            <span className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider defaultValue={priceRange} min={0} max={100} step={5} onValueChange={setPriceRange} />
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleFilter}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
