"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/lib/auth-utils"

export default function OwnerProfilePage() {
  const { user, supabase, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    about: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    const role = getUserRole()
    if (!isLoading && (!user || role !== "owner")) {
      router.push("/login/owner")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Fetch owner profile data
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        // First check if owner profile exists
        const { data: ownerProfile, error: profileError } = await supabase
          .from("owner_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        // Then get user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single()

        if (userError) throw userError

        setFormData({
          name: userData?.name || "",
          phone: ownerProfile?.phone || "",
          about: ownerProfile?.about || "",
        })
      } catch (err: any) {
        console.error("Error fetching profile:", err)
        setError("Failed to load profile data")
      }
    }

    fetchProfile()
  }, [user, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user?.id) {
      setError("You must be logged in to update your profile")
      return
    }

    setIsSubmitting(true)

    try {
      // Update user name
      const { error: userError } = await supabase.from("users").update({ name: formData.name }).eq("id", user.id)

      if (userError) throw userError

      // Check if owner profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("owner_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError
      }

      // Update or insert owner profile
      if (existingProfile) {
        const { error: updateError } = await supabase
          .from("owner_profiles")
          .update({
            phone: formData.phone,
            about: formData.about,
          })
          .eq("user_id", user.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("owner_profiles").insert({
          user_id: user.id,
          phone: formData.phone,
          about: formData.about,
        })

        if (insertError) throw insertError
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your profile has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="+1 (123) 456-7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Tell us about yourself or your organization"
                rows={4}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
