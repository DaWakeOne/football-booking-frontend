import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Email Confirmed!</h1>
          <p className="text-muted-foreground">
            Your email has been successfully confirmed. Your account is now active.
          </p>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          <Button asChild>
            <Link href="/login/owner">Login as Field Owner</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
