import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error checking user profile:", profileError)
      }

      // If profile doesn't exist, create it
      if (!profile) {
        const role = user.user_metadata?.role || "player" // Default to player if not specified

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            role,
          },
        ])

        if (insertError) {
          console.error("Error creating user profile:", insertError)
        }
      }
    }
  }

  // Redirect to the confirmation page
  return NextResponse.redirect(new URL("/auth/confirmation", request.url))
}
