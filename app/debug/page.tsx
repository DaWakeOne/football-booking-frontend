"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "success" | "error">("checking")
  const [envVarsStatus, setEnvVarsStatus] = useState<"checking" | "success" | "error" | "partial">("checking")
  const [localStorageAuth, setLocalStorageAuth] = useState<any>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const checkEnvironmentVariables = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseAnonKey) {
        setEnvVarsStatus("success")
        return { success: true, url: supabaseUrl, key: supabaseAnonKey }
      } else if (supabaseUrl || supabaseAnonKey) {
        setEnvVarsStatus("partial")
        return { success: false }
      } else {
        setEnvVarsStatus("error")
        return { success: false }
      }
    }

    const checkLocalStorage = () => {
      try {
        const authData = localStorage.getItem("auth_user")
        if (authData) {
          const parsed = JSON.parse(authData)
          setLocalStorageAuth(parsed)
          return true
        }
      } catch (e) {
        console.error("Error reading localStorage:", e)
      }
      return false
    }

    const testSupabaseConnection = async () => {
      setTestResults([...testResults, "Starting Supabase connection test..."])

      const envCheck = checkEnvironmentVariables()
      if (!envCheck.success) {
        setTestResults([...testResults, "❌ Missing environment variables"])
        setSupabaseStatus("error")
        return
      }

      try {
        setTestResults([...testResults, "✓ Environment variables found"])
        setTestResults([...testResults, "Creating Supabase client..."])

        const supabase = createClient(envCheck.url, envCheck.key)

        setTestResults([...testResults, "Testing connection with health check..."])

        // Simple query to test connection
        const { data, error } = await supabase.from("users").select("count").limit(1)

        if (error) {
          setTestResults([...testResults, `❌ Connection error: ${error.message}`])
          setSupabaseStatus("error")
        } else {
          setTestResults([...testResults, "✓ Supabase connection successful"])
          setSupabaseStatus("success")
        }
      } catch (error: any) {
        setTestResults([...testResults, `❌ Error: ${error.message}`])
        setSupabaseStatus("error")
      }
    }

    const runTests = async () => {
      checkLocalStorage()
      await testSupabaseConnection()
      setIsLoading(false)
    }

    runTests()
  }, [testResults])

  const handleClearLocalStorage = () => {
    try {
      localStorage.removeItem("auth_user")
      setLocalStorageAuth(null)
      window.location.reload()
    } catch (e) {
      console.error("Error clearing localStorage:", e)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Connection Diagnostics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Checking for required Supabase configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-2 border rounded mb-2">
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              {envVarsStatus === "checking" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              {envVarsStatus === "checking" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Connection</CardTitle>
            <CardDescription>Testing connection to Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Connection Status</span>
              {supabaseStatus === "checking" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : supabaseStatus === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded max-h-40 overflow-auto">
              <pre className="text-xs">
                {testResults.map((result, i) => (
                  <div key={i}>{result}</div>
                ))}
                {isLoading && <div>Testing...</div>}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Local Storage Auth</CardTitle>
          <CardDescription>Checking for auth data in localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          {localStorageAuth ? (
            <>
              <Alert className="mb-4">
                <AlertTitle>Auth data found in localStorage</AlertTitle>
                <AlertDescription>This can be used as a fallback when Supabase authentication fails</AlertDescription>
              </Alert>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <pre className="text-xs overflow-auto">{JSON.stringify(localStorageAuth, null, 2)}</pre>
              </div>
            </>
          ) : (
            <Alert>
              <AlertTitle>No auth data in localStorage</AlertTitle>
              <AlertDescription>No fallback authentication data was found</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {localStorageAuth && (
            <Button variant="destructive" onClick={handleClearLocalStorage}>
              Clear localStorage Auth
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  )
}
