"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"

// Server action for signup
import { serverSignup } from "@/app/actions/server-auth-actions"

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
})

interface SignupFormProps {
  role: UserRole
}

export function SignupForm({ role }: SignupFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Validate form data
      const result = signupSchema.safeParse({ email, password, confirmPassword })

      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || "Invalid form data"
        setError(errorMessage)
        return
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      setIsLoading(true)

      // Call the server action
      const response = await serverSignup(email, password, role)

      if (!response.success) {
        setError(response.error || "Failed to sign up")
        return
      }

      // Show success message
      setSuccess(true)

      // Clear form
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      // Redirect to confirmation page after a delay
      setTimeout(() => {
        router.push(`/signup/confirmation?email=${encodeURIComponent(email)}&role=${role}`)
      }, 2000)
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "An error occurred during signup")
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
            Your account has been created. Please check your email for a confirmation link.
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

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || success}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading || success}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Account created!
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href={`/login/${role}`} className="underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
