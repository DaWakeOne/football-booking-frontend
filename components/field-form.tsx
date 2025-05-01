"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import type { Field } from "@/lib/database.types"
import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, Plus, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FieldFormProps {
  userId: string
  field?: Field
}

const surfaceTypes = ["Natural Grass", "Artificial Turf", "Indoor", "5-a-side", "7-a-side", "11-a-side"]
const fieldTypes = ["open", "closed", "combined"]
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = Array.from({ length: 17 }, (_, i) => `${(i + 6).toString().padStart(2, "0")}:00`)

export function FieldForm({ userId, field }: FieldFormProps) {
  const { supabase } = useAuth()
  const router = useRouter()

  // Initialize availability schedule
  const initialAvailability: Record<string, boolean[]> = {}
  daysOfWeek.forEach((day) => {
    initialAvailability[day] = Array(timeSlots.length).fill(true)
  })

  const [formData, setFormData] = useState({
    name: field?.name || "",
    location: field?.location || "",
    surface_type: field?.surface_type || "",
    price_per_hour: field?.price_per_hour?.toString() || "",
    open_time: field?.open_time?.substring(0, 5) || "09:00",
    close_time: field?.close_time?.substring(0, 5) || "22:00",
    description: field?.description || "",
    image_url: field?.image_url || "",
    contact_phone: field?.contact_phone || "",
    contact_email: field?.contact_email || "",
    field_type: field?.field_type || "open",
    field_size: field?.field_size || "",
  })

  const [availability, setAvailability] = useState<Record<string, boolean[]>>(
    field?.availability || initialAvailability,
  )

  const [images, setImages] = useState<string[]>(field?.image_url ? [field.image_url] : [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvailabilityChange = (day: string, timeIndex: number) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev }
      const dayAvailability = [...newAvailability[day]]
      dayAvailability[timeIndex] = !dayAvailability[timeIndex]
      newAvailability[day] = dayAvailability
      return newAvailability
    })
  }

  const handleAddImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages((prev) => [...prev, newImageUrl])
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    if (!formData.name) {
      setError("Please enter a name for your field")
      setActiveTab("basic")
      return false
    }

    if (!formData.location) {
      setError("Please enter the address of your field")
      setActiveTab("basic")
      return false
    }

    if (!formData.field_type) {
      setError("Please select if your field is open, closed, or combined")
      setActiveTab("basic")
      return false
    }

    if (!formData.surface_type) {
      setError("Please select the surface type of your field")
      setActiveTab("basic")
      return false
    }

    if (!formData.price_per_hour) {
      setError("Please enter the price per hour for your field")
      setActiveTab("basic")
      return false
    }

    // Check if at least one time slot is available
    let hasAvailability = false
    for (const day in availability) {
      if (availability[day].some((available) => available)) {
        hasAvailability = true
        break
      }
    }

    if (!hasAvailability) {
      setError("Please set at least one available time slot for your field")
      setActiveTab("availability")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the field data
      const fieldData: any = {
        name: formData.name,
        location: formData.location,
        surface_type: formData.surface_type,
        price_per_hour: Number.parseFloat(formData.price_per_hour),
        open_time: formData.open_time,
        close_time: formData.close_time,
        description: formData.description || null,
        image_url: images.length > 0 ? images[0] : null, // Use the first image as the main image
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        field_type: formData.field_type,
        field_size: formData.field_size || null,
        // Store availability as a JSON string
        availability_json: JSON.stringify(availability),
        // For additional images, we would typically store them in a separate table
        // but for simplicity, we'll just use the first one as the main image
      }

      if (field) {
        // Update existing field
        const { error } = await supabase.from("fields").update(fieldData).eq("id", field.id)

        if (error) throw error

        toast({
          title: "Field updated",
          description: "Your field has been successfully updated.",
        })
      } else {
        // Create new field
        fieldData.owner_id = userId

        const { error } = await supabase.from("fields").insert(fieldData)

        if (error) throw error

        toast({
          title: "Field created",
          description: "Your field has been successfully created.",
        })

        // Reset form after successful creation
        setFormData({
          name: "",
          location: "",
          surface_type: "",
          price_per_hour: "",
          open_time: "09:00",
          close_time: "22:00",
          description: "",
          image_url: "",
          contact_phone: "",
          contact_email: "",
          field_type: "open",
          field_size: "",
        })
        setAvailability(initialAvailability)
        setImages([])
      }

      // Redirect to admin fields page after a short delay
      setTimeout(() => {
        router.push("/admin/fields")
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error("Error creating/updating field:", error)
      setError(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Field Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Address *</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field_type">Field Type *</Label>
                <Select value={formData.field_type} onValueChange={(value) => handleSelectChange("field_type", value)}>
                  <SelectTrigger id="field_type">
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open Field</SelectItem>
                    <SelectItem value="closed">Closed Field</SelectItem>
                    <SelectItem value="combined">Combined (Open/Closed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="surface_type">Surface Type *</Label>
                <Select
                  value={formData.surface_type}
                  onValueChange={(value) => handleSelectChange("surface_type", value)}
                >
                  <SelectTrigger id="surface_type">
                    <SelectValue placeholder="Select surface type" />
                  </SelectTrigger>
                  <SelectContent>
                    {surfaceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_hour">Price Per Hour ($) *</Label>
                <Input
                  id="price_per_hour"
                  name="price_per_hour"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_hour}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open_time">Opening Time *</Label>
                  <Input
                    id="open_time"
                    name="open_time"
                    type="time"
                    value={formData.open_time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="close_time">Closing Time *</Label>
                  <Input
                    id="close_time"
                    name="close_time"
                    type="time"
                    value={formData.close_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="button" onClick={() => setActiveTab("availability")}>
                  Next: Set Availability
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="availability">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Field Availability Schedule *</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the time slots when your field is available for booking. Uncheck the boxes for times when the
                  field is not available.
                </p>

                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Day
                        </th>
                        {timeSlots.map((time) => (
                          <th
                            key={time}
                            className="px-2 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            {time}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-gray-200">
                      {daysOfWeek.map((day) => (
                        <tr key={day}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{day}</td>
                          {timeSlots.map((time, index) => (
                            <td key={`${day}-${time}`} className="px-2 py-3 whitespace-nowrap text-center">
                              <Checkbox
                                checked={availability[day][index]}
                                onCheckedChange={() => handleAvailabilityChange(day, index)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("additional")}>
                  Next: Additional Details
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="additional">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field_size">Field Size (Optional)</Label>
                <Input
                  id="field_size"
                  name="field_size"
                  value={formData.field_size}
                  onChange={handleChange}
                  placeholder="e.g. 100m x 50m"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone (Optional)</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email (Optional)</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your field, amenities, special features, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Field Images (Optional)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Field image ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="new_image_url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" size="sm" onClick={handleAddImage}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter image URLs to add pictures of your field</p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveTab("availability")}>
                  Back
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/fields")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {field ? "Updating..." : "Creating..."}
                      </>
                    ) : field ? (
                      "Update Field"
                    ) : (
                      "Create Field"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Toaster />
    </Card>
  )
}
