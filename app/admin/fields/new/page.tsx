import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { FieldForm } from "@/components/field-form"

export default async function NewFieldPage() {
  const cookieStore = cookies()
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Field</h1>

      <FieldForm userId={session.user.id} />
    </div>
  )
}
