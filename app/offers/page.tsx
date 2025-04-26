import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function checkUserRole() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login/player")
  }

  // Check if the user is a player
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || userData?.role !== "player") {
    redirect("/")
  }
}

export default async function OffersPage() {
  await checkUserRole()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Special Offers</h1>
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium">No offers available</h3>
        <p className="text-muted-foreground mt-2">Check back later for special deals on field bookings.</p>
      </div>
    </div>
  )
}
