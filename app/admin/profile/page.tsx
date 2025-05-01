"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OwnerProfile() {
  const { user, userRole, isLoading, supabase } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState({
    about: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || userRole !== "owner")) {
      router.push("/unauthorized")
    } else if (user) {
      // Fetch owner profile
      const fetchProfile = async () => {
        const { data, error } = await supabase.from("owner_profiles").select("*").eq("user_id", user.id).single()

        if (data) {
          setProfile({
            about: data.about || "",
            phone: data.phone || "",
          })
        } else if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is fine for new users
          console.error("Error fetching profile:", error)
        }
      }

      fetchProfile()
    }
  }, [user, userRole, isLoading, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      if (!user) return

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("owner_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("owner_profiles")
          .update({
            about: profile.about,
            phone: profile.phone,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase.from("owner_profiles").insert({
          user_id: user.id,
          about: profile.about,
          phone: profile.phone,
        })

        if (error) throw error
      }

      setMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || userRole !== "owner") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Profile</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={profile.about}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Tell us about yourself or your organization"
                rows={5}
              />
            </div>

            {message && <p className={message.includes("Failed") ? "text-red-500" : "text-green-500"}>{message}</p>}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
