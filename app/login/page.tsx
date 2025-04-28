import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-600">Access your account</p>
        <LoginForm />
        <div className="text-center text-sm">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
