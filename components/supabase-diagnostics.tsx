"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react"

export function SupabaseDiagnostics() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{
    supabaseUrl: { success: boolean; message: string }
    supabaseAnon: { success: boolean; message: string }
    corsCheck: { success: boolean; message: string }
    networkCheck: { success: boolean; message: string }
  } | null>(null)

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults(null)

    const diagnosticResults = {
      supabaseUrl: { success: false, message: "Not checked" },
      supabaseAnon: { success: false, message: "Not checked" },
      corsCheck: { success: false, message: "Not checked" },
      networkCheck: { success: false, message: "Not checked" },
    }

    // Check if Supabase URL is defined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      diagnosticResults.supabaseUrl = { success: true, message: `URL found: ${supabaseUrl}` }
    } else {
      diagnosticResults.supabaseUrl = { success: false, message: "Supabase URL is missing" }
    }

    // Check if Supabase Anon Key is defined
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseKey) {
      diagnosticResults.supabaseAnon = {
        success: true,
        message: `Anon key found: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`,
      }
    } else {
      diagnosticResults.supabaseAnon = { success: false, message: "Supabase Anon Key is missing" }
    }

    // Check network connectivity to Supabase
    try {
      if (supabaseUrl) {
        // Try to fetch the Supabase health endpoint
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey || "",
          },
        })

        if (response.ok) {
          diagnosticResults.networkCheck = { success: true, message: "Successfully connected to Supabase" }
        } else {
          diagnosticResults.networkCheck = {
            success: false,
            message: `Failed to connect to Supabase: ${response.status} ${response.statusText}`,
          }
        }
      } else {
        diagnosticResults.networkCheck = { success: false, message: "Cannot check network without Supabase URL" }
      }
    } catch (error: any) {
      diagnosticResults.networkCheck = {
        success: false,
        message: `Network error: ${error.message || "Unknown error"}`,
      }
    }

    // Check for CORS issues
    try {
      if (supabaseUrl) {
        const corsCheckUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`
        const response = await fetch(corsCheckUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey || "",
          },
          body: JSON.stringify({
            email: "cors-test@example.com",
            password: "password",
          }),
        })

        // We expect this to fail with 400 (invalid credentials), but not with CORS errors
        if (response.status === 400) {
          diagnosticResults.corsCheck = { success: true, message: "CORS is properly configured" }
        } else {
          diagnosticResults.corsCheck = {
            success: false,
            message: `Unexpected response: ${response.status} ${response.statusText}`,
          }
        }
      } else {
        diagnosticResults.corsCheck = { success: false, message: "Cannot check CORS without Supabase URL" }
      }
    } catch (error: any) {
      // If we get a TypeError about fetch, it's likely a CORS issue
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        diagnosticResults.corsCheck = {
          success: false,
          message: "CORS issue detected. Your browser is blocking cross-origin requests.",
        }
      } else {
        diagnosticResults.corsCheck = {
          success: false,
          message: `Error checking CORS: ${error.message || "Unknown error"}`,
        }
      }
    }

    setResults(diagnosticResults)
    setIsRunning(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Diagnostics</CardTitle>
        <CardDescription>
          Run diagnostics to check your connection to Supabase and identify potential issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results && (
          <div className="space-y-4">
            <Alert variant={results.supabaseUrl.success ? "default" : "destructive"}>
              {results.supabaseUrl.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>Supabase URL</AlertTitle>
              <AlertDescription>{results.supabaseUrl.message}</AlertDescription>
            </Alert>

            <Alert variant={results.supabaseAnon.success ? "default" : "destructive"}>
              {results.supabaseAnon.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>Supabase Anon Key</AlertTitle>
              <AlertDescription>{results.supabaseAnon.message}</AlertDescription>
            </Alert>

            <Alert variant={results.networkCheck.success ? "default" : "destructive"}>
              {results.networkCheck.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>Network Connectivity</AlertTitle>
              <AlertDescription>{results.networkCheck.message}</AlertDescription>
            </Alert>

            <Alert variant={results.corsCheck.success ? "default" : "destructive"}>
              {results.corsCheck.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>CORS Configuration</AlertTitle>
              <AlertDescription>{results.corsCheck.message}</AlertDescription>
            </Alert>

            {(!results.networkCheck.success || !results.corsCheck.success) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Recommendation</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Based on the diagnostics, we recommend:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {!results.networkCheck.success && <li>Check your internet connection and firewall settings</li>}
                    {!results.corsCheck.success && (
                      <>
                        <li>Try using the server-based authentication option below</li>
                        <li>Disable browser extensions, especially ad blockers or privacy extensions</li>
                        <li>Try using a different browser</li>
                      </>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
