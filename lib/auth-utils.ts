"use client"

import type { UserRole } from "@/lib/database.types"

export function isAuthenticated(): boolean {
  try {
    const authUser = localStorage.getItem("auth_user")
    return !!authUser
  } catch (e) {
    console.error("Error checking authentication:", e)
    return false
  }
}

export function getUserRole(): UserRole | null {
  try {
    const authUser = localStorage.getItem("auth_user")
    if (authUser) {
      const userData = JSON.parse(authUser)
      return userData.role as UserRole
    }
    return null
  } catch (e) {
    console.error("Error getting user role:", e)
    return null
  }
}

export function getUserId(): string | null {
  try {
    const authUser = localStorage.getItem("auth_user")
    if (authUser) {
      const userData = JSON.parse(authUser)
      return userData.id
    }
    return null
  } catch (e) {
    console.error("Error getting user ID:", e)
    return null
  }
}

export function getUserEmail(): string | null {
  try {
    const authUser = localStorage.getItem("auth_user")
    if (authUser) {
      const userData = JSON.parse(authUser)
      return userData.email
    }
    return null
  } catch (e) {
    console.error("Error getting user email:", e)
    return null
  }
}
