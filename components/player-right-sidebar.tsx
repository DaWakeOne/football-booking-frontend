"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { User, MessageSquare, Users, UserPlus, Calendar } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function PlayerRightSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Personal Information",
      href: "/profile",
      icon: User,
    },
    {
      title: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      title: "Friends",
      href: "/friends",
      icon: UserPlus,
    },
    {
      title: "Teams",
      href: "/teams",
      icon: Users,
    },
    {
      title: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
  ]

  return (
    <Sidebar side="right" variant="inset" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="p-2 text-center font-semibold">Player Tools</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
