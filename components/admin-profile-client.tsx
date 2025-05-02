"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserRole } from "@/lib/auth-utils"

export function AdminProfileClient() {
  const { user, supabase, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
  })

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    const role = getUserRole()
    if (!authLoading && (!user || role !== "owner")) {
      router.push("/login/owner")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)

        // Get user email
        const email = user.email || ""

        // Get owner profile
        const { data: ownerData, error: ownerError } = await supabase
          .from("owner_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (ownerError && ownerError.code !== "PGRST116") {
          throw ownerError
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single()

        if (userError) {
          throw userError
        }

        setProfile({
          name: userData?.name || "",
          email,
          phone: ownerData?.phone || "",
          about: ownerData?.about || "",
        })
      } catch (err: any) {
        console.error("Error fetching profile:", err)
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) return

    try {
      setIsSaving(true)

      // Update user name
      const { error: userError } = await supabase.from("users").update({ name: profile.name }).eq("id", user.id)

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
            phone: profile.phone,
            about: profile.about,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("owner_profiles").insert({
          user_id: user.id,
          phone: profile.phone,
          about: profile.about,
        })

        if (insertError) throw insertError
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (err: any) {
      console.error("Error updating profile:", err)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Owner Profile</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and contact details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={profile.name} onChange={handleChange} placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                name="about"
                value={profile.about}
                onChange={handleChange}
                placeholder="Tell us about yourself or your organization"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
