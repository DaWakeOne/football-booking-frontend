"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { simplifiedLogin, simplifiedSignup } from "@/app/actions/simplified-auth-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SimplifiedAuthFormProps {
  mode: "login" | "signup"
  role: UserRole
}

export function SimplifiedAuthForm({ mode, role }: SimplifiedAuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)
  const [signupComplete, setSignupComplete] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebug(null)
    setLoginSuccess(false)

    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        setError("Please confirm your password")
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
    }

    setIsLoading(true)

    try {
      let result

      if (mode === "login") {
        // Show a toast to indicate login attempt
        toast({
          title: "Logging in...",
          description: "Attempting to log you in",
        })

        result = await simplifiedLogin(email, password, role)

        // Log the result for debugging
        console.log("Login result:", result)
        setDebug(JSON.stringify(result, null, 2))
      } else {
        result = await simplifiedSignup(email, password, role)
      }

      if (!result.success) {
        setDebug(JSON.stringify(result, null, 2))
        throw new Error(result.error || `${mode} failed`)
      }

      if (mode === "signup" && result.emailConfirmationRequired) {
        setSignupComplete(true)
        return
      }

      // Store auth info in localStorage for client-side use
      const authData = {
        id: result.userId,
        email: email,
        role: role,
      }
      console.log("Storing auth data in localStorage:", authData)
      localStorage.setItem("auth_user", JSON.stringify(authData))

      // Set success state
      setLoginSuccess(true)
      setUserId(result.userId)

      toast({
        title: `${mode === "login" ? "Login" : "Signup"} successful`,
        description: "You can now navigate to your profile",
      })

      // Add a delay before redirecting to ensure localStorage is properly set
      setTimeout(() => {
        if (role === "player") {
          window.location.href = "/profile"
        } else {
          window.location.href = "/admin/fields"
        }
      }, 1000)
    } catch (error: any) {
      console.error(`Simplified ${mode} error:`, error)
      setError(error.message || `An error occurred during ${mode}`)
      toast({
        title: `${mode} failed`,
        description: error.message || `An error occurred during ${mode}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirect = () => {
    // Double-check that localStorage has the auth data
    const authData = {
      id: userId,
      email: email,
      role: role,
    }

    // Set it again just to be sure
    localStorage.setItem("auth_user", JSON.stringify(authData))
    console.log("Redirecting with auth data:", authData)

    // Use a small delay to ensure localStorage is set
    setTimeout(() => {
      const redirectUrl = role === "player" ? "/profile" : "/admin/fields"
      console.log("Redirecting to:", redirectUrl)
      window.location.href = redirectUrl
    }, 100)
  }

  if (signupComplete) {
    return (
      <div className="grid gap-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Account created successfully!</AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-4">Please check your email ({email}) for a confirmation link to activate your account.</p>
            <p>
              For testing purposes, you can also try logging in directly - email verification may be bypassed in
              development.
            </p>
          </AlertDescription>
        </Alert>
        <div className="text-center text-sm">
          <Link href={`/login/${role}`} className="underline">
            Try logging in
          </Link>
        </div>
        <Toaster />
      </div>
    )
  }

  if (loginSuccess) {
    return (
      <div className="grid gap-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Login successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            <p className="mb-4">You have successfully logged in as {email}.</p>
            <Button onClick={handleRedirect} className="w-full">
              Go to {role === "player" ? "Profile" : "Admin Dashboard"}
            </Button>
          </AlertDescription>
        </Alert>
        <div className="mt-4 bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Auth Data:</h3>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(
              {
                id: userId,
                email: email,
                role: role,
              },
              null,
              2,
            )}
          </pre>
        </div>
        <Toaster />
      </div>
    )
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
          {mode === "signup" && (
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
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {debug && (
            <div className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
              <pre>{debug}</pre>
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Login"
            ) : (
              `Create ${role === "player" ? "Player" : "Owner"} Account`
            )}
          </Button>
        </div>
      </form>
      <Toaster />
    </div>
  )
}
