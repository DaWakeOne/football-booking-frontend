"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle form submission here
    console.log("Contact form submitted:", name, email, message)
    alert("Thank you for your message! We will get back to you soon.")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              rows={5}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send Message
          </button>
        </form>

        <Link href="/" className="mt-8 text-gray-500 hover:underline">
          Back to Home
        </Link>
      </main>
    </div>
  )
}
