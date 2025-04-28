export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-md">
        <h1 className="text-2xl font-bold">Test Page</h1>
        <p>If you can see this, routing is working correctly!</p>
        <a href="/" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  )
}
