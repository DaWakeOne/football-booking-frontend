import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Account Confirmed!</h1>
          <p className="text-muted-foreground">Your email has been verified and your account is now active.</p>
        </div>

        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href="/login/owner">Login to Your Account</Link>
          </Button>
        </div>

        <div className="pt-2">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
