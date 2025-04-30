"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { FieldCard } from "@/components/field-card"
import type { Field } from "@/lib/database.types"
import { Skeleton } from "@/components/ui/skeleton"

export function FieldsList() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFields() {
      setLoading(true)
      setError(null)

      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error("Supabase configuration is missing")
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data, error: fetchError } = await supabase.from("fields").select("*")

        if (fetchError) {
          throw fetchError
        }

        setFields(data || [])
      } catch (err: any) {
        console.error("Error fetching fields:", err)
        setError(err.message || "Failed to load fields")
      } finally {
        setLoading(false)
      }
    }

    fetchFields()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium text-red-600">Error loading fields</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium">No fields found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field) => (
        <FieldCard key={field.id} field={field} />
      ))}
    </div>
  )
}
