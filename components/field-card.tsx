"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star } from "lucide-react"
import type { Field } from "@/lib/database.types"

interface FieldCardProps {
  field: Field
}

export function FieldCard({ field }: FieldCardProps) {
  // Handle potentially undefined properties with default values
  const name = field?.name || "Unnamed Field"
  const location = field?.location || "Location not specified"
  const price_per_hour = field?.price_per_hour || 0
  const surface_type = field?.surface_type || "Not specified"
  const rating = field?.rating || 0
  const id = field?.id || "unknown"

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={field?.image_url || "/placeholder.svg?height=200&width=400&query=football+field"}
          alt={name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-white text-black">{surface_type}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>Available 8:00 AM - 10:00 PM</span>
        </div>
        <div className="flex items-center text-sm mb-2">
          <Star className="h-4 w-4 mr-1 text-yellow-500" />
          <span>{rating.toFixed(1)} (23 reviews)</span>
        </div>
        <div className="text-lg font-bold mt-2">${price_per_hour}/hour</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/fields/${id}`}>View Details</Link>
        </Button>
        <Button asChild>
          <Link href={`/fields/${id}/book`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
