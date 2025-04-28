import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Get Supabase URL and anon key from environment variables
export function getSupabaseUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
    return "https://placeholder.supabase.co" // Placeholder for build time
  }
  return supabaseUrl
}

export function getSupabaseAnonKey() {
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseAnonKey) {
    console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
    return "placeholder-key" // Placeholder for build time
  }
  return supabaseAnonKey
}

// Create a Supabase client for use in the browser
export function createBrowserClient() {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Create a Supabase client for use in server components
export function createServerClient() {
  const supabaseUrl = getSupabaseUrl()
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
