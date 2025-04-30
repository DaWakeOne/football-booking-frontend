"use client"
import { cn } from "@/lib/utils"

interface WeeklyScheduleGridProps {
  schedule: Record<string, string[]>
  onToggleTimeSlot: (day: string, time: string) => void
}

export function WeeklyScheduleGrid({ schedule, onToggleTimeSlot }: WeeklyScheduleGridProps) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-1">
          {/* Header - Empty cell for the corner */}
          <div className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-tl-md"></div>

          {/* Header - Days of the week */}
          {daysOfWeek.map((day) => (
            <div key={day} className="h-12 flex items-center justify-center font-medium bg-muted/50">
              {day}
            </div>
          ))}

          {/* Time slots and availability grid */}
          {timeSlots.map((time) => (
            <>
              {/* Time label */}
              <div
                key={`time-${time}`}
                className="h-10 flex items-center justify-center text-sm text-muted-foreground bg-muted/30"
              >
                {time}
              </div>

              {/* Availability cells for each day */}
              {daysOfWeek.map((day) => {
                const isAvailable = schedule[day]?.includes(time)
                return (
                  <div
                    key={`${day}-${time}`}
                    className={cn(
                      "h-10 border border-gray-200 rounded-sm cursor-pointer transition-colors",
                      isAvailable ? "bg-primary/20 hover:bg-primary/30" : "bg-transparent hover:bg-muted/20",
                    )}
                    onClick={() => onToggleTimeSlot(day, time)}
                  />
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
