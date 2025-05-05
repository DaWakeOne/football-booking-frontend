import { OwnerSignupForm } from "@/components/owner-signup-form"

export default function OwnerSignupPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create Owner Account</h1>
          <p className="mt-2 text-gray-600">Register as a field owner to list and manage your fields</p>
        </div>
        <OwnerSignupForm />
      </div>
    </div>
  )
}
