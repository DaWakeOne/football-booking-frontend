"use client"

import { Suspense, useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import the DevLoginForm component
const DevLoginForm = dynamic(
  () => import("@/components/dev-login-form-wrapper").then((mod) => mod.DevLoginFormWrapper),
  {
    loading: () => <div>Loading login form...</div>,
  },
)

interface DevLoginClientWrapperProps {
  role: "player" | "owner"
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
      <DevLoginForm role={role} />
    </Suspense>
  )
}
