"use server"

import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"
import { cookies } from "next/headers"
import { createUserProfile } from "./user-actions"

export async function serverLogin(email: string, password: string, role: UserRole) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient()

    // Sign in the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error("Auth error:", authError)

      // Check if the error is due to unconfirmed email
      if (authError.message.includes("Email not confirmed")) {
        // For server-side login, we'll bypass email confirmation
        const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.getUserByEmail(email)

        if (adminAuthError || !adminAuthData.user) {
          return { success: false, error: adminAuthError?.message || "User not found" }
        }

        // Create a new session for the user
        const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
          userId: adminAuthData.user.id,
        })

        if (sessionError || !sessionData.session) {
          return { success: false, error: sessionError?.message || "Failed to create session" }
        }

        // Check if the user has a profile in the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", adminAuthData.user.id)
          .single()

        // If user doesn't exist in the database, create them
        if (userError && userError.code === "PGRST116") {
          const profileResult = await createUserProfile(adminAuthData.user.id, email, role)
          if (!profileResult.success) {
            return { success: false, error: profileResult.error || "Failed to create user profile" }
          }
        } else if (!userError && userData.role !== role) {
          return { success: false, error: `You are not registered as a ${role}. Please use the correct login page.` }
        }

        return { success: true }
      }

      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "Failed to sign in" }
    }

    // Check if the user has a profile in the database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single()

    // If user doesn't exist in the database, create them
    if (userError && userError.code === "PGRST116") {
      const profileResult = await createUserProfile(authData.user.id, email, role)
      if (!profileResult.success) {
        return { success: false, error: profileResult.error || "Failed to create user profile" }
      }
    } else if (!userError && userData.role !== role) {
      return { success: false, error: `You are not registered as a ${role}. Please use the correct login page.` }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Server login error:", error)
    return { success: false, error: error.message || "An error occurred during login" }
  }
}

export async function serverSignup(email: string, password: string, role: UserRole) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient()

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: "No user returned from signup" }
    }

    // Create user profile
    const profileResult = await createUserProfile(authData.user.id, email, role)
    if (!profileResult.success) {
      return { success: false, error: profileResult.error || "Failed to create user profile" }
    }

    // For server-side signup, we'll bypass email confirmation
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      userId: authData.user.id,
    })

    if (sessionError || !sessionData.session) {
      return { success: false, error: sessionError?.message || "Failed to create session" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Server signup error:", error)
    return { success: false, error: error.message || "An error occurred during signup" }
  }
}
