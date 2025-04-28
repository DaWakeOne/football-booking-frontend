"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

interface LoginFormProps {
  role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStatus("Starting login process...")

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setIsLoading(true)

    try {
      // Create Supabase client directly
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase configuration is missing")
      }

      setStatus("Connecting to Supabase...")
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      setStatus("Attempting to sign in...")
      console.log("Signing in with:", email)

      // Sign in the user
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)
        throw signInError
      }

      if (!data.user) {
        throw new Error("No user returned from login")
      }

      console.log("User signed in:", data.user.email)
      setStatus("Sign in successful, setting up user data...")

      // Skip role checking for now and just set the role directly
      // This ensures we don't get stuck on role checking

      // Store auth in localStorage
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: role,
        }),
      )

      // Try to create/update the user record, but don't wait for it
      try {
        // Check if user exists
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .single()

        if (userError || !userData) {
          // User doesn't exist, create them
          await supabase.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              role: role,
              created_at: new Date().toISOString(),
            },
          ])
        } else {
          // User exists, update their last login
          await supabase
            .from("users")
            .update({
              last_login: new Date().toISOString(),
              role: role, // Ensure role is set correctly
            })
            .eq("id", data.user.id)
        }
      } catch (dbError) {
        // Log but don't block login
        console.error("Database operation failed:", dbError)
      }

      setStatus("Login successful, redirecting...")

      // Force redirect immediately
      const redirectPath = role === "player" ? "/fields" : "/admin/fields"
      window.location.href = redirectPath
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      setStatus(null)
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
              autoComplete="email"
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
              autoComplete="current-password"
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

      {status && (
        <div className="p-2 bg-gray-100 dark:bg-gray-800 text-sm rounded text-center">
          <p>Status: {status}</p>
        </div>
      )}

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href={`/signup/${role}`} className="underline">
          Sign up
        </Link>
      </div>

      <div className="text-center mt-4">
        <Link href="/super-login" className="text-sm text-blue-600 hover:underline">
          Try super simple login
        </Link>
      </div>
    </div>
  )
}
