"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { User } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/database.types"

type AuthContextType = {
  user: User | null
  userRole: UserRole | null
  isLoading: boolean
  supabase: ReturnType<typeof createClient>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseClient] = useState(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    return createClient(supabaseUrl, supabaseAnonKey)
  })

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // First, try to get the session from Supabase
        const { data: sessionData } = await supabaseClient.auth.getSession()

        // If we have a session, use it
        if (sessionData?.session?.user) {
          setUser(sessionData.session.user)

          // Fetch user role from the database
          const { data: userData, error: userError } = await supabaseClient
            .from("users")
            .select("role")
            .eq("id", sessionData.session.user.id)
            .single()

          if (userData) {
            setUserRole(userData.role as UserRole)
          } else {
            console.error("User role not found:", userError)

            // Fallback to localStorage for role if available
            const storedRole = localStorage.getItem("userRole")
            if (storedRole) {
              setUserRole(storedRole as UserRole)
            }
          }
        } else {
          // If no session, check localStorage as fallback
          const storedUser = localStorage.getItem("user")
          const storedRole = localStorage.getItem("userRole")

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser))
              if (storedRole) {
                setUserRole(storedRole as UserRole)
              }
            } catch (e) {
              console.error("Error parsing stored user:", e)
              localStorage.removeItem("user")
              localStorage.removeItem("userRole")
            }
          } else {
            setUser(null)
            setUserRole(null)
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)

        // Store user in localStorage as fallback
        localStorage.setItem("user", JSON.stringify(session.user))

        // Fetch user role from the database
        const { data: userData } = await supabaseClient.from("users").select("role").eq("id", session.user.id).single()

        if (userData) {
          setUserRole(userData.role as UserRole)
          localStorage.setItem("userRole", userData.role)
        }
      } else {
        setUser(null)
        setUserRole(null)
        localStorage.removeItem("user")
        localStorage.removeItem("userRole")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabaseClient])

  const signOut = async () => {
    await supabaseClient.auth.signOut()
    localStorage.removeItem("user")
    localStorage.removeItem("userRole")
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, userRole, isLoading, supabase: supabaseClient, signOut }}>
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
