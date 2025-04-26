export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">ActiModo Test Page</h1>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Success!</p>
          <p>If you can see this page, your Next.js application is working.</p>
        </div>

        <div className="bg-muted p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <ul className="space-y-2">
            <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</li>
            <li>
              NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
            </li>
            <li>NODE_ENV: {process.env.NODE_ENV || "Not set"}</li>
          </ul>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Verify environment variables are set in Vercel</li>
            <li>Check build logs for any errors</li>
            <li>Ensure all required dependencies are installed</li>
            <li>Try a clean rebuild by clearing the Vercel cache</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
