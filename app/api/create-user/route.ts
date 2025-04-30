import { createServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, email, role } = await request.json()

    if (!id || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.from("users").select("id").eq("id", id).single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing user:", checkError)
      return NextResponse.json({ error: "Error checking for existing user" }, { status: 500 })
    }

    // If user already exists, return success
    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists" })
    }

    // Create new user
    const { error: insertError } = await supabase.from("users").insert([{ id, email, role }])

    if (insertError) {
      console.error("Error creating user:", insertError)
      return NextResponse.json({ error: "Error creating user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in create-user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
