export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to ActiModo</h1>
      <p className="text-xl mb-8">Your football field booking platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <a href="/login/player" className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Player Login</h2>
          <p>Find and book football fields, manage your schedule</p>
        </a>

        <a href="/login/owner" className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Field Owner Login</h2>
          <p>Manage your fields and bookings</p>
        </a>

        <a href="/signup/player" className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Player Signup</h2>
          <p>Create a new player account</p>
        </a>

        <a href="/signup/owner" className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Field Owner Signup</h2>
          <p>Register as a field owner</p>
        </a>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Development Options</h3>
        <div className="flex gap-4">
          <a href="/dev-login/player" className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors">
            Dev Player Login
          </a>
          <a href="/dev-login/owner" className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors">
            Dev Owner Login
          </a>
        </div>
      </div>
    </div>
  )
}
