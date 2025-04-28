"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@supabase/supabase-js"

export function FieldsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [locations, setLocations] = useState<string[]>([])
  const [surfaceTypes, setSurfaceTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [surfaceType, setSurfaceType] = useState(searchParams.get("surface_type") || "")
  const [date, setDate] = useState(searchParams.get("date") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("min_price") || "0"),
    Number.parseInt(searchParams.get("max_price") || "100"),
  ])

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Supabase configuration is missing")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Fetch locations
        const { data: locationsData } = await supabase.from("fields").select("location").order("location")

        // Fetch surface types
        const { data: surfaceData } = await supabase.from("fields").select("surface_type").order("surface_type")

        if (locationsData) {
          const uniqueLocations = [...new Set(locationsData.map((item) => item.location))]
          setLocations(uniqueLocations)
        }

        if (surfaceData) {
          const uniqueSurfaceTypes = [...new Set(surfaceData.map((item) => item.surface_type))]
          setSurfaceTypes(uniqueSurfaceTypes)
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (location) params.set("location", location)
    if (surfaceType) params.set("surface_type", surfaceType)
    if (date) params.set("date", date)
    params.set("min_price", priceRange[0].toString())
    params.set("max_price", priceRange[1].toString())

    router.push(`/fields?${params.toString()}`)
  }

  const handleReset = () => {
    setLocation("")
    setSurfaceType("")
    setDate("")
    setPriceRange([0, 100])
    router.push("/fields")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Filter Fields</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
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
              <SelectItem value="all">All surfaces</SelectItem>
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
            <span className="text-sm">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            max={100}
            step={5}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
        </div>

        <Button className="w-full" onClick={handleApplyFilters}>
          Apply Filters
        </Button>

        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
