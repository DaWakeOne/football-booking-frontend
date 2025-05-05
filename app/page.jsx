export default function HomePage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold">ActiModo</h1>
        <p className="mb-6">Join our community</p>
        <div className="space-y-4">
          <a href="/signup/owner" className="block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Create Field Owner Account
          </a>
          <a href="#" className="block rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Create Player Account
          </a>
          <a href="#" className="block rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Login as Player
          </a>
          <a href="#" className="block rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            Login as Field Owner
          </a>
        </div>
      </div>
    </div>
  )
}
