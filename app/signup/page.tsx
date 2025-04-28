import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-gray-600">Create a new account</p>
        <SignupForm />
        <div className="text-center text-sm">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
