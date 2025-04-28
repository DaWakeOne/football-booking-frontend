import { SignupForm } from "@/components/signup-form"

export default function PlayerSignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create Player Account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to create your player account</p>
        </div>
        <SignupForm role="player" />
      </div>
    </div>
  )
}
