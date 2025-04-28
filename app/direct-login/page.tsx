"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

export default function DirectLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Direct Login</h1>
          <p className="text-sm text-muted-foreground">
            Use this simplified login when the regular login isn't working
          </p>
        </div>

        <Tabs defaultValue="supabase" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="supabase">Supabase Login</TabsTrigger>
            <TabsTrigger value="manual">Manual Login</TabsTrigger>
          </TabsList>
          <TabsContent value="supabase">
            <SupabaseDirectLogin />
          </TabsContent>
          <TabsContent value="manual">
            <ManualLogin />
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm">
          <Link href="/login" className="underline">
            Back to regular login
          </Link>
        </div>
      </div>
    </div>
  )
}

function SupabaseDirectLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("player")
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
      setStatus("Sign in successful, skipping role check...")

      // Store auth in localStorage
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: role,
        }),
      )

      setStatus("Login successful, redirecting...")

      // Force redirect immediately
      const redirectPath = role === "player" ? "/profile" : "/admin/fields"
      window.location.href = redirectPath
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      setStatus(null)
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Direct Login</CardTitle>
        <CardDescription>Login with Supabase but skip role checking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={isLoading}
            >
              <option value="player">Player</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 text-sm rounded text-center">
            <p>Status: {status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ManualLogin() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Generate a fake user ID
    const userId = btoa(email).replace(/=/g, "").substring(0, 36)

    // Store auth in localStorage
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: userId,
        email,
        role,
      }),
    )

    // Redirect based on role
    setTimeout(() => {
      const redirectPath = role === "player" ? "/profile" : "/admin/fields"
      window.location.href = redirectPath
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Login</CardTitle>
        <CardDescription>Bypass Supabase completely (for testing)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-email">Email</Label>
            <Input
              id="manual-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manual-role">Role</Label>
            <select
              id="manual-role"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={isLoading}
            >
              <option value="player">Player</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Login Manually"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        This method doesn't use Supabase at all and just sets up local authentication.
      </CardFooter>
    </Card>
  )
}
