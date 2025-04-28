"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function AuthDebugPage() {
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [supabaseKey, setSupabaseKey] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "success" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [localAuth, setLocalAuth] = useState<any>(null)

  useEffect(() => {
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setSupabaseUrl(url || null)
    setSupabaseKey(key || null)

    // Check localStorage auth
    try {
      const authData = localStorage.getItem("auth_user")
      if (authData) {
        setLocalAuth(JSON.parse(authData))
      }
    } catch (e) {
      console.error("Error reading localStorage:", e)
    }

    // Test Supabase connection
    const testConnection = async () => {
      if (!url || !key) {
        setConnectionStatus("error")
        setErrorMessage("Missing Supabase configuration")
        return
      }

      try {
        const supabase = createClient(url, key)
        const { error } = await supabase.from("users").select("count").limit(1)

        if (error) {
          setConnectionStatus("error")
          setErrorMessage(`Database error: ${error.message}`)
        } else {
          setConnectionStatus("success")
        }
      } catch (error: any) {
        setConnectionStatus("error")
        setErrorMessage(`Connection error: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  const clearLocalAuth = () => {
    try {
      localStorage.removeItem("auth_user")
      setLocalAuth(null)
    } catch (e) {
      console.error("Error clearing localStorage:", e)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if Supabase configuration is available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</p>
                <p>{supabaseUrl ? "✅ Set" : "❌ Not set"}</p>
              </div>
              <div>
                <p className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
                <p>{supabaseKey ? "✅ Set" : "❌ Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection</CardTitle>
            <CardDescription>Test connection to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === "checking" && <p>Checking connection...</p>}
            {connectionStatus === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Connection to Supabase is working</AlertDescription>
              </Alert>
            )}
            {connectionStatus === "error" && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Authentication</CardTitle>
            <CardDescription>Check localStorage auth data</CardDescription>
          </CardHeader>
          <CardContent>
            {localAuth ? (
              <div className="space-y-2">
                <div>
                  <p className="font-medium">User ID:</p>
                  <p className="text-sm">{localAuth.id}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p>{localAuth.email}</p>
                </div>
                <div>
                  <p className="font-medium">Role:</p>
                  <p className="capitalize">{localAuth.role}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={clearLocalAuth}>
                  Clear Local Auth
                </Button>
              </div>
            ) : (
              <p>No local authentication data found</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/direct-login">Try Direct Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
