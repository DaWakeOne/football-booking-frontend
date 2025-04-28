"use client"

import type React from "react"

import { AuthProvider } from "@/components/auth-provider.tsx"

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
