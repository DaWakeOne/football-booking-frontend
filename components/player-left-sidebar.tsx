"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MessageSquare, UserPlus, Tag, BookOpen } from "lucide-react"

export function PlayerLeftSidebar() {
  const pathname = usePathname()

  const links = [
    {
      href: "/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: "/friends",
      label: "Friends",
      icon: UserPlus,
    },
    {
      href: "/teams",
      label: "Teams",
      icon: Users,
    },
    {
      href: "/chat",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      href: "/bookings",
      label: "Bookings",
      icon: BookOpen,
    },
    {
      href: "/offers",
      label: "Offers",
      icon: Tag,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
        <div className="space-y-1">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
