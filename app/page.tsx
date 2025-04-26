import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FieldCard } from "@/components/field-card"
import { AuthStatus } from "@/components/auth-status"

export default function Home() {
  // For demo purposes, we'll create some sample fields
  const featuredFields = [
    {
      id: "1",
      name: "Central Stadium",
      location: "Downtown",
      surface_type: "Natural Grass",
      price_per_hour: 50,
      open_time: "09:00:00",
      close_time: "22:00:00",
      image_url: null,
      field_type: "closed",
    },
    {
      id: "2",
      name: "Sports Complex",
      location: "Westside",
      surface_type: "Artificial Turf",
      price_per_hour: 40,
      open_time: "08:00:00",
      close_time: "23:00:00",
      image_url: null,
      field_type: "closed",
      field_size: "100m x 64m",
    },
    {
      id: "3",
      name: "Community Field",
      location: "Eastside",
      surface_type: "5-a-side",
      price_per_hour: 30,
      open_time: "10:00:00",
      close_time: "21:00:00",
      image_url: null,
      field_type: "open",
    },
  ]

  // Check if Supabase environment variables are defined
  const supabaseEnvDefined = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to ActiModo
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Find and book the perfect football field for your game. No hassle, just play.
              </p>
            </div>

            {!supabaseEnvDefined && (
              <div className="mt-8 p-6 bg-amber-100 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-800 max-w-2xl">
                <h2 className="text-xl font-semibold mb-2">⚠️ Environment Variables Missing</h2>
                <p className="mb-4">
                  The Supabase environment variables are not configured. Please add them to your Vercel project
                  settings.
                </p>
                <Button asChild>
                  <Link href="/test">View Test Page</Link>
                </Button>
              </div>
            )}

            {supabaseEnvDefined && (
              <div className="space-y-4">
                <Button asChild size="lg">
                  <Link href="/fields">Browse Fields</Link>
                </Button>
                <div className="pt-4">
                  <AuthStatus />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {supabaseEnvDefined ? (
        <>
          {/* Login Options Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join ActiModo</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Choose how you want to use our platform
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-8">
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">I'm a Player</h3>
                  <p className="text-center text-muted-foreground">
                    Find and book football fields for your games. Manage your bookings easily.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/signup/player">Sign Up as Player</Link>
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login/player" className="underline">
                      Login as Player
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                      <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">I'm a Field Owner</h3>
                  <p className="text-center text-muted-foreground">
                    List your football fields and manage bookings. Grow your business with us.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/signup/owner">Sign Up as Owner</Link>
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login/owner" className="underline">
                      Login as Owner
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Setup Instructions</h2>
                <ol className="list-decimal ml-5 space-y-4">
                  <li>
                    <strong>Add Environment Variables:</strong>
                    <p className="mt-1">Add the following environment variables to your Vercel project:</p>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>
                        <code>NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project URL
                      </li>
                      <li>
                        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key
                      </li>
                      <li>
                        <code>SUPABASE_SERVICE_ROLE_KEY</code> - Your Supabase service role key
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Redeploy Your Application:</strong>
                    <p className="mt-1">After adding the environment variables, redeploy your application.</p>
                  </li>
                  <li>
                    <strong>Test Your Setup:</strong>
                    <p className="mt-1">Visit the test page to verify your environment variables are working.</p>
                    <div className="mt-2">
                      <Button asChild>
                        <Link href="/test">Go to Test Page</Link>
                      </Button>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {supabaseEnvDefined && (
        <>
          {/* Featured Fields Section */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Fields</h2>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Check out some of our most popular football fields
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {featuredFields.map((field) => (
                  <FieldCard key={field.id} field={field as any} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild variant="outline">
                  <Link href="/fields">View All Fields</Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
