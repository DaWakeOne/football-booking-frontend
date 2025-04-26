import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Check if we're in the browser
const isBrowser = typeof window !== "undefined"

// Try to get environment variables from window if they're not available directly
// This helps with "Open in new tab" scenarios
const getEnvVariable = (key: string): string | undefined => {
  if (isBrowser) {
    // Try to get from window.__ENV__ if it exists (we'll create this)
    const windowEnv = (window as any).__ENV__
    if (windowEnv && windowEnv[key]) {
      return windowEnv[key]
    }
  }
  return process.env[key]
}

// Update the getSupabaseUrl function to provide a clearer error message
const getSupabaseUrl = (): string => {
  const url = getEnvVariable("NEXT_PUBLIC_SUPABASE_URL")
  if (!url) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL is not defined. Please set this environment variable in your Vercel project settings.",
    )
    // Return a placeholder that will cause a more meaningful error if used
    return "https://missing-supabase-url.supabase.co"
  }
  return url
}

const getSupabaseAnonKey = (): string => {
  const key = getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!key) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please set this environment variable in your Vercel project settings.",
    )
    // Return a placeholder that will cause a more meaningful error if used
    return "missing-supabase-anon-key"
  }
  return key
}

const getSupabaseServiceKey = (): string => {
  const key = getEnvVariable("SUPABASE_SERVICE_ROLE_KEY")
  if (!key) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    // Return a placeholder that will cause a more meaningful error if used
    return "missing-supabase-service-role-key"
  }
  return key
}

// Create a single supabase client for the browser
export const createBrowserClient = () => {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()

  // Add a try-catch to provide better error messages
  try {
    // Create client with custom fetch options to handle CORS issues
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: (...args) => {
          // Use the default fetch with custom error handling
          return fetch(...args).catch((err) => {
            console.error("Fetch error in Supabase client:", err)
            // Re-throw with a more descriptive message
            throw new Error(`Network request failed: ${err.message}`)
          })
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a dummy client that will show errors when methods are called
    return {
      auth: {
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: new Error("Supabase client initialization failed") }),
        signInWithPassword: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: new Error("Supabase client initialization failed"),
          }),
        signUp: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: new Error("Supabase client initialization failed"),
          }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        resend: () => Promise.resolve({ error: new Error("Supabase client initialization failed") }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error("Supabase client initialization failed") }),
            order: () => Promise.resolve({ data: null, error: new Error("Supabase client initialization failed") }),
            limit: () => Promise.resolve({ data: null, error: new Error("Supabase client initialization failed") }),
          }),
          order: () => Promise.resolve({ data: null, error: new Error("Supabase client initialization failed") }),
          limit: () => Promise.resolve({ data: null, error: new Error("Supabase client initialization failed") }),
        }),
        insert: () => Promise.resolve({ error: new Error("Supabase client initialization failed") }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error("Supabase client initialization failed") }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: new Error("Supabase client initialization failed") }) }),
      }),
    } as any
  }
}

// For server components
export const createServerClient = () => {
  const supabaseUrl = getSupabaseUrl()
  const supabaseServiceKey = getSupabaseServiceKey()

  try {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    // Return a dummy client for server
    return {
      auth: {
        getSession: () =>
          Promise.resolve({
            data: { session: null },
            error: new Error("Supabase server client initialization failed"),
          }),
        admin: {
          getUserByEmail: () =>
            Promise.resolve({ data: { user: null }, error: new Error("Supabase server client initialization failed") }),
          createSession: () =>
            Promise.resolve({
              data: { session: null },
              error: new Error("Supabase server client initialization failed"),
            }),
        },
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: new Error("Supabase server client initialization failed") }),
            order: () =>
              Promise.resolve({ data: null, error: new Error("Supabase server client initialization failed") }),
          }),
          order: () =>
            Promise.resolve({ data: null, error: new Error("Supabase server client initialization failed") }),
        }),
        insert: () => Promise.resolve({ error: new Error("Supabase server client initialization failed") }),
        update: () => ({
          eq: () => Promise.resolve({ error: new Error("Supabase server client initialization failed") }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ error: new Error("Supabase server client initialization failed") }),
        }),
      }),
    } as any
  }
}
