import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const { userId, email, role } = await request.json()

    if (!userId || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the user already exists in the users table
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing user:", checkError)
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    // If user already exists, return success
    if (existingUser) {
      return NextResponse.json({ success: true, message: "User already exists" })
    }

    // Add a small delay to ensure auth user is fully propagated
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Try to insert the user
    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        id: userId,
        email,
        role,
      },
    ])

    if (insertError) {
      console.error("Error creating user:", insertError)

      // If it's a foreign key violation, we'll retry after a delay
      if (insertError.code === "23503") {
        // Wait a bit longer and try again
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const { error: retryError } = await supabaseAdmin.from("users").insert([
          {
            id: userId,
            email,
            role,
          },
        ])

        if (retryError) {
          console.error("Error creating user on retry:", retryError)
          return NextResponse.json({ error: retryError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
      }

      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
