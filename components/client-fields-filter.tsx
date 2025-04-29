"use client"

import { useState } from "react"
import { FieldsFilter } from "./fields-filter"

export function ClientFieldsFilter() {
  const [_, setFilters] = useState({})

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    // In a real app, we would filter the fields based on these filters
  }

  return <FieldsFilter onFilterChange={handleFilterChange} />
}
