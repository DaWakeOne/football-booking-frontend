"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Session, User } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/database.types"

type AuthContextType = {
  user: User | null
  session: Session | null
  userRole: UserRole | null
  isLoading: boolean
  supabase: ReturnType<typeof createClient>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Create Supabase client directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey))

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for localStorage auth as a fallback
    const checkLocalAuth = () => {
      try {
        const localAuth = localStorage.getItem("auth_user")
        if (localAuth) {
          const authData = JSON.parse(localAuth)
          if (authData && authData.role) {
            console.log("Using localStorage auth data")
            setUserRole(authData.role as UserRole)
            return true
          }
        }
      } catch (e) {
        console.error("Error reading localStorage auth:", e)
      }
      return false
    }

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

          try {
            // Get user role
            const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

            if (error) {
              console.error("Error fetching user role:", error)
              // Fall back to localStorage if available
              if (!checkLocalAuth()) {
                setUserRole(null)
              }
            } else if (data) {
              setUserRole(data.role as UserRole)
            }
          } catch (error) {
            console.error("Error in role fetch:", error)
            // Fall back to localStorage if available
            if (!checkLocalAuth()) {
              setUserRole(null)
            }
          }
        } else {
          // No session, check localStorage as fallback
          checkLocalAuth()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Fall back to localStorage if available
        checkLocalAuth()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user || null)

      if (session?.user) {
        try {
          // Get user role
          const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

          if (error) {
            console.error("Error fetching user role on auth change:", error)
            // Fall back to localStorage if available
            if (!checkLocalAuth()) {
              setUserRole(null)
            }
          } else if (data) {
            setUserRole(data.role as UserRole)
          }
        } catch (error) {
          console.error("Error in role fetch on auth change:", error)
          // Fall back to localStorage if available
          if (!checkLocalAuth()) {
            setUserRole(null)
          }
        }
      } else {
        // No session, check localStorage as fallback
        if (!checkLocalAuth()) {
          setUserRole(null)
        }
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }

    // Clear localStorage auth
    try {
      localStorage.removeItem("auth_user")
    } catch (e) {
      console.error("Error clearing localStorage:", e)
    }

    setUser(null)
    setSession(null)
    setUserRole(null)
    window.location.href = "/"
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
