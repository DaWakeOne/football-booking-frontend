"use client"

import { DevLoginForm } from "@/components/dev-login-form"
import type { UserRole } from "@/lib/database.types"

interface DevLoginFormWrapperProps {
  role: UserRole
}

export function DevLoginFormWrapper({ role }: DevLoginFormWrapperProps) {
  return <DevLoginForm role={role} />
}
