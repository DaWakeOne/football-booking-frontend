import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Unauthorized() {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-lg mb-6">You do not have permission to access this page.</p>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}
