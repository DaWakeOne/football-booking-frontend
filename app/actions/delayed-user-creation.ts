"use server"

import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function scheduleUserCreation(userId: string, email: string, role: string) {
  try {
    // Store the user creation request in a separate table
    const { error } = await supabaseAdmin.from("pending_users").insert([
      {
        user_id: userId,
        email,
        role,
        attempts: 0,
        status: "pending",
      },
    ])

    if (error) {
      console.error("Error scheduling user creation:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Server error in scheduleUserCreation:", error)
    return { success: false, error: error.message || "Internal server error" }
  }
}
