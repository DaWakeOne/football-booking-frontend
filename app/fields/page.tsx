import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"
import { FieldsList } from "@/components/fields-list"
import { FieldsFilter } from "@/components/fields-filter"

export default function FieldsPage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">Football Fields</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FieldsFilter />
        </div>
        <div className="md:col-span-3">
          <FieldsList />
        </div>
      </div>
    </PlayerLayoutWrapper>
  )
}
