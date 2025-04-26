import { createServerClient } from "@/lib/supabase"
import { redirect, notFound } from "next/navigation"
import type { Field } from "@/lib/database.types"
import { FieldForm } from "@/components/field-form"

interface EditFieldPageProps {
  params: {
    id: string
  }
}

async function getField(id: string): Promise<Field | null> {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("id", id)
    .eq("owner_id", session.user.id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditFieldPage({ params }: EditFieldPageProps) {
  const field = await getField(params.id)

  if (!field) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Field</h1>

      <FieldForm userId={field.owner_id} field={field} />
    </div>
  )
}
