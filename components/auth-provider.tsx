"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Create a simple context with minimal functionality
const AuthContext = createContext<{
  user: null | { id: string; email: string }
  userRole: string | null
  isLoading: boolean
}>({
  user: null,
  userRole: null,
  isLoading: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading] = useState(false)

  // Return a simplified provider that doesn't actually do authentication
  return (
    <AuthContext.Provider
      value={{
        user: null,
        userRole: null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Export the useAuth hook
export function useAuth() {
  return useContext(AuthContext)
}
