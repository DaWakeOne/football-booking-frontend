"use client"

import { DevLoginForm } from "@/components/dev-login-form"

interface DevLoginFormWrapperProps {
  role: "player" | "owner"
}

export function DevLoginFormWrapper({ role }: DevLoginFormWrapperProps) {
  return <DevLoginForm role={role} />
}
