import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Book Football Fields with Ease
            </h1>
            <p className="text-gray-500 md:text-xl max-w-2xl">
              ActiModo connects players with field owners for seamless booking experiences. Find and reserve the perfect
              field for your game.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/signup/player">Join as Player</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup/owner">Register Your Field</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Find Fields</h3>
              <p className="text-gray-500">Browse available football fields in your area with detailed information.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Book Online</h3>
              <p className="text-gray-500">
                Reserve your preferred time slot with just a few clicks, no phone calls needed.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Play Together</h3>
              <p className="text-gray-500">
                Connect with other players, form teams, and enjoy your game on quality fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-6">
        <div className="container text-center text-gray-500">
          <p>© 2023 ActiModo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
