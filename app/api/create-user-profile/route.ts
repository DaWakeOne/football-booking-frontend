import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")

export async function POST(request) {
  try {
    const { userId, email, role } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create user profile
    const { error } = await supabaseAdmin.from("users").insert([{ id: userId, email, role: role || "player" }])

    if (error) {
      console.error("Error creating user profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in create-user-profile route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
