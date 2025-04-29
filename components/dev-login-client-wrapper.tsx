"use client"

import { Suspense, useState, useEffect } from "react"
import { ClientDevLoginForm } from "@/components/client-dev-login-form"
import type { UserRole } from "@/lib/database.types"

interface DevLoginClientWrapperProps {
  role: UserRole
}

export function DevLoginClientWrapper({ role }: DevLoginClientWrapperProps) {
  // Use state to ensure this component only renders on the client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <Suspense fallback={<div>Loading login form...</div>}>
      <ClientDevLoginForm role={role} />
    </Suspense>
  )
}
