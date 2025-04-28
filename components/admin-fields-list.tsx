"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider.tsx"
import type { Field } from "@/lib/database.types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import Link from "next/link"

interface AdminFieldsListProps {
  fields: Field[]
}

export function AdminFieldsList({ fields }: AdminFieldsListProps) {
  const { supabase } = useAuth()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteField = async (fieldId: string) => {
    setDeletingId(fieldId)

    const { error } = await supabase.from("fields").delete().eq("id", fieldId)

    setDeletingId(null)

    if (error) {
      toast({
        title: "Error deleting field",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Field deleted",
      description: "Your field has been successfully deleted.",
    })

    router.refresh()
  }

  return (
    <div>
      {fields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <Card key={field.id}>
              <div className="relative h-48 w-full">
                <Image
                  src={field.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={field.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{field.name}</CardTitle>
                  <Badge>{field.surface_type}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{field.location}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {field.open_time.substring(0, 5)} - {field.close_time.substring(0, 5)}
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold">${field.price_per_hour}/hour</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button asChild variant="outline">
                  <Link href={`/admin/fields/${field.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the field and all associated
                        bookings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteField(field.id)} disabled={deletingId === field.id}>
                        {deletingId === field.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <h3 className="text-lg font-medium">No fields found</h3>
          <p className="text-muted-foreground mt-2">You haven't added any fields yet.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/fields/new">Add Your First Field</Link>
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  )
}
