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
import { Loader2, Mail, CheckCircle, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { createUserProfile } from "@/app/actions/user-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SignupFormProps {
  role: UserRole
}

export function SignupForm({ role }: SignupFormProps) {
  const { supabase, setUserRole } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupComplete, setSignupComplete] = useState(false)
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const handleResendConfirmationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsResendingEmail(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) throw error

      toast({
        title: "Confirmation email sent",
        description: "Please check your email for the confirmation link",
      })
    } catch (error: any) {
      console.error("Error sending confirmation email:", error)
      toast({
        title: "Error sending confirmation email",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowTroubleshooting(false)

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      setError("Password too short")
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("Auth error:", authError)

        // Check if it's a "failed to fetch" error
        if (authError.message.includes("fetch") || authError.message.includes("network")) {
          setShowTroubleshooting(true)
          throw new Error(
            "Failed to connect to authentication service. Please check your connection or try the troubleshooting steps below.",
          )
        }

        throw authError
      }

      if (!authData.user) {
        throw new Error("No user returned from signup")
      }

      console.log("User created:", authData.user.id)

      // Create user profile using server action (bypasses RLS)
      const result = await createUserProfile(authData.user.id, authData.user.email!, role)

      if (!result.success) {
        throw new Error(result.error || "Failed to create user profile")
      }

      console.log("User profile created successfully")

      // Check if email confirmation is required
      if (authData.user.identities && authData.user.identities.length > 0) {
        const identity = authData.user.identities[0]
        if (identity.identity_data && identity.identity_data.email_confirmed_at === null) {
          setSignupComplete(true)
          return
        }
      }

      // Update local state
      setUserRole(role)

      toast({
        title: "Signup successful",
        description: "Your account has been created successfully.",
      })

      // Redirect based on role
      if (role === "player") {
        router.push("/profile")
      } else {
        router.push("/admin/fields")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (signupComplete) {
    return (
      <div className="grid gap-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Account created successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-4">Please check your email ({email}) for a confirmation link to activate your account.</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleResendConfirmationEmail}
              disabled={isResendingEmail}
            >
              {isResendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend confirmation email
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
        <div className="text-center text-sm">
          Already confirmed?{" "}
          <Link href={`/login/${role}`} className="underline">
            Login
          </Link>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
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
              which can cause signup issues with Supabase.
            </p>
          </AlertDescription>
        </Alert>
      )}
      {showTroubleshooting && (
        <div className="mt-2">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Still having issues?</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Try our alternative authentication method:</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/auth-troubleshooting">Go to Authentication Troubleshooting</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
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
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && !showTroubleshooting && <p className="text-sm text-destructive">{error}</p>}
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              `Create ${role === "player" ? "Player" : "Owner"} Account`
            )}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href={`/login/${role}`} className="underline">
          Login
        </Link>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        <Link href={`/dev-login/${role}`} className="underline">
          Use development login (bypasses email confirmation)
        </Link>
      </div>
      <Toaster />
    </div>
  )
}
