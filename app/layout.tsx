import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"
import { SupabaseError } from "@/components/supabase-error"
import { EnvInjector } from "@/components/env-injector"
import Link from "next/link"
import { NetworkStatus } from "@/components/network-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ActiModo - Field Booking Platform",
  description: "Book sports fields easily with ActiModo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if Supabase environment variables are defined
  const supabaseEnvDefined = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EnvInjector />
          {supabaseEnvDefined ? (
            <AuthProvider>
              <PlayerLayoutWrapper>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <NetworkStatus />
                    <SupabaseError />
                    {children}
                  </main>
                  <Footer />
                </div>
              </PlayerLayoutWrapper>
            </AuthProvider>
          ) : (
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold">ActiModo</span>
                  </Link>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
