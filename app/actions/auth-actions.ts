"use server"

import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"
import { createUserProfile } from "./user-actions"

export async function checkEmailConfirmationStatus(email: string) {
  try {
    const supabase = createServerClient()

    // This is a workaround since there's no direct API to check email confirmation status
    // We'll try to sign in with a dummy password and check the error message
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "dummy_password_that_will_fail",
    })

    if (error) {
      // If the error message mentions "Email not confirmed", then the email is not confirmed
      if (error.message.includes("Email not confirmed")) {
        return { confirmed: false, message: "Email not confirmed" }
      }

      // If the error is about invalid credentials, the email is confirmed but password is wrong
      if (error.message.includes("Invalid login credentials")) {
        return { confirmed: true, message: "Email confirmed" }
      }

      // Other errors
      return { confirmed: false, message: error.message }
    }

    // If no error, the email is confirmed (though this shouldn't happen with a dummy password)
    return { confirmed: true, message: "Email confirmed" }
  } catch (error: any) {
    console.error("Error checking email confirmation status:", error)
    return { confirmed: false, message: error.message || "An error occurred" }
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { success: true, message: "Confirmation email sent" }
  } catch (error: any) {
    console.error("Error resending confirmation email:", error)
    return { success: false, message: error.message || "An error occurred" }
  }
}

export async function devLogin(email: string, password: string, role: UserRole) {
  try {
    const supabase = createServerClient()

    // First, try to sign up the user if they don't exist
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This doesn't actually bypass email confirmation, but we'll handle it differently
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
      },
    })

    // If the user already exists, try to sign in
    if (signUpError || !signUpData.user) {
      // Check for network errors
      if (signUpError && (signUpError.message.includes("fetch") || signUpError.message.includes("network"))) {
        return { success: false, error: `Network error: ${signUpError.message}` }
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Check for network errors
        if (signInError.message.includes("fetch") || signInError.message.includes("network")) {
          return { success: false, error: `Network error: ${signInError.message}` }
        }

        // If the error is about email confirmation, we'll bypass it for development
        if (signInError.message.includes("Email not confirmed")) {
          // For development, we'll use admin API to get the user
          const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.getUserByEmail(email)

          if (adminAuthError || !adminAuthData.user) {
            return { success: false, error: adminAuthError?.message || "User not found" }
          }

          // Create or update the user profile
          const profileResult = await createUserProfile(adminAuthData.user.id, email, role)
          if (!profileResult.success) {
            return { success: false, error: profileResult.error || "Failed to create user profile" }
          }

          // Create a new session for the user
          const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
            userId: adminAuthData.user.id,
          })

          if (sessionError || !sessionData.session) {
            return { success: false, error: sessionError?.message || "Failed to create session" }
          }

          return { success: true }
        }

        return { success: false, error: signInError.message }
      }

      if (!signInData.user) {
        return { success: false, error: "Failed to sign in" }
      }

      // Check if the user has a profile, create one if not
      const { data: userData } = await supabase.from("users").select("role").eq("id", signInData.user.id).single()

      if (!userData) {
        const profileResult = await createUserProfile(signInData.user.id, email, role)
        if (!profileResult.success) {
          return { success: false, error: profileResult.error || "Failed to create user profile" }
        }
      } else if (userData.role !== role) {
        return { success: false, error: `You are not registered as a ${role}` }
      }

      return { success: true }
    }

    // If we got here, the user was created successfully
    // Create the user profile
    const profileResult = await createUserProfile(signUpData.user.id, email, role)
    if (!profileResult.success) {
      return { success: false, error: profileResult.error || "Failed to create user profile" }
    }

    // For development, we'll create a session without email confirmation
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      userId: signUpData.user.id,
    })

    if (sessionError || !sessionData.session) {
      return { success: false, error: sessionError?.message || "Failed to create session" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Dev login error:", error)
    return { success: false, error: error.message || "An error occurred" }
  }
}
