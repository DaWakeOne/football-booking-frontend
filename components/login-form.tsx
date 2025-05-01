"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"

// Server action for login
import { serverLogin } from "@/app/actions/server-auth-actions"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

interface LoginFormProps {
  role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Validate form data
      const result = loginSchema.safeParse({ email, password })

      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Invalid form data"
        setError(errorMessage)
        return
      }

      setIsLoading(true)

      // Call the server action
      const response = await serverLogin(email, password, role)

      if (!response.success) {
        setError(response.error || "Failed to log in")
        return
      }

      // Show success message
      setSuccess(true)

      // Redirect after a delay
      setRedirecting(true)
      setTimeout(() => {
        // Use window.location for more reliable redirection
        if (role === "owner") {
          window.location.href = "/admin/dashboard"
        } else {
          window.location.href = "/fields"
        }
      }, 1500)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            {redirecting ? "Redirecting to your dashboard..." : "Login successful!"}
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
              disabled={isLoading || success}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || success}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading || success}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : redirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href={`/signup/${role}`} className="underline">
          Sign up
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <Link href="/super-login" className="hover:underline">
          Having trouble logging in?
        </Link>
      </div>
    </div>
  )
}
