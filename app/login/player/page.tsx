import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function PlayerLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Player Login</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to login</p>
        </div>
        <LoginForm role="player" />
        <div className="text-center text-xs text-muted-foreground">
          <Link href="/debug" className="hover:underline">
            Having trouble? Check connection status
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          <Link href="/direct-login" className="hover:underline">
            Try direct login
          </Link>
        </div>
      </div>
    </div>
  )
}
