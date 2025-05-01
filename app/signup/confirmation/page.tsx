"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, AlertCircle } from "lucide-react"
import { checkEmailConfirmationStatus, resendConfirmationEmail } from "@/app/actions/auth-actions"
import type { UserRole } from "@/lib/database.types"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const role = (searchParams.get("role") as UserRole) || "player"

  const [isChecking, setIsChecking] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    const checkConfirmation = async () => {
      if (!email) return

      setIsChecking(true)
      try {
        const result = await checkEmailConfirmationStatus(email)
        setConfirmed(result.confirmed)
        if (!result.confirmed && result.message !== "Email not confirmed") {
          setError(result.message)
        }
      } catch (err: any) {
        console.error("Error checking confirmation status:", err)
        setError(err.message || "Failed to check confirmation status")
      } finally {
        setIsChecking(false)
      }
    }

    checkConfirmation()

    // Check every 10 seconds
    const interval = setInterval(checkConfirmation, 10000)

    return () => clearInterval(interval)
  }, [email])

  const handleResendEmail = async () => {
    if (!email) return

    setIsResending(true)
    setResendSuccess(false)
    setError(null)

    try {
      const result = await resendConfirmationEmail(email)
      if (result.success) {
        setResendSuccess(true)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      console.error("Error resending confirmation email:", err)
      setError(err.message || "Failed to resend confirmation email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Email Confirmation</CardTitle>
          <CardDescription>
            {confirmed ? "Your email has been confirmed!" : "Please check your email to confirm your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">{email}</p>
              </div>
            </div>
          )}

          {isChecking ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>Checking confirmation status...</p>
            </div>
          ) : confirmed ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                Your email has been confirmed! You can now log in to your account.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation link to your email address. Please click the link to confirm your account.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {resendSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-700">
                    Confirmation email has been resent. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {confirmed ? (
            <Button className="w-full" asChild>
              <Link href={`/login/${role}`}>Go to Login</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={isResending}>
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Confirmation Email"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <Link href={`/login/${role}`} className="underline">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
