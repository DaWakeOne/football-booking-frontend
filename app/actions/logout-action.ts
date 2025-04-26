"use server"

import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function serverLogout() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient()

    // Sign out the user
    await supabase.auth.signOut()

    return { success: true }
  } catch (error: any) {
    console.error("Server logout error:", error)
    return {
      success: false,
      error: error.message || "An error occurred during logout",
    }
  }
}
