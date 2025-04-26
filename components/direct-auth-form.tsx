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
import type { UserRole } from "@/lib/database.types"
import { directLogin, directSignup } from "@/app/actions/direct-auth-actions"

interface DirectAuthFormProps {
  mode: "login" | "signup"
  role: UserRole
}

export function DirectAuthForm({ mode, role }: DirectAuthFormProps) {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDebug(null)

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
        result = await directLogin(email, password, role)
      } else {
        result = await directSignup(email, password, role)
      }

      if (!result.success) {
        setDebug(JSON.stringify(result, null, 2))
        throw new Error(result.error || `${mode} failed`)
      }

      toast({
        title: `${mode === "login" ? "Login" : "Signup"} successful`,
        description: "You will be redirected shortly.",
      })

      // Store auth info in localStorage for client-side use
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: result.userId,
          email: email,
          role: role,
        }),
      )

      // Redirect based on role
      setTimeout(() => {
        if (role === "player") {
          router.push("/profile")
        } else {
          router.push("/admin/fields")
        }
        router.refresh()
      }, 1000)
    } catch (error: any) {
      console.error(`Direct ${mode} error:`, error)
      setError(error.message || `An error occurred during ${mode}`)
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
