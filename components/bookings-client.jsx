"use client"

import { useEffect, useState } from "react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"

export default function BookingsClient() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        const { data, error } = await supabase.from("bookings").select("*").eq("user_id", session.user.id)

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [session, supabase])

  if (!session) {
    return (
      <div className="p-4 text-center">
        <p>Please log in to view your bookings</p>
        <a href="/login" className="text-blue-500 underline">
          Log in
        </a>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg">
              <p>
                <strong>Field:</strong> {booking.field_id}
              </p>
              <p>
                <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>You don't have any bookings yet.</p>
      )}
    </div>
  )
}
