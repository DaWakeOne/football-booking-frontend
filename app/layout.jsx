import "./globals.css"
import SupabaseProvider from "../components/supabase-provider"

export const metadata = {
  title: "ActiModo",
  description: "Football field booking platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <main className="min-h-screen bg-white">{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  )
}
