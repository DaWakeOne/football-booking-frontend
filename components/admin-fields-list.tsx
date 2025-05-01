"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import type { Field } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, PencilIcon, TrashIcon, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AdminFieldsList() {
  const { user, supabase } = useAuth()
  const [fields, setFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null)

  useEffect(() => {
    const fetchFields = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("fields")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setFields(data || [])
      } catch (err: any) {
        console.error("Error fetching fields:", err)
        setError(err.message || "Failed to load fields")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFields()
  }, [user, supabase])

  const handleDeleteField = async () => {
    if (!fieldToDelete) return

    try {
      const { error } = await supabase.from("fields").delete().eq("id", fieldToDelete.id)

      if (error) throw error

      // Remove the deleted field from the state
      setFields((prev) => prev.filter((field) => field.id !== fieldToDelete.id))
      setFieldToDelete(null)
    } catch (err: any) {
      console.error("Error deleting field:", err)
      setError(err.message || "Failed to delete field")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't created any fields yet.</p>
        <Button asChild>
          <Link href="/admin/fields/new">Create Your First Field</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <Card key={field.id}>
          <CardHeader className="pb-2">
            <CardTitle className="truncate">{field.name}</CardTitle>
            <CardDescription className="truncate">{field.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm capitalize">{field.field_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Surface:</span>
                <span className="text-sm">{field.surface_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Price:</span>
                <span className="text-sm">${field.price_per_hour}/hour</span>
              </div>
              {field.image_url && (
                <div className="mt-4">
                  <img
                    src={field.image_url || "/placeholder.svg"}
                    alt={field.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/fields/${field.id}`}>
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setFieldToDelete(field)}>
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={!!fieldToDelete} onOpenChange={(open) => !open && setFieldToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the field "{fieldToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteField} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
