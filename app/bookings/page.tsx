import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"
import { BookingsList } from "@/components/bookings-list"

export default function BookingsPage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <BookingsList />
    </PlayerLayoutWrapper>
  )
}
