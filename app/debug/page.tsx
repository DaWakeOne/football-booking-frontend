"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DebugPage() {
  const [status, setStatus] = useState<string>("Initializing...")
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check environment variables
    const vars: Record<string, string> = {}

    // Check Supabase environment variables
    vars["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"
    vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"

    setEnvVars(vars)

    // Initial status
    setStatus("Ready to test connection")
  }, [])

  const testConnection = async () => {
    setStatus("Testing Supabase connection...")
    setError(null)

    try {
      // Check if Supabase URL and key are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Supabase configuration is missing")
      }

      // Create Supabase client
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      setStatus("Checking authentication status...")

      // Test connection by getting session
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      setStatus(`Connection successful! ${data.session ? "User is logged in" : "No active session"}`)
    } catch (err: any) {
      console.error("Connection test error:", err)
      setError(err.message || "An unknown error occurred")
      setStatus("Connection test failed")
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Debug</CardTitle>
          <CardDescription>Test your Supabase connection and environment variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Environment Variables</h3>
            <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-mono text-sm">{key}</span>
                  <span className={`font-mono text-sm ${value === "Set" ? "text-green-500" : "text-red-500"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Connection Status</h3>
            <Alert className="mt-2">
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>{status}</AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={testConnection} className="w-full">
            Test Supabase Connection
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
