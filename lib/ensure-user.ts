import { createServerClient } from "@/lib/supabase"
import type { UserRole } from "@/lib/database.types"

export async function ensureUserExists(userId: string, email: string, role: UserRole) {
  const supabase = createServerClient()

  // Check if the user already exists
  const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("id", userId).single()

  if (checkError && checkError.code === "PGRST116") {
    // User doesn't exist, create them
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email: email,
      role: role,
    })

    if (insertError) {
      console.error("Error creating user record:", insertError)
      return false
    }

    return true
  }

  return !!existingUser
}
