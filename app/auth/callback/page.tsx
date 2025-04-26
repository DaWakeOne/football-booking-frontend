"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createBrowserClient()

        // Get the auth code from the URL
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (!code) {
          setStatus("error")
          setErrorMessage("No authentication code found in the URL")
          return
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("Error exchanging code for session:", error)
          setStatus("error")
          setErrorMessage(error.message)
          return
        }

        setStatus("success")

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } catch (error: any) {
        console.error("Error in auth callback:", error)
        setStatus("error")
        setErrorMessage(error.message || "An unexpected error occurred")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Verifying your account...</p>
          </div>
        )}

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Email confirmed successfully!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email has been confirmed. You will be redirected to your profile page shortly.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription>
              {errorMessage || "There was an error verifying your account. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
