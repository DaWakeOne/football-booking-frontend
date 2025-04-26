import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminFieldsList } from "@/components/admin-fields-list"
import { AuthCheck } from "@/components/auth-check"

export default function AdminFieldsPage() {
  return (
    <AuthCheck requiredRole="owner">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Fields</h1>
          <Button asChild>
            <Link href="/admin/fields/new">Add New Field</Link>
          </Button>
        </div>

        <AdminFieldsList fields={[]} />
      </div>
    </AuthCheck>
  )
}
