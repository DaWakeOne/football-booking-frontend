import Link from "next/link"

export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-xl mb-8 max-w-2xl text-center">
        Have questions about ActiModo? Contact us at support@actimodo.com
      </p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Back to Home
      </Link>
    </main>
  )
}
