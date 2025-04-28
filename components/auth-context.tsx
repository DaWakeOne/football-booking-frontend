"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/database.types"

type AuthContextType = {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  isLoading: boolean
  supabase: ReturnType<typeof createBrowserClient>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient())
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)

        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setSession(session)
          setUser(session.user)

          // Get user role
          const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

          if (data) {
            setUserRole(data.role as UserRole)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user || null)

      if (session?.user) {
        // Get user role
        const { data } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        if (data) {
          setUserRole(data.role as UserRole)
        } else {
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        isLoading,
        supabase,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
