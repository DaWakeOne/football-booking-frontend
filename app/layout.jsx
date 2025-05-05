import "./globals.css"

export const metadata = {
  title: "ActiModo",
  description: "Football field booking platform",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  )
}
