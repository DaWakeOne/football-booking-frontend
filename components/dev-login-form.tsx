"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { devLogin } from "@/app/actions/auth-actions"

interface DevLoginFormProps {
  role: UserRole
}

export function DevLoginForm({ role }: DevLoginFormProps) {
  const { supabase, setUserRole } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowTroubleshooting(false)

    if (!email || !password) {
      setError("Please enter your email and password")
      toast({
        title: "Missing information",
        description: "Please enter your email and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use the server action to log in (bypasses email confirmation)
      const result = await devLogin(email, password, role)

      if (!result.success) {
        // Check if it's a network-related error
        if (result.error && (result.error.includes("fetch") || result.error.includes("network"))) {
          setShowTroubleshooting(true)
          throw new Error(
            "Failed to connect to authentication service. Please check your connection or try the troubleshooting steps below.",
          )
        }

        throw new Error(result.error || "Login failed")
      }

      // Get the session
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        throw new Error("Failed to get session after login")
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Redirect based on role
      if (role === "player") {
        router.push("/profile")
      } else {
        router.push("/admin/fields")
      }

      // Force a refresh to update the UI
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Development Login</AlertTitle>
        <AlertDescription>This login bypasses email confirmation for development purposes.</AlertDescription>
      </Alert>

      {showTroubleshooting && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Try these troubleshooting steps:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Check your internet connection</li>
              <li>Disable browser extensions, especially ad blockers or privacy extensions</li>
              <li>Try using a different browser</li>
              <li>Clear your browser cache and cookies</li>
              <li>
                If you're using Chrome, try disabling the "Block third-party cookies" setting in your browser settings
              </li>
            </ol>
            <p className="mt-2 text-sm">
              <strong>Note:</strong> Some browser extensions like "Allow CORS" can block PATCH requests by default,
              which can cause login issues with Supabase.
            </p>
          </AlertDescription>
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
          {error && !showTroubleshooting && <p className="text-sm text-destructive">{error}</p>}
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login (Dev Mode)"
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
      <Toaster />
    </div>
  )
}
