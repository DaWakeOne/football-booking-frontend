"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole } from "@/lib/database.types"

export default function DirectLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
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

      setStatus(`Connecting to Supabase...`)
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      setStatus("Attempting to sign in...")

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

      setStatus("Sign in successful, setting up session...")

      // Store auth in localStorage as a backup
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: role,
        }),
      )

      setStatus("Login successful, redirecting...")

      // Redirect based on role
      setTimeout(() => {
        window.location.href = role === "player" ? "/profile" : "/admin/fields"
      }, 500)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      setStatus(null)
      setIsLoading(false)
    }
  }

  // Alternative method: manual auth
  const handleManualAuth = () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    // Generate a random ID if needed
    const userId = Math.random().toString(36).substring(2, 15)

    // Store in localStorage
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: userId,
        email: email,
        role: role,
      }),
    )

    setStatus("Manual auth data set, redirecting...")

    // Redirect based on role
    setTimeout(() => {
      window.location.href = role === "player" ? "/profile" : "/admin/fields"
    }, 500)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Direct Login</CardTitle>
          <CardDescription>Simplified login for troubleshooting</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status && (
            <Alert className="mb-4">
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Player</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login with Supabase"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-2">Alternative: Manual Auth</h3>
            <p className="text-xs text-muted-foreground mb-4">
              This will bypass Supabase and set auth data directly in localStorage.
            </p>
            <Button onClick={handleManualAuth} variant="outline" className="w-full">
              Set Manual Auth Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
