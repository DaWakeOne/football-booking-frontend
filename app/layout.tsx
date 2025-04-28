import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ActiModo - Football Field Booking Platform",
  description: "Book football fields and connect with players",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white p-4 shadow">
          <div className="container mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              ActiModo
            </a>
            <nav className="space-x-4">
              <a href="/login" className="hover:underline">
                Login
              </a>
              <a href="/signup" className="hover:underline">
                Sign Up
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-100 p-4 text-center text-gray-600">
          <div className="container mx-auto">
            <p>© 2023 ActiModo. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
