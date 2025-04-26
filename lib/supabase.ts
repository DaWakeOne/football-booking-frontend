import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Function to get Supabase URL with fallback for build time
export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    // During build time, return a placeholder
    if (process.env.NODE_ENV === "production") {
      console.warn("NEXT_PUBLIC_SUPABASE_URL is not defined, using placeholder for build")
      return "https://placeholder-for-build.supabase.co"
    }
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  }
  return url
}

// Function to get Supabase anon key with fallback for build time
export function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    // During build time, return a placeholder
    if (process.env.NODE_ENV === "production") {
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined, using placeholder for build")
      return "placeholder-key-for-build-time"
    }
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
  }
  return key
}

// Create a Supabase client for server-side usage
export function createServerClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
    },
  })
}

// Create a Supabase client for browser usage
export function createBrowserClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: true,
      storageKey: "supabase_auth_token",
    },
  })
}
