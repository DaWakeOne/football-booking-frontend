"use client"

import { useState } from "react"
import { FieldsList } from "./fields-list"
import type { Field } from "@/lib/database.types"

export function ClientFieldsList({ initialFields }: { initialFields: Field[] }) {
  const [fields] = useState<Field[]>(initialFields)

  return <FieldsList fields={fields} />
}
