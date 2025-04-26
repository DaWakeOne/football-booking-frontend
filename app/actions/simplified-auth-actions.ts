"use server"

import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"
import { createUserProfile } from "./user-actions"

export async function simplifiedLogin(email: string, password: string, role: UserRole) {
  try {
    const supabase = createServerClient()
    console.log("Starting simplified login for:", email)

    // Sign in the user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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

    console.log("Login successful, checking user role")

    // Check if user has the correct role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single()

    console.log("User data query result:", { userData, userError })

    if (userError && userError.code === "PGRST116") {
      console.log("User profile not found, creating one")
      // Create user profile
      const profileResult = await createUserProfile(authData.user.id, email, role)
      if (!profileResult.success) {
        return {
          success: false,
          error: profileResult.error || "Failed to create user profile",
          debug: { profileResult },
        }
      }
    } else if (!userError && userData.role !== role) {
      return {
        success: false,
        error: `You are not registered as a ${role}. Please use the correct login page.`,
        debug: { userData },
      }
    }

    console.log("Login and role check successful")

    return {
      success: true,
      userId: authData.user.id,
      session: authData.session ? true : false,
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

export async function simplifiedSignup(email: string, password: string, role: UserRole) {
  try {
    const supabase = createServerClient()
    console.log("Starting simplified signup for:", email)

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email verification in development
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

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
        error: "No user returned from signup",
      }
    }

    // Create user profile
    const profileResult = await createUserProfile(authData.user.id, email, role)
    if (!profileResult.success) {
      return {
        success: false,
        error: profileResult.error || "Failed to create user profile",
      }
    }

    // Check if email confirmation is required
    if (authData.user.identities && authData.user.identities.length > 0) {
      const identity = authData.user.identities[0]
      if (identity.identity_data && identity.identity_data.email_confirmed_at === null) {
        return {
          success: true,
          userId: authData.user.id,
          emailConfirmationRequired: true,
        }
      }
    }

    return {
      success: true,
      userId: authData.user.id,
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
