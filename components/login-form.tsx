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
import { Loader2, AlertCircle, Mail, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LoginFormProps {
  role: UserRole
}

export function LoginForm({ role }: LoginFormProps) {
  const { supabase, setUserRole } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
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
    setNeedsEmailConfirmation(false)
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
      // Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Auth error:", authError)

        // Check if the error is due to unconfirmed email
        if (authError.message.includes("Email not confirmed")) {
          setNeedsEmailConfirmation(true)
          throw new Error("Please confirm your email address before logging in")
        }

        // Check if it's a "failed to fetch" error
        if (authError.message.includes("fetch") || authError.message.includes("network")) {
          setShowTroubleshooting(true)
          throw new Error(
            "Failed to connect to authentication service. Please check your connection or try the troubleshooting steps below.",
          )
        }

        throw authError
      }

      if (authData.user) {
        // Check if the user has a profile in the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", authData.user.id)
          .single()

        // If user doesn't exist in the database, create them
        if (userError && userError.code === "PGRST116") {
          // Redirect to profile setup
          toast({
            title: "Profile setup required",
            description: "Please complete your profile setup",
          })
          router.push("/setup-profile")
          return
        }

        if (userError) {
          console.error("User data error:", userError)
          throw userError
        }

        if (userData.role !== role) {
          throw new Error(`You are not registered as a ${role}. Please use the correct login page.`)
        }

        // Update local state
        setUserRole(userData.role as UserRole)

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
      }
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
      {needsEmailConfirmation && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email not confirmed</AlertTitle>
          <AlertDescription>
            Please check your email and click the confirmation link to activate your account.
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
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
      )}

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
          {error && !needsEmailConfirmation && !showTroubleshooting && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button disabled={isLoading}>
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
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href={`/signup/${role}`} className="underline">
          Sign up
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
