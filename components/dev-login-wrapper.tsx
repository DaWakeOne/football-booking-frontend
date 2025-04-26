"use client"

import { DevLoginForm } from "@/components/dev-login-form"

interface DevLoginWrapperProps {
  role: "player" | "owner"
}

export function DevLoginWrapper({ role }: DevLoginWrapperProps) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Development Login ({role === "owner" ? "Owner" : "Player"})
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to login to your {role === "owner" ? "field owner" : "player"} account
          </p>
        </div>
        <DevLoginForm role={role} />
      </div>
    </div>
  )
}
