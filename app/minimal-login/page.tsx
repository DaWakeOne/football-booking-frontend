"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function MinimalLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle login here
    console.log("Login attempt with:", email, password)
    alert("Login functionality will be implemented soon!")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to ActiModo</h1>

        <form onSubmit={handleSubmit} className="w-full">
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
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </form>

        <p className="mt-4">
          Don't have an account?{" "}
          <Link href="/minimal-signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <Link href="/" className="mt-8 text-gray-500 hover:underline">
          Back to Home
        </Link>
      </main>
    </div>
  )
}
