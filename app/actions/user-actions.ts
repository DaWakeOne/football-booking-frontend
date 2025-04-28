"use server"

import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"

export async function createUserProfile(userId: string, email: string, role: UserRole) {
  try {
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing user:", checkError)
      return { success: false, error: checkError.message }
    }

    // If user already exists, don't create a new one
    if (existingUser) {
      return { success: true }
    }

    // Create new user profile
    const { error } = await supabase.from("users").insert({
      id: userId,
      email,
      role,
    })

    if (error) {
      console.error("Error creating user profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error in createUserProfile:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
