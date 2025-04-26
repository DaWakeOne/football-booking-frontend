import { createServerClient } from "@/lib/supabase"
import type { Field } from "@/lib/database.types"
import { FieldCard } from "@/components/field-card"
import { FieldsFilter } from "@/components/fields-filter"

interface FieldsPageProps {
  searchParams: {
    location?: string
    surface_type?: string
    date?: string
    min_price?: string
    max_price?: string
  }
}

async function getFields(searchParams: FieldsPageProps["searchParams"]): Promise<Field[]> {
  const supabase = createServerClient()

  let query = supabase.from("fields").select("*")

  // Apply filters if they exist
  if (searchParams.location) {
    query = query.ilike("location", `%${searchParams.location}%`)
  }

  if (searchParams.surface_type) {
    query = query.eq("surface_type", searchParams.surface_type)
  }

  if (searchParams.min_price) {
    query = query.gte("price_per_hour", Number.parseFloat(searchParams.min_price))
  }

  if (searchParams.max_price) {
    query = query.lte("price_per_hour", Number.parseFloat(searchParams.max_price))
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching fields:", error)
    return []
  }

  return data
}

async function getSurfaceTypes(): Promise<string[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("fields").select("surface_type").order("surface_type")

  if (error) {
    console.error("Error fetching surface types:", error)
    return []
  }

  // Extract unique surface types
  const surfaceTypes = [...new Set(data.map((field) => field.surface_type))]
  return surfaceTypes
}

async function getLocations(): Promise<string[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("fields").select("location").order("location")

  if (error) {
    console.error("Error fetching locations:", error)
    return []
  }

  // Extract unique locations
  const locations = [...new Set(data.map((field) => field.location))]
  return locations
}

export default async function FieldsPage({ searchParams }: FieldsPageProps) {
  const fields = await getFields(searchParams)
  const surfaceTypes = await getSurfaceTypes()
  const locations = await getLocations()

  const content = (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Football Fields</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FieldsFilter surfaceTypes={surfaceTypes} locations={locations} searchParams={searchParams} />
        </div>

        <div className="md:col-span-3">
          {fields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium">No fields found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return content
}
