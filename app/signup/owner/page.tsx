import { OwnerSignupForm } from "@/components/owner-signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Field Owner Account | ActiModo",
  description: "Register as a field owner on ActiModo",
}

export default function OwnerSignupPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Field Owner Account</h1>
          <p className="text-muted-foreground">Register as a field owner to list and manage your sports facilities</p>
        </div>
        <OwnerSignupForm />
      </div>
    </div>
  )
}
