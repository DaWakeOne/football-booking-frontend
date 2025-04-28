"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/lib/database.types"

export default function SuperLoginPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("Setting up manual authentication...")

    // Generate a fake user ID
    const userId = `manual-${Math.random().toString(36).substring(2, 15)}`

    // Store auth in localStorage
    localStorage.setItem(
      "auth_user",
      JSON.stringify({
        id: userId,
        email: email || "player@example.com",
        role: role,
      }),
    )

    setStatus("Authentication set, redirecting...")

    // Force redirect immediately
    setTimeout(() => {
      const redirectPath = role === "player" ? "/profile" : "/admin/fields"
      window.location.href = redirectPath
    }, 1000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Super Simple Login</CardTitle>
          <CardDescription>Bypass all authentication and just set localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isLoading}
              >
                <option value="player">Player</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Login Instantly"
              )}
            </Button>
          </form>

          {status && (
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 text-sm rounded text-center">
              <p>Status: {status}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">This bypasses all authentication and just sets localStorage.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
