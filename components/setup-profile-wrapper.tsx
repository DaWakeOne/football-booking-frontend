"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"
import { useAuth } from "@/components/auth-provider.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserProfile } from "@/app/actions/user-actions"

export function SetupProfileWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <SetupProfileForm />
}

function SetupProfileForm() {
  const { user, supabase, userRole, setUserRole } = useAuth()
  const router = useRouter()

  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      // Check if user already has a profile
      const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single()

      if (!error && data) {
        // User already has a profile, redirect to appropriate page
        if (data.role === "player") {
          router.push("/profile")
        } else {
          router.push("/admin/fields")
        }
        return
      }

      setIsChecking(false)
    }

    checkUserProfile()
  }, [user, supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !user.email) {
      toast({
        title: "Error",
        description: "You must be logged in to complete your profile",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create user profile using server action
      const result = await createUserProfile(user.id, user.email, role)

      if (!result.success) {
        throw new Error(result.error || "Failed to create user profile")
      }

      setUserRole(role)

      toast({
        title: "Profile setup complete",
        description: "Your profile has been set up successfully",
      })

      // Redirect based on role
      if (role === "player") {
        router.push("/profile")
      } else {
        router.push("/admin/fields")
      }
    } catch (error: any) {
      toast({
        title: "Error setting up profile",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Choose your role to complete your profile setup</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ""} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="owner">Field Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up profile...
              </>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
