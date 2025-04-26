"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info } from "lucide-react"
import type { UserRole } from "@/lib/database.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DirectLoginPage() {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDirectLogin = async () => {
    if (!email || !userId) {
      setResult({
        success: false,
        error: "Please enter email and user ID",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Create auth data and store in localStorage
      const authData = {
        id: userId,
        email: email,
        role: role,
      }

      // Store in localStorage
      localStorage.setItem("auth_user", JSON.stringify(authData))

      setResult({
        success: true,
        message: "Auth data stored in localStorage",
        authData,
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "An unexpected error occurred",
        exception: error.toString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirect = () => {
    const redirectUrl = role === "player" ? "/profile" : "/admin/fields"
    window.location.href = redirectUrl
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Direct Login Tool</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Manual Authentication</CardTitle>
            <CardDescription>This tool will directly set authentication data in localStorage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleDirectLogin} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Auth Data...
                </>
              ) : (
                "Set Auth Data"
              )}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <div className="mt-8">
            <Alert variant={result.success ? "default" : "destructive"}>
              <Info className="h-4 w-4" />
              <AlertTitle>{result.success ? "Auth Data Set" : "Error"}</AlertTitle>
              <AlertDescription>{result.success ? result.message : `Error: ${result.error}`}</AlertDescription>
            </Alert>

            {result.success && (
              <div className="mt-4">
                <Button onClick={handleRedirect} className="w-full">
                  Go to {role === "player" ? "Profile" : "Admin Dashboard"}
                </Button>
              </div>
            )}

            <div className="mt-4 bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Auth Data:</h3>
              <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(result.authData || result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
