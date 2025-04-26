export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ActiModo Test Page</h1>
      <p className="mt-4 text-xl">If you can see this, your deployment is working!</p>

      <div className="mt-8 p-6 bg-muted rounded-lg max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Environment Variables Status</h2>
        <ul className="space-y-2">
          <li>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</li>
        </ul>

        <div className="mt-6 p-4 bg-amber-100 dark:bg-amber-950 rounded border border-amber-300 dark:border-amber-800">
          <h3 className="font-medium">Next Steps:</h3>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Add the required environment variables in your Vercel project settings</li>
            <li>Redeploy your application after adding the variables</li>
            <li>Visit the main page after the environment variables are set</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
