"use client"

import { useState } from "react"
import { AuthCheck } from "@/components/auth-check"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserPlus, UserMinus, MessageSquare, Search } from "lucide-react"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for friends and requests
  const friends = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "online" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "offline" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", status: "online" },
  ]

  const friendRequests = [
    { id: "4", name: "Sarah Williams", email: "sarah@example.com" },
    { id: "5", name: "David Brown", email: "david@example.com" },
  ]

  const searchResults = [
    { id: "6", name: "Alex Turner", email: "alex@example.com" },
    { id: "7", name: "Emma Wilson", email: "emma@example.com" },
  ]

  const filteredFriends = searchQuery
    ? friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Friends</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Friends ({friends.length})</TabsTrigger>
                  <TabsTrigger value="online">
                    Online ({friends.filter((f) => f.status === "online").length})
                  </TabsTrigger>
                  <TabsTrigger value="requests">Requests ({friendRequests.length})</TabsTrigger>
                </TabsList>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search friends..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <TabsContent value="all">
                {filteredFriends.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFriends.map((friend) => (
                      <Card key={friend.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{friend.name}</h3>
                                <p className="text-sm text-muted-foreground">{friend.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={friend.status === "online" ? "default" : "secondary"}>
                                {friend.status === "online" ? "Online" : "Offline"}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No friends found matching your search.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="online">
                {filteredFriends.filter((f) => f.status === "online").length > 0 ? (
                  <div className="space-y-4">
                    {filteredFriends
                      .filter((f) => f.status === "online")
                      .map((friend) => (
                        <Card key={friend.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{friend.name}</h3>
                                  <p className="text-sm text-muted-foreground">{friend.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge>Online</Badge>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No online friends at the moment.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="requests">
                {friendRequests.length > 0 ? (
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{request.name}</h3>
                                <p className="text-sm text-muted-foreground">{request.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm">Accept</Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No pending friend requests.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Find Friends</CardTitle>
                <CardDescription>Search for players to add as friends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search players..." className="pl-8" />
                </div>

                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="flex justify-between items-center p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{result.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{result.name}</h4>
                          <p className="text-xs text-muted-foreground">{result.email}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View More Players</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
