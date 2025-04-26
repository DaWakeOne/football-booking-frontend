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

    if (!checkError && existingUser) {
      // User already exists, update their role
      const { error: updateError } = await supabase.from("users").update({ role }).eq("id", userId)

      if (updateError) {
        console.error("Error updating user role:", updateError)
        return { success: false, error: updateError.message }
      }

      return { success: true }
    }

    // Create new user
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email,
      role,
    })

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error creating user profile:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
