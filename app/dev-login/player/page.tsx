import { DevLoginClientWrapper } from "@/components/dev-login-client-wrapper"

export default function DevPlayerLoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Development Login (Player)</h1>
          <p className="text-sm text-muted-foreground">Enter your email to login to your player account</p>
        </div>
        <DevLoginClientWrapper role="player" />
      </div>
    </div>
  )
}
