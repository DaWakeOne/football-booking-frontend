"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "./login-form.tsx"

export function LoginFormWrapper() {
  // Use state to ensure component only renders on client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="p-8 text-center">Loading login form...</div>
  }

  return <LoginForm />
}
