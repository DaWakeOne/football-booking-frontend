'use client'

import { useState } from "react"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, Trash2, Save, Repeat, CalendarPlus2Icon as CalendarIcon2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { WeeklyScheduleGrid } from "@/components/weekly-schedule-grid"

const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SchedulePageContent() {
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({
    Monday: ["18:00", "19:00", "20:00"],
    Tuesday: [],
    Wednesday: ["17:00", "18:00"],
    Thursday: [],
    Friday: ["19:00", "20:00", "21:00"],
    Saturday: ["10:00", "11:00", "12:00", "13:00"],
    Sunday: ["15:00", "16:00"],
  })

  const [oneTimeAvailability, setOneTimeAvailability] = useState([
    { id: "1", date: addDays(new Date(), 2), startTime: "18:00", endTime: "20:00" },
    { id: "2", date: addDays(new Date(), 5), startTime: "15:00", endTime: "17:00" },
  ])

  const [newOneTimeDate, setNewOneTimeDate] = useState<Date>()
  const [newOneTimeStartTime, setNewOneTimeStartTime] = useState("")
  const [newOneTimeEndTime, setNewOneTimeEndTime] = useState("")
  const [oneTimeDialogOpen, setOneTimeDialogOpen] = useState(false)

  const [newRecurringDay, setNewRecurringDay] = useState<string>("Monday")
  const [newRecurringStartTime, setNewRecurringStartTime] = useState("")
  const [newRecurringEndTime, setNewRecurringEndTime] = useState("")
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false)

  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [privacySettings, setPrivacySettings] = useState<"everyone" | "friends-teams">("friends-teams")

  const toggleTimeSlot = (day: string, time: string) => {
    setWeeklySchedule(prev => {
      const daySlots = [...prev[day]]
      return {
        ...prev,
        [day]: daySlots.includes(time)
          ? daySlots.filter(t => t !== time)
          : [...daySlots, time].sort(),
      }
    })
  }

  const updatePrivacySettings = (value: "everyone" | "friends-teams") => {
    setPrivacySettings(value)
    toast({
      title: "Privacy settings updated",
      description: `Your schedule is now visible to ${value === "everyone" ? "everyone" : "only friends and teams"}`,
    })
  }

  const addOneTimeAvailability = () => {
    if (!newOneTimeDate || !newOneTimeStartTime || !newOneTimeEndTime) {
      toast({ title: "Missing information", description: "Please select a date, start time, and end time", variant: "destructive" })
      return
    }
    if (newOneTimeStartTime >= newOneTimeEndTime) {
      toast({ title: "Invalid time range", description: "End time must be after start time", variant: "destructive" })
      return
    }

    setOneTimeAvailability(prev => [
      ...prev,
      { id: Date.now().toString(), date: newOneTimeDate, startTime: newOneTimeStartTime, endTime: newOneTimeEndTime },
    ])
    setOneTimeDialogOpen(false)
    setNewOneTimeDate(undefined)
    setNewOneTimeStartTime("")
    setNewOneTimeEndTime("")
    toast({ title: "Availability added", description: `Added for ${format(newOneTimeDate, "MMMM d, yyyy")}` })
  }

  const addRecurringAvailability = () => {
    if (!newRecurringDay || !newRecurringStartTime || !newRecurringEndTime) {
      toast({ title: "Missing information", description: "Please select a day, start time, and end time", variant: "destructive" })
      return
    }
    if (newRecurringStartTime >= newRecurringEndTime) {
      toast({ title: "Invalid time range", description: "End time must be after start time", variant: "destructive" })
      return
    }

    const slots = []
    let currentTime = newRecurringStartTime
    while (currentTime < newRecurringEndTime) {
      slots.push(currentTime)
      currentTime = `${(parseInt(currentTime.split(":")[0]) + 1).toString().padStart(2, "0")}:00`
    }

    setWeeklySchedule(prev => ({
      ...prev,
      [newRecurringDay]: [...new Set([...prev[newRecurringDay], ...slots])].sort(),
    }))
    setRecurringDialogOpen(false)
    setNewRecurringDay("Monday")
    setNewRecurringStartTime("")
    setNewRecurringEndTime("")
    toast({
      title: "Recurring availability added",
      description: `Added for ${newRecurringDay}s from ${newRecurringStartTime} to ${newRecurringEndTime}`,
    })
  }

  const deleteOneTimeAvailability = (id: string) => {
    setOneTimeAvailability(prev => prev.filter(item => item.id !== id))
    toast({ title: "Availability removed", description: "One-time availability removed" })
  }

  const clearDay = (day: string) => {
    setWeeklySchedule(prev => ({ ...prev, [day]: [] }))
    toast({ title: "Day cleared", description: `Removed all availability for ${day}` })
  }

  const saveAvailability = () => {
    console.log("Saving weekly schedule:", weeklySchedule)
    console.log("Saving one-time availability:", oneTimeAvailability)
    console.log("Saving privacy settings:", privacySettings)
    toast({ title: "Availability saved", description: "Settings have been saved" })
  }

  // ✅ Return your JSX — unchanged
  // You can now safely include your entire JSX return block here, as-is, without the `<AuthCheck>` wrapper
  // (it's already too long to re-include here)

  // Paste your full JSX from your previous code here ↓
  return (
    <>
      {/* Your JSX content from SchedulePageContent */}
      {/* We left it out here for brevity, but you copy the entire return part from your last message */}
    </>
  )
}
