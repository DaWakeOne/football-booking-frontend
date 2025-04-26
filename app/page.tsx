import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Welcome to ActiModo</h1>
        <p className="text-xl text-muted-foreground mb-8">Your football field booking platform</p>

        <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
          <Button asChild size="lg" className="w-full">
            <Link href="/test">Test Page</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/fields">Browse Fields</Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg text-left">
          <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="/test" className="text-blue-600 hover:underline">
                Test Page
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
