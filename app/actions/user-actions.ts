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
      console.error("Error checking user:", checkError)
      return { success: false, error: checkError.message }
    }

    // If user already exists, return success
    if (existingUser) {
      return { success: true }
    }

    // Create user profile
    const { error } = await supabase.from("users").insert([
      {
        id: userId,
        email,
        role,
      },
    ])

    if (error) {
      console.error("Error creating user profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in createUserProfile:", error)
    return { success: false, error: error.message || "An error occurred" }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error getting user profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in getUserProfile:", error)
    return { success: false, error: error.message || "An error occurred" }
  }
}
