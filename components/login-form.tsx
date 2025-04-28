"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { createClient } from "@supabase/supabase-js"

interface LoginFormProps {
  role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Create Supabase client directly in the component
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  // Debug environment variables
  useEffect(() => {
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebugInfo("Starting login process...")

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setIsLoading(true)
    setDebugInfo("Validating credentials...")

    try {
      // Check if Supabase URL and key are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration is missing")
      }

      setDebugInfo("Attempting to sign in...")
      console.log("Signing in with:", email)

      // Sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)
        setDebugInfo(`Sign in error: ${signInError.message}`)
        throw signInError
      }

      setDebugInfo("Sign in successful, checking user...")

      if (!data.user) {
        setDebugInfo("No user returned from login")
        throw new Error("No user returned from login")
      }

      console.log("User signed in:", data.user.email)
      setDebugInfo(`User signed in: ${data.user.email}`)

      // Check if the user has the correct role
      setDebugInfo("Checking user role...")
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        console.error("User data error:", userError)
        setDebugInfo(`User data error: ${userError.message}`)
        throw userError
      }

      if (userData.role !== role) {
        setDebugInfo(`Role mismatch: Expected ${role}, got ${userData.role}`)
        throw new Error(`You are not registered as a ${role}. Please use the correct login page.`)
      }

      setDebugInfo(`Login successful as ${role}, redirecting...`)

      // Redirect based on role - use window.location for a full page refresh
      const redirectPath = role === "player" ? "/profile" : "/admin/fields"
      window.location.href = redirectPath
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      setDebugInfo(`Final error: ${error.message}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>

      {debugInfo && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 text-xs rounded">
          <p className="font-mono">Status: {debugInfo}</p>
        </div>
      )}

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href={`/signup/${role}`} className="underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
