export default function ProfileLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

      <div className="border rounded-lg p-6 max-w-2xl mx-auto">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="space-y-6">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-32 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
