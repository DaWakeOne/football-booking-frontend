import Link from "next/link"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">About ActiModo</h1>

        <div className="prose">
          <p className="mb-4">
            ActiModo is a modern platform for booking football fields and connecting with other players.
          </p>

          <p className="mb-4">
            Our mission is to make sports more accessible by simplifying the process of finding and booking sports
            facilities.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">For Players</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>Find available fields near you</li>
            <li>Book fields with just a few clicks</li>
            <li>Connect with other players</li>
            <li>Share your availability</li>
            <li>Join teams and participate in matches</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">For Field Owners</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>List your fields on our platform</li>
            <li>Manage bookings efficiently</li>
            <li>Increase visibility and occupancy</li>
            <li>Receive payments securely</li>
            <li>Get insights about your field usage</li>
          </ul>
        </div>

        <Link href="/" className="mt-8 text-blue-500 hover:underline">
          Back to Home
        </Link>
      </main>
    </div>
  )
}
