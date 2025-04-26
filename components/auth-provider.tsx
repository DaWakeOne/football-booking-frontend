"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createBrowserClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"
import { createUserProfile } from "@/app/actions/user-actions"

type AuthContextType = {
  user: User | null
  session: Session | null
  supabase: ReturnType<typeof createBrowserClient>
  isLoading: boolean
  userRole: UserRole | null
  setUserRole: (role: UserRole) => void
  ensureUserInDatabase: () => Promise<boolean>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient())
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ensureUserInDatabase = async () => {
    if (!user || !user.email) return false

    try {
      // Check if the user exists in the database
      const { data, error } = await supabase.from("users").select("role").eq("id", user.id).single()

      if (error && error.code === "PGRST116") {
        // User doesn't exist, create them with a default role
        const defaultRole: UserRole = "player"
        const result = await createUserProfile(user.id, user.email, defaultRole)

        if (!result.success) {
          console.error("Error creating user record:", result.error)
          return false
        }

        setUserRole(defaultRole)
        return true
      }

      if (error) {
        console.error("Error checking user in database:", error)
        return false
      }

      if (data) {
        setUserRole(data.role as UserRole)
        return true
      }

      return false
    } catch (err: any) {
      console.error("Error in ensureUserInDatabase:", err)
      setError(err.message || "Failed to check user in database")
      return false
    }
  }

  // Update the checkLocalStorageAuth function to be more robust
  const checkLocalStorageAuth = () => {
    try {
      const localAuthData = localStorage.getItem("auth_user")
      console.log("Checking localStorage auth data:", localAuthData ? "Found" : "Not found")

      if (localAuthData) {
        const authUser = JSON.parse(localAuthData)
        if (authUser && authUser.id && authUser.email && authUser.role) {
          console.log("Using localStorage auth data for:", authUser.email)
          // Create a minimal user object
          setUser({
            id: authUser.id,
            email: authUser.email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User)
          setUserRole(authUser.role as UserRole)
          return true
        }
      }
      return false
    } catch (e) {
      console.error("Error parsing local auth data:", e)
      localStorage.removeItem("auth_user")
      return false
    }
  }

  // Update the first useEffect in the AuthProvider
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log("AuthProvider: Initializing auth state...")
        setIsLoading(true)

        // ALWAYS prioritize localStorage auth data in production
        if (checkLocalStorageAuth()) {
          console.log("AuthProvider: Using localStorage auth data")
          setIsLoading(false)
          return
        }

        // Only try Supabase auth as a fallback
        console.log("AuthProvider: Checking Supabase session")
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setIsLoading(false)
          return
        }

        console.log("AuthProvider: Supabase session result:", session ? "Found" : "Not found")

        if (session?.user) {
          setSession(session)
          setUser(session.user)

          // Fetch user role from the users table
          const { data, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (userError && userError.code !== "PGRST116") {
            console.error("Error fetching user role:", userError)
          }

          if (data) {
            console.log("AuthProvider: User role from database:", data.role)
            setUserRole(data.role as UserRole)

            // Also store in localStorage for redundancy
            localStorage.setItem(
              "auth_user",
              JSON.stringify({
                id: session.user.id,
                email: session.user.email,
                role: data.role,
              }),
            )
          }
        }
      } catch (err: any) {
        console.error("Error in getSession:", err)
        setError(err.message || "Failed to get session")
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        console.log("AuthProvider: Auth state changed, event:", _event)

        try {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            console.log("AuthProvider: User authenticated:", session.user.email)

            // Fetch user role from the users table
            const { data, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

            if (error && error.code !== "PGRST116") {
              console.error("Error fetching user role on auth change:", error)
            }

            if (data) {
              console.log("AuthProvider: User role from database:", data.role)
              setUserRole(data.role as UserRole)

              // Update localStorage
              localStorage.setItem(
                "auth_user",
                JSON.stringify({
                  id: session.user.id,
                  email: session.user.email,
                  role: data.role,
                }),
              )
            } else {
              // If no user record exists, try to create one
              console.log("AuthProvider: No user record found, creating one")
              await ensureUserInDatabase()
            }
          } else {
            console.log("AuthProvider: User signed out")
            setUserRole(null)
            localStorage.removeItem("auth_user")
          }
        } catch (err: any) {
          console.error("Error in auth state change:", err)
          setError(err.message || "Failed to handle auth state change")
        } finally {
          setIsLoading(false)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err: any) {
      console.error("Error setting up auth state change:", err)
      setError(err.message || "Failed to set up auth state change")
      setIsLoading(false)
      return () => {}
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        supabase,
        isLoading,
        userRole,
        setUserRole,
        ensureUserInDatabase,
        error,
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
