export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-bold">ActiModo</h1>
        <p className="text-xl">Football Field Booking Platform</p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="/login" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Login
          </a>
          <a href="/signup" className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700">
            Sign Up
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">For Players</h2>
            <p>Find and book football fields, connect with other players, and manage your schedule.</p>
          </div>
          <div className="rounded-lg border p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">For Field Owners</h2>
            <p>List your football fields, manage bookings, and increase your visibility.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
