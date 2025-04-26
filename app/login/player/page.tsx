import { SimpleLogin } from "@/components/simple-login"
import Link from "next/link"

export default function PlayerLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login as a Player</h1>
          <p className="text-sm text-muted-foreground">Enter your email to login to your player account</p>
        </div>
        <SimpleLogin role="player" />
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup/player" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
