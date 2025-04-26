"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { getAuthData } from "@/lib/auth-utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
    bio: "",
    preferredPosition: "",
    skillLevel: "intermediate",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Get user data
    const user = getAuthData()
    setUserData(user)

    // In a real app, you would fetch the profile data from the database
    // For now, we'll just simulate it with some default values
    setFormData({
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      bio: user?.bio || "",
      preferredPosition: user?.preferredPosition || "",
      skillLevel: user?.skillLevel || "intermediate",
    })

    setIsLoading(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate saving to database
    setTimeout(() => {
      // Update local user data
      const user = getAuthData()
      if (user) {
        const updatedUser = {
          ...user,
          ...formData,
        }

        // In a real app, you would save this to the database
        // For now, we'll just update the local state
        setUserData(updatedUser)

        // Show success message
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      }

      setIsSaving(false)
    }, 1000)
  }

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Personal Information</TabsTrigger>
              <TabsTrigger value="preferences">Player Preferences</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-lg">
                        {userData?.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{formData.fullName || userData?.email}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{userData?.role || "Player"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input value={userData?.email || ""} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter your city/location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us a bit about yourself"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Player Preferences</CardTitle>
                  <CardDescription>Set your playing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredPosition">Preferred Position</Label>
                      <Input
                        id="preferredPosition"
                        name="preferredPosition"
                        value={formData.preferredPosition}
                        onChange={handleInputChange}
                        placeholder="e.g. Striker, Goalkeeper, Midfielder"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skillLevel">Skill Level</Label>
                      <select
                        id="skillLevel"
                        name="skillLevel"
                        value={formData.skillLevel}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Weekday Mornings", "Weekday Evenings", "Weekend Mornings", "Weekend Evenings"].map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={time.replace(/\s+/g, "")}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={time.replace(/\s+/g, "")} className="text-sm font-normal">
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Change Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        <Toaster />
      </div>
    </AuthCheck>
  )
}
