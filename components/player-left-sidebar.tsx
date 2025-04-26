"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Landmark, Tag } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function PlayerLeftSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Fields",
      href: "/fields",
      icon: Landmark,
    },
    {
      title: "Offers",
      href: "/offers",
      icon: Tag,
    },
  ]

  return (
    <Sidebar side="left" variant="inset" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="p-2 text-center font-semibold">Player Menu</div>
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
