"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider.tsx"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

interface BookingsListProps {
  bookings: any[]
}

export function BookingsList({ bookings }: BookingsListProps) {
  const { supabase } = useAuth()
  const router = useRouter()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const upcomingBookings = bookings.filter(
    (booking) => new Date(`${booking.booking_date}T${booking.end_time}`) >= new Date(),
  )

  const pastBookings = bookings.filter(
    (booking) => new Date(`${booking.booking_date}T${booking.end_time}`) < new Date(),
  )

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId)

    const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

    setCancellingId(null)

    if (error) {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking cancelled",
      description: "Your booking has been successfully cancelled.",
    })

    router.refresh()
  }

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.fields.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{booking.fields.location}</span>
            </div>
          </div>
          <Badge>{booking.fields.surface_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{format(parseISO(booking.booking_date), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>
              {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-semibold">
            Total: $
            {(
              Number.parseFloat(booking.fields.price_per_hour) *
              (Number.parseInt(booking.end_time.split(":")[0]) - Number.parseInt(booking.start_time.split(":")[0]))
            ).toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          <Button asChild variant="outline">
            <Link href={`/fields/${booking.fields.id}`}>View Field</Link>
          </Button>

          {new Date(`${booking.booking_date}T${booking.start_time}`) > new Date() && (
            <Button
              variant="destructive"
              onClick={() => handleCancelBooking(booking.id)}
              disabled={cancellingId === booking.id}
            >
              {cancellingId === booking.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(renderBookingCard)
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium">No upcoming bookings</h3>
              <p className="text-muted-foreground mt-2">You don't have any upcoming bookings.</p>
              <Button asChild className="mt-4">
                <Link href="/fields">Browse Fields</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="text-lg font-medium">No past bookings</h3>
              <p className="text-muted-foreground mt-2">You don't have any past bookings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
