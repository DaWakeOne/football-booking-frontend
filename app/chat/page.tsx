"use client"

import { useState } from "react"
import { AuthCheck } from "@/components/auth-check"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone, Video, MoreHorizontal } from "lucide-react"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState("1")
  const [messageText, setMessageText] = useState("")

  // Mock data for chats
  const chats = [
    {
      id: "1",
      name: "John Doe",
      status: "online",
      lastMessage: "Are you coming to the game tomorrow?",
      unread: 2,
      lastActive: "5m ago",
    },
    {
      id: "2",
      name: "Football Team",
      status: "group",
      lastMessage: "Coach: Practice at 6pm today",
      unread: 0,
      lastActive: "1h ago",
      participants: 8,
    },
    {
      id: "3",
      name: "Jane Smith",
      status: "offline",
      lastMessage: "Let me know when you're free",
      unread: 0,
      lastActive: "2h ago",
    },
  ]

  // Mock data for messages
  const messages = [
    {
      id: "1",
      sender: "John Doe",
      senderId: "1",
      text: "Hey, are you coming to the game tomorrow?",
      time: "10:30 AM",
      isMine: false,
    },
    {
      id: "2",
      sender: "You",
      senderId: "current",
      text: "Yes, I'll be there! What time does it start?",
      time: "10:32 AM",
      isMine: true,
    },
    {
      id: "3",
      sender: "John Doe",
      senderId: "1",
      text: "Great! It starts at 3 PM. Don't forget to bring your gear.",
      time: "10:33 AM",
      isMine: false,
    },
    {
      id: "4",
      sender: "You",
      senderId: "current",
      text: "Got it. Should I bring anything else?",
      time: "10:35 AM",
      isMine: true,
    },
    {
      id: "5",
      sender: "John Doe",
      senderId: "1",
      text: "Just water and maybe some snacks for after the game.",
      time: "10:36 AM",
      isMine: false,
    },
    {
      id: "6",
      sender: "John Doe",
      senderId: "1",
      text: "Also, we might go for drinks afterward if you're interested.",
      time: "10:37 AM",
      isMine: false,
    },
  ]

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    // In a real app, you would send the message to the server
    console.log("Sending message:", messageText)

    // Clear the input
    setMessageText("")
  }

  return (
    <AuthCheck requiredRole="player">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(80vh-100px)]">
          {/* Chat list */}
          <div className="md:col-span-1 border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search conversations..." className="pl-8" />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(80vh-200px)]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedChat === chat.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {chat.status === "online" && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.lastActive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && <Badge className="ml-2">{chat.unread}</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat content */}
          <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
            {selectedChatData ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedChatData.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedChatData.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedChatData.status === "online"
                          ? "Online"
                          : selectedChatData.status === "group"
                            ? `${selectedChatData.participants} participants`
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] ${message.isMine ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{message.sender}</span>
                          <span className="text-xs opacity-70">{message.time}</span>
                        </div>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-medium text-lg">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a chat from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
