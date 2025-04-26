"use client"

import { useState } from "react"
import { AuthCheck } from "@/components/auth-check"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Calendar, Trophy, Settings } from "lucide-react"

export default function TeamsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")

  // Mock data for teams
  const myTeams = [
    {
      id: "1",
      name: "City Strikers",
      role: "Captain",
      members: 12,
      nextGame: "Tomorrow, 3 PM",
      location: "Central Stadium",
    },
    {
      id: "2",
      name: "Weekend Warriors",
      role: "Member",
      members: 8,
      nextGame: "Saturday, 5 PM",
      location: "Community Field",
    },
  ]

  const teamInvites = [
    {
      id: "3",
      name: "Local United",
      invitedBy: "Mike Johnson",
      members: 15,
    },
  ]

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return

    // In a real app, you would send the team data to the server
    console.log("Creating team:", { name: newTeamName, description: newTeamDescription })

    // Close the dialog and reset form
    setCreateDialogOpen(false)
    setNewTeamName("")
    setNewTeamDescription("")
  }

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teams</h1>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
                <DialogDescription>Create your own team and invite other players to join.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Describe your team"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="my-teams">
          <TabsList className="mb-6">
            <TabsTrigger value="my-teams">My Teams ({myTeams.length})</TabsTrigger>
            <TabsTrigger value="invites">Invites ({teamInvites.length})</TabsTrigger>
            <TabsTrigger value="discover">Discover Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="my-teams">
            {myTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{team.name}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mt-1">
                              {team.role}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Avatar>
                          <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{team.members} members</span>
                        </div>
                        {team.nextGame && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Next game: {team.nextGame}</span>
                          </div>
                        )}
                        {team.location && (
                          <div className="flex items-center text-sm">
                            <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{team.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Team
                      </Button>
                      {team.role === "Captain" && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">You're not in any teams yet</h3>
                  <p className="text-muted-foreground mb-4">Create your own team or join an existing one</p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="invites">
            {teamInvites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamInvites.map((invite) => (
                  <Card key={invite.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{invite.name}</CardTitle>
                          <CardDescription>Invited by {invite.invitedBy}</CardDescription>
                        </div>
                        <Avatar>
                          <AvatarFallback>{invite.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{invite.members} members</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button size="sm">Accept</Button>
                      <Button variant="outline" size="sm">
                        Decline
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium">No team invites</h3>
                  <p className="text-muted-foreground">You don't have any pending team invitations</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="discover">
            <Card>
              <CardHeader>
                <CardTitle>Discover Teams</CardTitle>
                <CardDescription>Find teams in your area to join</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Search teams by name or location..." />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {[
                      { id: "4", name: "FC Downtown", location: "Central Stadium", members: 18 },
                      { id: "5", name: "Riverside FC", location: "Riverside Park", members: 14 },
                      { id: "6", name: "Eastside United", location: "Community Field", members: 12 },
                      { id: "7", name: "Westside Warriors", location: "Sports Complex", members: 16 },
                    ].map((team) => (
                      <div key={team.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.location}</p>
                            <div className="flex items-center text-xs mt-1">
                              <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{team.members} members</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Request to Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View More Teams</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthCheck>
  )
}
