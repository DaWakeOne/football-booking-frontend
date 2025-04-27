"use client"

import { DevLoginForm } from "@/components/dev-login-form"

interface ClientDevLoginFormProps {
  role: "player" | "owner"
}

export function ClientDevLoginForm({ role }: ClientDevLoginFormProps) {
  return <DevLoginForm role={role} />
}
