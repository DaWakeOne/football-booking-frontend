import { createServerClient } from "@/lib/supabase"
import type { Field } from "@/lib/database.types"
import { notFound } from "next/navigation"
import Image from "next/image"
import { MapPin, Clock, Phone, Mail, Ruler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BookingForm } from "@/components/booking-form"

interface FieldDetailsPageProps {
  params: {
    id: string
  }
}

async function getField(id: string): Promise<Field | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("fields").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching field:", error)
    return null
  }

  return data
}

export default async function FieldDetailsPage({ params }: FieldDetailsPageProps) {
  const field = await getField(params.id)

  if (!field) {
    notFound()
  }

  // Parse availability if it exists
  let availability: Record<string, boolean[]> | null = null
  if (field.availability_json) {
    try {
      availability = JSON.parse(field.availability_json)
    } catch (e) {
      console.error("Error parsing availability JSON:", e)
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={field.image_url || "/placeholder.svg?height=400&width=600"}
              alt={field.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{field.name}</h1>
              <div className="flex flex-col gap-1">
                <Badge>{field.surface_type}</Badge>
                <Badge variant="outline">{field.field_type === "open" ? "Open Field" : "Closed Field"}</Badge>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{field.location}</span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>
                Open from {field.open_time.substring(0, 5)} to {field.close_time.substring(0, 5)}
              </span>
            </div>

            {field.field_size && (
              <div className="flex items-center text-muted-foreground">
                <Ruler className="mr-1 h-4 w-4" />
                <span>Size: {field.field_size}</span>
              </div>
            )}

            <div className="text-xl font-semibold">${field.price_per_hour}/hour</div>

            {(field.contact_phone || field.contact_email) && (
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                {field.contact_phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-1 h-4 w-4" />
                    <span>{field.contact_phone}</span>
                  </div>
                )}
                {field.contact_email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-1 h-4 w-4" />
                    <span>{field.contact_email}</span>
                  </div>
                )}
              </div>
            )}

            {field.description && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{field.description}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Book This Field</h2>
            <BookingForm field={field} />
          </div>
        </div>
      </div>
    </div>
  )
}
