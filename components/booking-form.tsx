"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import type { Field, NewBooking } from "@/lib/database.types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addHours, parse, isAfter, isBefore, startOfToday } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface BookingFormProps {
  field: Field
}

export function BookingForm({ field }: BookingFormProps) {
  const { user, userRole, supabase } = useAuth()
  const router = useRouter()

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate available time slots based on field's open/close times
  const generateTimeSlots = () => {
    const slots = []
    const openTime = parse(field.open_time, "HH:mm:ss", new Date())
    const closeTime = parse(field.close_time, "HH:mm:ss", new Date())

    let currentTime = openTime
    while (isBefore(currentTime, closeTime)) {
      slots.push(format(currentTime, "HH:mm"))
      currentTime = addHours(currentTime, 1)
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a field",
        variant: "destructive",
      })
      router.push("/login/player")
      return
    }

    if (userRole !== "player") {
      toast({
        title: "Not authorized",
        description: "Only players can book fields",
        variant: "destructive",
      })
      return
    }

    if (!date || !startTime || !endTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const booking: NewBooking = {
      field_id: field.id,
      user_id: user.id,
      booking_date: format(date, "yyyy-MM-dd"),
      start_time: startTime,
      end_time: endTime,
    }

    // Check for existing bookings
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("*")
      .eq("field_id", field.id)
      .eq("booking_date", booking.booking_date)
      .or(`start_time.lte.${booking.end_time},end_time.gte.${booking.start_time}`)

    if (checkError) {
      toast({
        title: "Error checking availability",
        description: checkError.message,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (existingBookings && existingBookings.length > 0) {
      toast({
        title: "Time slot not available",
        description: "This time slot is already booked. Please select another time.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create booking
    const { error } = await supabase.from("bookings").insert(booking)

    setIsSubmitting(false)

    if (error) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Booking confirmed!",
      description: `You've successfully booked ${field.name} on ${format(date, "MMMM d, yyyy")} from ${startTime} to ${endTime}.`,
    })

    // Reset form
    setDate(undefined)
    setStartTime("")
    setEndTime("")

    // Refresh the page to show updated availability
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Slot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={
                    (date) => isBefore(date, startOfToday()) || isAfter(date, addHours(new Date(), 24 * 30)) // Allow booking up to 30 days in advance
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Select
                value={startTime}
                onValueChange={(value) => {
                  setStartTime(value)
                  // Auto-select end time 1 hour later if possible
                  const index = timeSlots.indexOf(value)
                  if (index < timeSlots.length - 1) {
                    setEndTime(timeSlots[index + 1])
                  }
                }}
              >
                <SelectTrigger id="start-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(0, -1).map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime} disabled={!startTime}>
                <SelectTrigger id="end-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {startTime &&
                    timeSlots
                      .filter((time) => time > startTime)
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {startTime && endTime && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Price per hour:</span>
                <span>${field.price_per_hour}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total:</span>
                <span>
                  $
                  {(
                    Number.parseFloat(field.price_per_hour.toString()) *
                    (Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0]))
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!date || !startTime || !endTime || isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </CardFooter>
      <Toaster />
    </Card>
  )
}
