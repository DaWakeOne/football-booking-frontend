import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Building2, LogIn, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Logo */}
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-4xl md:text-6xl font-bold text-blue-600">ActiModo</h1>
              </div>

              {/* Motivational Text */}
              <div className="space-y-4 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Join our community</h2>
                <p className="text-xl text-gray-600">See available fields or offers near you</p>
              </div>

              {/* New Users Section */}
              <div className="w-full max-w-md space-y-6 mt-8">
                <h3 className="text-xl font-semibold">New to ActiModo?</h3>
                <div className="grid gap-4">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/signup/player">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Player Account
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link href="/signup/owner">
                      <Building2 className="mr-2 h-5 w-5" />
                      Create Field Owner Account
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Returning Users Section */}
              <div className="w-full max-w-md space-y-6 mt-4">
                <h3 className="text-xl font-semibold">Already have an account?</h3>
                <div className="grid gap-4">
                  <Button size="lg" variant="secondary" className="w-full" asChild>
                    <Link href="/login/player">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login as Player
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full" asChild>
                    <Link href="/login/owner">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login as Owner
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose ActiModo?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Players</h3>
                <p className="text-gray-600">Connect with other players and form teams for your matches.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Fields</h3>
                <p className="text-gray-600">Find and book available fields in your area with ease.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ArrowRight className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600">Get instant notifications about bookings and team activities.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2023 ActiModo. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
