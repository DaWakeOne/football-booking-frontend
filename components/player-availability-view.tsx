"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format, addDays } from "date-fns"
import { Calendar, Clock, Users, UserX, Lock, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlayerAvailabilityViewProps {
  playerId: string
  playerName: string
  isFriend: boolean
  isTeammate: boolean
}

export function PlayerAvailabilityView({ playerId, playerName, isFriend, isTeammate }: PlayerAvailabilityViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [privacySettings, setPrivacySettings] = useState<"everyone" | "friends-teams">("friends-teams")
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, string[]>>({})
  const [oneTimeAvailability, setOneTimeAvailability] = useState<
    Array<{
      id: string
      date: Date
      startTime: string
      endTime: string
    }>
  >([])

  // Check if the current user has access to view this player's schedule
  const hasAccess = privacySettings === "everyone" || isFriend || isTeammate

  useEffect(() => {
    // Simulate fetching player availability data
    const fetchPlayerAvailability = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch this data from your API
        // For demo purposes, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setPrivacySettings("friends-teams")
        setWeeklySchedule({
          Monday: ["18:00", "19:00", "20:00"],
          Tuesday: [],
          Wednesday: ["17:00", "18:00"],
          Thursday: [],
          Friday: ["19:00", "20:00", "21:00"],
          Saturday: ["10:00", "11:00", "12:00", "13:00"],
          Sunday: ["15:00", "16:00"],
        })
        setOneTimeAvailability([
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

        setIsLoading(false)
      } catch (err) {
        setError("Failed to load player availability")
        setIsLoading(false)
      }
    }

    fetchPlayerAvailability()
  }, [playerId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading player availability...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            {playerName}'s Availability
          </CardTitle>
          <CardDescription>This player's schedule is private</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <UserX className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Private Schedule</h3>
          <p className="text-muted-foreground mt-2">
            {playerName} only shares their availability with friends and teammates.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{playerName}'s Availability</CardTitle>
        <CardDescription>
          When this player is available to join games
          {privacySettings === "friends-teams" && (
            <Badge variant="outline" className="ml-2">
              <Users className="mr-1 h-3 w-3" />
              Shared with friends & teams
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="one-time">One-time Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="space-y-4">
              {Object.entries(weeklySchedule).map(([day, times]) => (
                <div key={day} className="border-b pb-3 last:border-0">
                  <h3 className="font-medium">{day}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {times.length > 0 ? (
                      times.map((time) => (
                        <Badge key={`${day}-${time}`} variant="outline">
                          {time}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="one-time">
            {oneTimeAvailability.length > 0 ? (
              <div className="space-y-4">
                {oneTimeAvailability.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-3 last:border-0">
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
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No one-time availability set</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
