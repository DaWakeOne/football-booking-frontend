import { AuthCheck } from "@/components/auth-check"
import { BookingsList } from "@/components/bookings-list"

export default function BookingsPage() {
  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <BookingsList bookings={[]} />
      </div>
    </AuthCheck>
  )
}
