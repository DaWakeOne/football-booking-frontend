"use client"

import type { UserRole } from "@/lib/database.types"

export function isAuthenticated(): boolean {
  try {
    const authData = localStorage.getItem("auth_user")
    return !!authData
  } catch (e) {
    console.error("Error checking authentication:", e)
    return false
  }
}

export function getUserRole(): UserRole | null {
  try {
    const authData = localStorage.getItem("auth_user")
    if (authData) {
      const userData = JSON.parse(authData)
      return userData.role as UserRole
    }
    return null
  } catch (e) {
    console.error("Error getting user role:", e)
    return null
  }
}

export function getUserEmail(): string | null {
  try {
    const authData = localStorage.getItem("auth_user")
    if (authData) {
      const userData = JSON.parse(authData)
      return userData.email
    }
    return null
  } catch (e) {
    console.error("Error getting user email:", e)
    return null
  }
}

export function getUserId(): string | null {
  try {
    const authData = localStorage.getItem("auth_user")
    if (authData) {
      const userData = JSON.parse(authData)
      return userData.id
    }
    return null
  } catch (e) {
    console.error("Error getting user ID:", e)
    return null
  }
}

// Add the missing exports
export function getAuthData() {
  try {
    const authData = localStorage.getItem("auth_user")
    if (authData) {
      return JSON.parse(authData)
    }
    return null
  } catch (e) {
    console.error("Error getting auth data:", e)
    return null
  }
}

export function loginUser(userData: {
  id: string
  email: string
  role: UserRole
  name?: string
}): boolean {
  try {
    console.log("Storing auth data in localStorage:", userData)
    localStorage.setItem("auth_user", JSON.stringify(userData))
    return true
  } catch (e) {
    console.error("Error logging in user:", e)
    return false
  }
}

// Overload for backward compatibility
export function loginUserLegacy(email: string, role: UserRole): boolean {
  return loginUser({
    id: `manual-${Date.now()}`,
    email,
    role,
  })
}
