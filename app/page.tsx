import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">ActiModo</h1>
        <p className="text-xl mb-8 text-center">Football Field Booking Platform</p>
        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/minimal-login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Login
          </Link>
          <Link
            href="/minimal-signup"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  )
}
