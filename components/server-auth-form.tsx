"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"
import { serverLogin, serverSignup } from "@/app/actions/server-auth-actions"

interface ServerAuthFormProps {
  mode: "login" | "signup"
  role: UserRole
}

export function ServerAuthForm({ mode, role }: ServerAuthFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter your email and password")
      toast({
        title: "Missing information",
        description: "Please enter your email and password",
        variant: "destructive",
      })
      return
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        setError("Please confirm your password")
        toast({
          title: "Missing information",
          description: "Please confirm your password",
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
    }

    setIsLoading(true)

    try {
      if (mode === "login") {
        // Server-side login
        const result = await serverLogin(email, password, role)

        if (!result.success) {
          throw new Error(result.error || "Login failed")
        }

        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })
      } else {
        // Server-side signup
        const result = await serverSignup(email, password, role)

        if (!result.success) {
          throw new Error(result.error || "Signup failed")
        }

        toast({
          title: "Signup successful",
          description: "Your account has been created successfully.",
        })
      }

      // Redirect based on role
      if (role === "player") {
        router.push("/profile")
      } else {
        router.push("/admin/fields")
      }

      // Force a refresh to update the UI
      router.refresh()
    } catch (error: any) {
      console.error(`Server ${mode} error:`, error)
      setError(error.message || `An error occurred during ${mode}`)
      toast({
        title: `${mode === "login" ? "Login" : "Signup"} failed`,
        description: error.message || `An error occurred during ${mode}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
      <div className="text-center text-sm">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href={`/signup/${role}`} className="underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`/login/${role}`} className="underline">
              Login
            </Link>
          </>
        )}
      </div>
      <Toaster />
    </div>
  )
}
