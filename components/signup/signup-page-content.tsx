"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { UserRole } from "@/lib/database.types"

export default function SignupPageContent() {
  const { supabase } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

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
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert([
          { id: data.user.id, email: data.user.email, role },
        ])
        if (profileError) throw profileError

        setSuccess("Account created successfully! You can now login.")
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as UserRole)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="player" id="player" />
                  <Label htmlFor="player">Player</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" />
                  <Label htmlFor="owner">Field Owner</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Already have an account? <Link href="/login" className="underline">Login</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
