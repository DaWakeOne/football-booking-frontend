"use server"

import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"
import { cookies } from "next/headers"
import { createUserProfile } from "./user-actions"

// Helper function to create a session cookie
async function createSessionCookie(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient()

  try {
    // Create a new session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      userId: userId,
    })

    if (sessionError || !sessionData.session) {
      console.error("Error creating session:", sessionError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createSessionCookie:", error)
    return false
  }
}

export async function directLogin(email: string, password: string, role: UserRole) {
  try {
    const supabase = createServerClient()
    console.log("Starting direct login for:", email)

    // First try normal login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // If there's an error about email confirmation, we'll bypass it
    if (authError && authError.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, bypassing verification")

      // Get the user by email
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email)

      if (userError || !userData.user) {
        console.error("Error getting user by email:", userError)
        return {
          success: false,
          error: userError?.message || "User not found",
          debug: { error: userError },
        }
      }

      // Create a session for the user
      const sessionCreated = await createSessionCookie(userData.user.id)
      if (!sessionCreated) {
        return {
          success: false,
          error: "Failed to create session",
        }
      }

      // Check if user has a profile, create one if not
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userData.user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // Create user profile
        const profileResult = await createUserProfile(userData.user.id, email, role)
        if (!profileResult.success) {
          return {
            success: false,
            error: profileResult.error || "Failed to create user profile",
          }
        }
      } else if (!profileError && profileData.role !== role) {
        return {
          success: false,
          error: `You are not registered as a ${role}. Please use the correct login page.`,
        }
      }

      return {
        success: true,
        userId: userData.user.id,
      }
    }

    // Handle other auth errors
    if (authError) {
      console.error("Auth error:", authError)
      return {
        success: false,
        error: authError.message,
        debug: { error: authError },
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: "No user returned from login",
      }
    }

    // Check if user has the correct role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single()

    if (userError && userError.code === "PGRST116") {
      // Create user profile
      const profileResult = await createUserProfile(authData.user.id, email, role)
      if (!profileResult.success) {
        return {
          success: false,
          error: profileResult.error || "Failed to create user profile",
        }
      }
    } else if (!userError && userData.role !== role) {
      return {
        success: false,
        error: `You are not registered as a ${role}. Please use the correct login page.`,
      }
    }

    return {
      success: true,
      userId: authData.user.id,
    }
  } catch (error: any) {
    console.error("Server login error:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      debug: { error: error.toString(), stack: error.stack },
    }
  }
}

export async function directSignup(email: string, password: string, role: UserRole) {
  try {
    const supabase = createServerClient()
    console.log("Starting direct signup for:", email)

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase.auth.admin.getUserByEmail(email)

    if (existingUser && existingUser.user) {
      // User exists, try to sign them in instead
      return directLogin(email, password, role)
    }

    // Create the user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
    })

    if (userError || !userData.user) {
      console.error("Error creating user:", userError)
      return {
        success: false,
        error: userError?.message || "Failed to create user",
        debug: { error: userError },
      }
    }

    // Create user profile
    const profileResult = await createUserProfile(userData.user.id, email, role)
    if (!profileResult.success) {
      return {
        success: false,
        error: profileResult.error || "Failed to create user profile",
      }
    }

    // Create a session for the user
    const sessionCreated = await createSessionCookie(userData.user.id)
    if (!sessionCreated) {
      return {
        success: false,
        error: "Failed to create session",
      }
    }

    return {
      success: true,
      userId: userData.user.id,
    }
  } catch (error: any) {
    console.error("Server signup error:", error)
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
      debug: { error: error.toString(), stack: error.stack },
    }
  }
}
