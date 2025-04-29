"use client"

import { useState } from "react"
import type { Field } from "@/lib/database.types"
import { FieldCard } from "./field-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FieldsListProps {
  fields: Field[]
  itemsPerPage?: number
}

export function FieldsList({ fields, itemsPerPage = 6 }: FieldsListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(fields.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFields = fields.slice(startIndex, startIndex + itemsPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (fields.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium">No fields found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedFields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
