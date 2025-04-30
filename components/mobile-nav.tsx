"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-4">
          <Link href="/" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/fields" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Fields
          </Link>
          <Link href="/about" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/contact" className="text-lg font-medium hover:underline" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <div className="border-t pt-4 mt-4">
            <Link
              href="/login"
              className="block w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block w-full py-2 text-center bg-gray-100 text-gray-900 rounded-md mt-2 hover:bg-gray-200"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
