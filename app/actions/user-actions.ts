"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function createUserProfile(userId: string, email: string, role: "player" | "owner") {
  try {
    console.log("Creating user profile for:", userId, email, role)

    // Use the admin client to bypass RLS
    const { error } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        email,
        role,
      },
    ])

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error creating user profile:", error)
    return {
      success: false,
      error: error.message || "Failed to create user profile",
    }
  }
}
