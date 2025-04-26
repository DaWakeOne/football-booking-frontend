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

interface SimpleLoginProps {
  role: UserRole
  redirectTo?: string
}

export function SimpleLogin({ role, redirectTo = "/profile" }: SimpleLoginProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    setIsLoading(true)

    try {
      // Login the user using our utility
      loginUser(email, role)

      console.log("Login successful, redirecting to:", role === "player" ? redirectTo : "/admin/fields")

      // Add a small delay to ensure localStorage is set
      setTimeout(() => {
        // Redirect to the specified page
        if (role === "player") {
          window.location.href = redirectTo
        } else {
          window.location.href = "/admin/fields"
        }
      }, 500)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login as {role === "player" ? "Player" : "Field Owner"}</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
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
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
