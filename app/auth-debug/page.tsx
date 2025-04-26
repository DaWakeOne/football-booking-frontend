"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAuthData, clearAuthData, loginUser } from "@/lib/auth-utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole } from "@/lib/database.types"

export default function AuthDebugPage() {
  const [authData, setAuthData] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("player")

  useEffect(() => {
    // Get auth data
    const data = getAuthData()
    setAuthData(data)

    if (data?.email) {
      setEmail(data.email)
    }

    if (data?.role) {
      setRole(data.role)
    }
  }, [])

  const handleClearAuth = () => {
    clearAuthData()
    setAuthData(null)
  }

  const handleSetAuth = () => {
    if (!email) return

    loginUser(email, role)

    // Update the displayed auth data
    setAuthData(getAuthData())
  }

  const handleRedirect = (path: string) => {
    window.location.href = path
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Auth State</CardTitle>
            <CardDescription>Current authentication data from localStorage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                {authData ? JSON.stringify(authData, null, 2) : "No auth data found"}
              </pre>

              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleClearAuth} disabled={!authData}>
                  Clear Auth Data
                </Button>

                <Button onClick={() => handleRedirect("/")} variant="outline">
                  Go to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Auth Data</CardTitle>
            <CardDescription>Manually set authentication data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSetAuth}>Set Auth Data</Button>

                <Button
                  onClick={() => handleRedirect(role === "player" ? "/profile" : "/admin/fields")}
                  variant="outline"
                >
                  Go to {role === "player" ? "Profile" : "Admin"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
