"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function MinimalSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("player")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle signup here
    console.log("Signup attempt with:", email, password, role)
    alert("Signup functionality will be implemented soon!")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up for ActiModo</h1>

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

          <div className="mb-4">
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

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">I am a:</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="player"
                  checked={role === "player"}
                  onChange={() => setRole("player")}
                  className="mr-2"
                />
                Player
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="owner"
                  checked={role === "owner"}
                  onChange={() => setRole("owner")}
                  className="mr-2"
                />
                Field Owner
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/minimal-login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        <Link href="/" className="mt-8 text-gray-500 hover:underline">
          Back to Home
        </Link>
      </main>
    </div>
  )
}
