import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase-server"
import type { Field } from "@/lib/database.types"
import { ClientFieldsList } from "@/components/client-fields-list"
import { ClientFieldsFilter } from "@/components/client-fields-filter"

export const dynamic = "force-dynamic"

export default async function FieldsPage() {
  const supabase = createServerClient()

  // Fetch all fields
  const { data: fields } = await supabase.from("fields").select("*").order("name")

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Available Fields</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div>
          <Suspense fallback={<div>Loading filters...</div>}>
            <ClientFieldsFilter />
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Loading fields...</div>}>
            <ClientFieldsList initialFields={fields as Field[]} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
