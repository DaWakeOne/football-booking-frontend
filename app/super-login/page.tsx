"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import type { UserRole } from "@/lib/database.types"

export default function SuperLoginPage() {
  const [email, setEmail] = useState("user@example.com")
  const [role, setRole] = useState<UserRole>("player")
  const [success, setSuccess] = useState(false)

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

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = role === "player" ? "/fields" : "/admin/fields"
    }, 1000)
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
              <AlertDescription>Redirecting you to your dashboard...</AlertDescription>
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
            />
            <p className="text-xs text-muted-foreground">
              This is just for display purposes, no validation is performed
            </p>
          </div>

          <div className="space-y-2">
            <Label>Select your role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
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
          <Button className="w-full" onClick={handleLogin}>
            Login Instantly
          </Button>
          <Link href="/login/player" className="text-sm text-center text-blue-600 hover:underline">
            Back to normal login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
