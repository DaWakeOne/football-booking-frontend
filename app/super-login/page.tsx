"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

export default function SuperLoginPage() {
  const [email, setEmail] = useState("user@example.com")
  const [role, setRole] = useState<UserRole>("player")
  const [success, setSuccess] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const handleLogin = () => {
    // Create a fake user ID
    const userId = `manual-${Date.now()}`

    // Store auth in localStorage
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: userId,
        email: email,
        role: role,
      }),
    )

    setSuccess(true)
    setRedirecting(true)

    toast({
      title: "Login successful",
      description: "You will be redirected shortly.",
    })

    // Use direct window.location for more reliable redirection
    const redirectPath = role === "player" ? "/fields" : "/admin/fields"
    console.log("Redirecting to:", redirectPath)

    // Add a slightly longer delay to ensure localStorage is set and toast is shown
    setTimeout(() => {
      // Use window.location.href for more reliable redirection
      window.location.href = redirectPath
    }, 1500)
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Super Simple Login</CardTitle>
          <CardDescription>This login bypasses Supabase completely and just sets localStorage data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="mb-4">
              <AlertTitle>Login successful!</AlertTitle>
              <AlertDescription>
                {redirecting ? "Redirecting you to your dashboard..." : "Please wait..."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              disabled={redirecting}
            />
            <p className="text-xs text-muted-foreground">
              This is just for display purposes, no validation is performed
            </p>
          </div>

          <div className="space-y-2">
            <Label>Select your role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={redirecting}>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleLogin} disabled={redirecting}>
            {redirecting ? "Redirecting..." : "Login Instantly"}
          </Button>
          <Link href="/login/player" className="text-sm text-center text-blue-600 hover:underline">
            Back to normal login
          </Link>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
