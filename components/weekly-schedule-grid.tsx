"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface WeeklyScheduleGridProps {
  schedule: Record<string, string[]>
  onToggleTimeSlot: (day: string, time: string) => void
}

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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function WeeklyScheduleGrid({ schedule, onToggleTimeSlot }: WeeklyScheduleGridProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-1">
              {/* Header row with days */}
              <div className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-md"></div>
              {daysOfWeek.map((day) => (
                <div key={day} className="h-12 flex items-center justify-center font-medium bg-muted/50 rounded-md">
                  {day.substring(0, 3)}
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((time) => (
                <>
                  <div
                    key={`time-${time}`}
                    className="h-10 flex items-center justify-center text-sm text-muted-foreground"
                  >
                    {time}
                  </div>
                  {daysOfWeek.map((day) => (
                    <div
                      key={`${day}-${time}`}
                      className={cn(
                        "h-10 rounded-md border border-dashed flex items-center justify-center cursor-pointer transition-colors",
                        schedule[day].includes(time)
                          ? "bg-primary/20 border-primary hover:bg-primary/30"
                          : "border-muted hover:bg-muted/50",
                      )}
                      onClick={() => onToggleTimeSlot(day, time)}
                    >
                      {schedule[day].includes(time) && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
