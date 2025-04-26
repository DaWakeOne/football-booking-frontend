import type { UserRole } from "@/lib/database.types"

// Define the auth user type
export interface AuthUser {
  id: string
  email: string
  role: UserRole
  timestamp: number
}

// Key for localStorage
const AUTH_KEY = "football_booking_auth"

// Save auth data to localStorage
export function saveAuthData(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))

    // Also set a global variable for immediate access
    if (typeof window !== "undefined") {
      ;(window as any).__AUTH_USER = user
    }

    console.log("Auth data saved successfully:", user)
  } catch (error) {
    console.error("Failed to save auth data:", error)
  }
}

// Get auth data from localStorage
export function getAuthData(): AuthUser | null {
  try {
    // First check the global variable for immediate access
    if (typeof window !== "undefined" && (window as any).__AUTH_USER) {
      return (window as any).__AUTH_USER
    }

    // Then check localStorage
    const data = localStorage.getItem(AUTH_KEY)
    if (!data) return null

    const user = JSON.parse(data) as AuthUser

    // Set the global variable for future immediate access
    if (typeof window !== "undefined") {
      ;(window as any).__AUTH_USER = user
    }

    return user
  } catch (error) {
    console.error("Failed to get auth data:", error)
    return null
  }
}

// Clear auth data
export function clearAuthData(): void {
  try {
    localStorage.removeItem(AUTH_KEY)

    // Also clear the global variable
    if (typeof window !== "undefined") {
      ;(window as any).__AUTH_USER = null
    }

    console.log("Auth data cleared successfully")
  } catch (error) {
    console.error("Failed to clear auth data:", error)
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthData() !== null
}

// Get user role
export function getUserRole(): UserRole | null {
  const user = getAuthData()
  return user ? user.role : null
}

// Generate a user ID from email (for demo purposes)
export function generateUserId(email: string): string {
  // Create a consistent ID based on email
  return btoa(email).replace(/=/g, "").substring(0, 36)
}

// Login user
export function loginUser(email: string, role: UserRole): void {
  const userId = generateUserId(email)

  const user: AuthUser = {
    id: userId,
    email,
    role,
    timestamp: Date.now(),
  }

  saveAuthData(user)
}
