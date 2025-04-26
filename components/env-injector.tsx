"use client"

import { useEffect } from "react"

export function EnvInjector() {
  useEffect(() => {
    // Create a global __ENV__ object to store environment variables
    // This helps with "Open in new tab" scenarios
    if (typeof window !== "undefined") {
      ;(window as any).__ENV__ = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    }
  }, [])

  return null
}
