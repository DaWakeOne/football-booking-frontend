"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/database.types"
import Link from "next/link"

interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // First check localStorage
        const localAuth = localStorage.getItem("auth_user")
        if (localAuth) {
          const authData = JSON.parse(localAuth)
          setUser(authData)
          setIsLoading(false)
          return
        }

        // If no localStorage auth, check Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Supabase configuration is missing")
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          router.push("/login")
          return
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          setError("Could not fetch user data")
        } else {
          setUser({
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || "",
            role: userData.role,
          })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Authentication error")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = () => {
    // Clear localStorage auth
    localStorage.removeItem("auth_user")

    // Sign out from Supabase if available
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey)
        supabase.auth.signOut()
      }
    } catch (e) {
      console.error("Error signing out from Supabase:", e)
    }

    // Redirect to home
    window.location.href = "/"
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Loading profile...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Not logged in</h1>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Email:</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="font-medium">Role:</p>
            <p className="capitalize">{user.role}</p>
          </div>
          <div>
            <p className="font-medium">User ID:</p>
            <p className="text-sm text-muted-foreground break-all">{user.id}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={user.role === "player" ? "/fields" : "/admin/fields"}>
              {user.role === "player" ? "Browse Fields" : "Manage Fields"}
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
