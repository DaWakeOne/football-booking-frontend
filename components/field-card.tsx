import type { Field } from "@/lib/database.types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FieldCardProps {
  field: Field
}

export function FieldCard({ field }: FieldCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={field.image_url || "/placeholder.svg?height=200&width=400"}
          alt={field.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{field.name}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge>{field.surface_type}</Badge>
            <Badge variant="outline">{field.field_type === "open" ? "Open Field" : "Closed Field"}</Badge>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{field.location}</span>
        </div>
        {field.field_size && (
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span>Size: {field.field_size}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            {field.open_time.substring(0, 5)} - {field.close_time.substring(0, 5)}
          </span>
        </div>
        <p className="mt-2 text-lg font-semibold">${field.price_per_hour}/hour</p>

        {(field.contact_phone || field.contact_email) && (
          <div className="mt-2 space-y-1">
            {field.contact_phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-1 h-4 w-4" />
                <span>{field.contact_phone}</span>
              </div>
            )}
            {field.contact_email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-4 w-4" />
                <span>{field.contact_email}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/fields/${field.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
