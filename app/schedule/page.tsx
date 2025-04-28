import { PlayerLayoutWrapper } from "@/components/player-layout-wrapper"
;("use client")

import { useState } from "react"
import { AuthCheck } from "@/components/auth-check"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, Trash2, Save, Repeat, CalendarPlus2Icon as CalendarIcon2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { WeeklyScheduleGrid } from "@/components/weekly-schedule-grid"

// Time slot options for the schedule
const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function SchedulePageContent() {
  // State for the weekly recurring schedule
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({
    Monday: ["18:00", "19:00", "20:00"],
    Tuesday: [],
    Wednesday: ["17:00", "18:00"],
    Thursday: [],
    Friday: ["19:00", "20:00", "21:00"],
    Saturday: ["10:00", "11:00", "12:00", "13:00"],
    Sunday: ["15:00", "16:00"],
  })

  // State for one-time availability
  const [oneTimeAvailability, setOneTimeAvailability] = useState<
    Array<{
      id: string
      date: Date
      startTime: string
      endTime: string
    }>
  >([
    {
      id: "1",
      date: addDays(new Date(), 2),
      startTime: "18:00",
      endTime: "20:00",
    },
    {
      id: "2",
      date: addDays(new Date(), 5),
      startTime: "15:00",
      endTime: "17:00",
    },
  ])

  // State for the new one-time availability dialog
  const [newOneTimeDate, setNewOneTimeDate] = useState<Date | undefined>(undefined)
  const [newOneTimeStartTime, setNewOneTimeStartTime] = useState("")
  const [newOneTimeEndTime, setNewOneTimeEndTime] = useState("")
  const [oneTimeDialogOpen, setOneTimeDialogOpen] = useState(false)

  // State for the new recurring availability dialog
  const [newRecurringDay, setNewRecurringDay] = useState<string>("Monday")
  const [newRecurringStartTime, setNewRecurringStartTime] = useState("")
  const [newRecurringEndTime, setNewRecurringEndTime] = useState("")
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false)

  // State for the view mode
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")

  // State for privacy settings
  const [privacySettings, setPrivacySettings] = useState<"everyone" | "friends-teams">("friends-teams")

  // Toggle a time slot for a specific day in the weekly schedule
  const toggleTimeSlot = (day: string, time: string) => {
    setWeeklySchedule((prev) => {
      const daySlots = [...prev[day]]
      if (daySlots.includes(time)) {
        return {
          ...prev,
          [day]: daySlots.filter((t) => t !== time),
        }
      } else {
        return {
          ...prev,
          [day]: [...daySlots, time].sort(),
        }
      }
    })
  }

  // Update privacy settings
  const updatePrivacySettings = (value: "everyone" | "friends-teams") => {
    setPrivacySettings(value)
    toast({
      title: "Privacy settings updated",
      description: `Your schedule is now visible to ${value === "everyone" ? "everyone" : "only friends and teams"}`,
    })
  }

  // Add a new one-time availability
  const addOneTimeAvailability = () => {
    if (!newOneTimeDate || !newOneTimeStartTime || !newOneTimeEndTime) {
      toast({
        title: "Missing information",
        description: "Please select a date, start time, and end time",
        variant: "destructive",
      })
      return
    }

    if (newOneTimeStartTime >= newOneTimeEndTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    const newAvailability = {
      id: Date.now().toString(),
      date: newOneTimeDate,
      startTime: newOneTimeStartTime,
      endTime: newOneTimeEndTime,
    }

    setOneTimeAvailability((prev) => [...prev, newAvailability])
    setOneTimeDialogOpen(false)

    // Reset form
    setNewOneTimeDate(undefined)
    setNewOneTimeStartTime("")
    setNewOneTimeEndTime("")

    toast({
      title: "Availability added",
      description: `Added availability for ${format(newOneTimeDate, "MMMM d, yyyy")}`,
    })
  }

  // Add a new recurring availability
  const addRecurringAvailability = () => {
    if (!newRecurringDay || !newRecurringStartTime || !newRecurringEndTime) {
      toast({
        title: "Missing information",
        description: "Please select a day, start time, and end time",
        variant: "destructive",
      })
      return
    }

    if (newRecurringStartTime >= newRecurringEndTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    // Generate all time slots between start and end time
    const slots = []
    let currentTime = newRecurringStartTime
    while (currentTime < newRecurringEndTime) {
      slots.push(currentTime)
      // Get the next hour
      const hour = Number.parseInt(currentTime.split(":")[0])
      currentTime = `${(hour + 1).toString().padStart(2, "0")}:00`
    }

    setWeeklySchedule((prev) => ({
      ...prev,
      [newRecurringDay]: [...new Set([...prev[newRecurringDay], ...slots])].sort(),
    }))

    setRecurringDialogOpen(false)

    // Reset form
    setNewRecurringDay("Monday")
    setNewRecurringStartTime("")
    setNewRecurringEndTime("")

    toast({
      title: "Recurring availability added",
      description: `Added availability for ${newRecurringDay}s from ${newRecurringStartTime} to ${newRecurringEndTime}`,
    })
  }

  // Delete a one-time availability
  const deleteOneTimeAvailability = (id: string) => {
    setOneTimeAvailability((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Availability removed",
      description: "The one-time availability has been removed",
    })
  }

  // Clear all time slots for a specific day
  const clearDay = (day: string) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: [],
    }))
    toast({
      title: "Day cleared",
      description: `Removed all availability for ${day}`,
    })
  }

  // Save all availability settings
  const saveAvailability = () => {
    // In a real app, you would send this data to your backend
    console.log("Saving weekly schedule:", weeklySchedule)
    console.log("Saving one-time availability:", oneTimeAvailability)
    console.log("Saving privacy settings:", privacySettings)

    toast({
      title: "Availability saved",
      description: "Your availability settings have been saved",
    })
  }

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Availability</h1>
          <Button onClick={saveAvailability}>
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control who can see your availability schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="everyone"
                  name="privacy"
                  className="h-4 w-4 rounded-full border-gray-300"
                  checked={privacySettings === "everyone"}
                  onChange={() => updatePrivacySettings("everyone")}
                />
                <Label htmlFor="everyone" className="font-normal">
                  Available to everyone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="friends-teams"
                  name="privacy"
                  className="h-4 w-4 rounded-full border-gray-300"
                  checked={privacySettings === "friends-teams"}
                  onChange={() => updatePrivacySettings("friends-teams")}
                />
                <Label htmlFor="friends-teams" className="font-normal">
                  Available only for friends and teams I am part of
                </Label>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {privacySettings === "everyone"
                  ? "Anyone can see when you're available and invite you to games."
                  : "Only your friends and teammates can see when you're available and invite you to games."}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weekly">
          <TabsList className="mb-6">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="one-time">One-time Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Weekly Recurring Availability</CardTitle>
                    <CardDescription>Set your regular weekly availability for games</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-none"
                      >
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-none"
                      >
                        List
                      </Button>
                    </div>
                    <Dialog open={recurringDialogOpen} onOpenChange={setRecurringDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Time Block
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Recurring Availability</DialogTitle>
                          <DialogDescription>Add a recurring time block to your weekly schedule</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="day">Day of Week</Label>
                            <Select value={newRecurringDay} onValueChange={setNewRecurringDay}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.map((day) => (
                                  <SelectItem key={day} value={day}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="start-time">Start Time</Label>
                              <Select value={newRecurringStartTime} onValueChange={setNewRecurringStartTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={`start-${time}`} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="end-time">End Time</Label>
                              <Select value={newRecurringEndTime} onValueChange={setNewRecurringEndTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map((time) => (
                                    <SelectItem key={`end-${time}`} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setRecurringDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addRecurringAvailability}>Add to Schedule</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <WeeklyScheduleGrid schedule={weeklySchedule} onToggleTimeSlot={toggleTimeSlot} />
                ) : (
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-muted/50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Day
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Available Hours
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-background divide-y divide-gray-200">
                            {daysOfWeek.map((day) => (
                              <tr key={day}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{day}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="flex flex-wrap gap-2">
                                    {weeklySchedule[day].length > 0 ? (
                                      weeklySchedule[day].map((time) => (
                                        <Badge
                                          key={`${day}-${time}`}
                                          variant="outline"
                                          className="cursor-pointer"
                                          onClick={() => toggleTimeSlot(day, time)}
                                        >
                                          {time}
                                          <Trash2 className="ml-1 h-3 w-3 text-muted-foreground hover:text-destructive" />
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">No availability set</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => clearDay(day)}
                                    disabled={weeklySchedule[day].length === 0}
                                  >
                                    Clear Day
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <Repeat className="inline-block mr-1 h-4 w-4" />
                  These hours repeat every week
                </div>
                <Button onClick={saveAvailability}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="one-time">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>One-time Availability</CardTitle>
                    <CardDescription>Set specific dates when you're available to play</CardDescription>
                  </div>
                  <Dialog open={oneTimeDialogOpen} onOpenChange={setOneTimeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Date
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add One-time Availability</DialogTitle>
                        <DialogDescription>
                          Add a specific date and time when you're available to play
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newOneTimeDate ? format(newOneTimeDate, "PPP") : "Select a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newOneTimeDate}
                                onSelect={setNewOneTimeDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Select value={newOneTimeStartTime} onValueChange={setNewOneTimeStartTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={`one-time-start-${time}`} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Select value={newOneTimeEndTime} onValueChange={setNewOneTimeEndTime}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={`one-time-end-${time}`} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOneTimeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addOneTimeAvailability}>Add Availability</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {oneTimeAvailability.length > 0 ? (
                  <div className="space-y-4">
                    {oneTimeAvailability.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 rounded-md p-2 text-center min-w-[60px]">
                                <div className="text-xs font-medium">{format(item.date, "EEE")}</div>
                                <div className="text-lg font-bold">{format(item.date, "d")}</div>
                                <div className="text-xs">{format(item.date, "MMM")}</div>
                              </div>
                              <div>
                                <h3 className="font-medium">{format(item.date, "MMMM d, yyyy")}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Clock className="mr-1 h-4 w-4" />
                                  <span>
                                    {item.startTime} - {item.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => deleteOneTimeAvailability(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-lg">
                    <CalendarIcon2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No one-time availability set</h3>
                    <p className="text-muted-foreground mt-2">Add specific dates when you're available to play</p>
                    <Button className="mt-4" onClick={() => setOneTimeDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Availability
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  <CalendarIcon className="inline-block mr-1 h-4 w-4" />
                  These are one-time availability slots
                </div>
                <Button onClick={saveAvailability}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Toaster />
      </div>
    </AuthCheck>
  )
}

export default function SchedulePage() {
  return (
    <PlayerLayoutWrapper>
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <SchedulePageContent />
    </PlayerLayoutWrapper>
  )
}
