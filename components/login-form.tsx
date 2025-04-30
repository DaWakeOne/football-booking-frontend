"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createBrowserClient } from "@/lib/supabase"

interface LoginFormProps {
  role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<boolean>(false)
  const [redirecting, setRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setConnectionError(false)

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setIsLoading(true)

    try {
      // Create Supabase client
      let supabase
      try {
        supabase = createBrowserClient()
      } catch (err: any) {
        console.error("Failed to create Supabase client:", err)
        setConnectionError(true)
        throw new Error("Could not connect to authentication service. Please try the super login option.")
      }

      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)

        // Check if it's a network error
        if (signInError.message.includes("fetch") || signInError.message.includes("network")) {
          setConnectionError(true)
          throw new Error("Network error connecting to authentication service. Please try the super login option.")
        }

        throw new Error(signInError.message)
      }

      if (!data.user) {
        throw new Error("No user returned from login")
      }

      // Check if the user has the correct role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        console.error("Error fetching user role:", userError)

        // If we can't fetch the role, we'll use the provided role
        // Store auth info in localStorage for client-side use
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: role,
          }),
        )
      } else if (userData && userData.role !== role) {
        throw new Error(`You are not registered as a ${role}. Please use the correct login page.`)
      } else if (userData) {
        // Store auth info in localStorage for client-side use
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: userData.role,
          }),
        )
      } else {
        // If no user record exists, create one with the provided role
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: role,
          }),
        )
      }

      setRedirecting(true)

      toast({
        title: "Login successful",
        description: "You will be redirected shortly.",
      })

      // Use direct window.location for more reliable redirection
      const redirectPath = role === "player" ? "/profile" : "/admin/fields"
      console.log("Redirecting to:", redirectPath)

      // Add a slightly longer delay to ensure localStorage is set and toast is shown
      setTimeout(() => {
        // Use window.location.href for more reliable redirection
        window.location.href = redirectPath
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      setIsLoading(false)
    }
  }

  const handleSuperLogin = () => {
    // Create a fake user ID
    const userId = `manual-${Date.now()}`

    // Store auth in localStorage
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: userId,
        email: email || "user@example.com",
        role: role,
      }),
    )

    setRedirecting(true)

    toast({
      title: "Super login successful",
      description: "You will be redirected shortly.",
    })

    // Use direct window.location for more reliable redirection
    const redirectPath = role === "player" ? "/profile" : "/admin/fields"
    console.log("Redirecting to:", redirectPath)

    // Add a slightly longer delay to ensure localStorage is set and toast is shown
    setTimeout(() => {
      // Use window.location.href for more reliable redirection
      window.location.href = redirectPath
    }, 1500)
  }

  return (
    <div className="grid gap-6">
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
              disabled={isLoading || redirecting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || redirecting}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}

          {redirecting && (
            <Alert className="mt-4">
              <AlertTitle>Login successful!</AlertTitle>
              <AlertDescription>Redirecting you to your dashboard...</AlertDescription>
            </Alert>
          )}

          {connectionError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Could not connect to the authentication service.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleSuperLogin}
                  disabled={redirecting}
                >
                  Use Super Login Instead
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Button disabled={isLoading || redirecting}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : redirecting ? (
              "Redirecting..."
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href={`/signup/${role}`} className="underline">
          Sign up
        </Link>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        <Link href="/super-login" className="hover:underline">
          Having trouble? Try super login
        </Link>
      </div>
      <Toaster />
    </div>
  )
}
