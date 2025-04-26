import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/client-auth-provider"
import { NetworkStatus } from "@/components/network-status"
import { EnvInjector } from "@/components/env-injector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ActiModo - Football Field Booking Platform",
  description: "Book football fields and connect with other players",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <EnvInjector />
          <ClientAuthProvider>
            {children}
            <NetworkStatus />
          </ClientAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
