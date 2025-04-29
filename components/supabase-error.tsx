"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SupabaseError() {
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if Supabase environment variables are defined
    const checkEnv = () => {
      // Try to get from window.__ENV__ if it exists
      const windowEnv = (window as any).__ENV__

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (windowEnv && windowEnv.NEXT_PUBLIC_SUPABASE_URL)

      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (windowEnv && windowEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      if (!supabaseUrl) {
        setError("Supabase URL is missing. Please check your environment variables.")
      } else if (!supabaseKey) {
        setError("Supabase Anon Key is missing. Please check your environment variables.")
      } else {
        setError(null)
      }
    }

    checkEnv()

    // Check again after a short delay (helps with some race conditions)
    const timeoutId = setTimeout(checkEnv, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-4 mx-4 mt-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Configuration Error</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-2 text-sm">
          Make sure you have set up the required environment variables in your .env.local file or in your deployment
          platform.
          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          {showDetails && (
            <div className="mt-2 p-2 bg-red-950 text-white rounded text-xs overflow-auto">
              <p>Current environment:</p>
              <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "undefined"}</p>
              <p>Window environment:</p>
              <p>window.__ENV__: {(window as any).__ENV__ ? "defined" : "undefined"}</p>
              <p className="mt-2">
                If you're seeing this in a new tab, try closing this tab and reopening it after ensuring your
                environment variables are set in your deployment platform.
              </p>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
