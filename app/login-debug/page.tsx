"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Info } from "lucide-react"
import { simplifiedLogin } from "@/app/actions/simplified-auth-actions"
import type { UserRole } from "@/lib/database.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginDebugPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("player")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleLogin = async () => {
    if (!email || !password) {
      setResult({
        success: false,
        error: "Please enter email and password",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Call the login function directly
      const loginResult = await simplifiedLogin(email, password, role)

      // Store the result for display
      setResult(loginResult)

      // If login was successful, store auth info in localStorage and redirect
      if (loginResult.success) {
        const authData = {
          id: loginResult.userId,
          email: email,
          role: role,
        }
        console.log("Storing auth data in localStorage:", authData)
        localStorage.setItem("auth_user", JSON.stringify(authData))

        // Add a button to redirect
        setResult({
          ...loginResult,
          redirectUrl: role === "player" ? "/profile" : "/admin/fields",
        })
      }
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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Login Debug Tool</h1>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Login</CardTitle>
            <CardDescription>This tool will help debug login issues by showing the full response</CardDescription>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
            <Button onClick={handleLogin} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Login...
                </>
              ) : (
                "Test Login"
              )}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <div className="mt-8">
            <Alert variant={result.success ? "default" : "destructive"}>
              <Info className="h-4 w-4" />
              <AlertTitle>{result.success ? "Login Successful" : "Login Failed"}</AlertTitle>
              <AlertDescription>
                {result.success ? `Successfully logged in with user ID: ${result.userId}` : `Error: ${result.error}`}
              </AlertDescription>
            </Alert>

            {result.success && result.redirectUrl && (
              <div className="mt-4">
                <Button onClick={() => (window.location.href = result.redirectUrl)} className="w-full">
                  Go to {result.redirectUrl}
                </Button>
              </div>
            )}

            <div className="mt-4 bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Full Response:</h3>
              <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
