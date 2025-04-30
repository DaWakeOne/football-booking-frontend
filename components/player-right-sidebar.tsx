"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

export function PlayerRightSidebar() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Team Practice",
      message: "Team practice scheduled for tomorrow at 6 PM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Friend Request",
      message: "John Doe sent you a friend request",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Field Booking",
      message: "Your booking at Central Stadium is confirmed",
      time: "2 days ago",
      read: true,
    },
  ])

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Team Practice",
      location: "Central Stadium",
      time: "Tomorrow, 6:00 PM",
    },
    {
      id: 2,
      title: "Friendly Match",
      location: "Community Field",
      time: "Saturday, 3:00 PM",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-80 lg:border-l lg:border-gray-200 bg-white">
      <div className="h-full px-4 py-6 overflow-y-auto">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {unreadCount} new
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    notification.read ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-500"
                  }`}
                >
                  <div className="font-medium">{notification.title}</div>
                  <p className="text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No notifications</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="text-muted-foreground">{event.location}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
