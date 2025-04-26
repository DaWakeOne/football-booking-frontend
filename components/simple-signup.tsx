"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"
import { loginUser } from "@/lib/auth-utils"

interface SimpleSignupProps {
  role: UserRole
  redirectTo?: string
}

export function SimpleSignup({ role, redirectTo = "/profile" }: SimpleSignupProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Login the user using our utility (same as login for demo purposes)
      loginUser(email, role)

      console.log("Signup successful, redirecting to:", role === "player" ? redirectTo : "/admin/fields")

      // Add a small delay to ensure localStorage is set
      setTimeout(() => {
        // Redirect to the specified page using window.location for a full page refresh
        if (role === "player") {
          window.location.href = redirectTo
        } else {
          window.location.href = "/admin/fields"
        }
      }, 500)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign up as {role === "player" ? "Player" : "Field Owner"}</CardTitle>
        <CardDescription>Create a new account to access the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
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
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
