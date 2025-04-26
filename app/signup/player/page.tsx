import { SimpleSignup } from "@/components/simple-signup"
import Link from "next/link"

export default function PlayerSignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign up as a Player</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create a player account</p>
        </div>
        <SimpleSignup role="player" />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login/player" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
