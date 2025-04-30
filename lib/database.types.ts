export type UserRole = "player" | "owner" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  created_at?: string
}

export interface Field {
  id: string
  name: string
  location: string
  description?: string
  image_url?: string
  price_per_hour: number
  field_size?: string
  surface_type: string
  field_type: "open" | "closed"
  open_time?: string
  close_time?: string
  contact_phone?: string
  contact_email?: string
  owner_id: string
  created_at?: string
}

export interface Booking {
  id: string
  field_id: string
  user_id: string
  start_time: string
  end_time: string
  status: "pending" | "confirmed" | "cancelled"
  created_at?: string
}

export interface Team {
  id: string
  name: string
  logo_url?: string
  created_by: string
  created_at?: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: "member" | "admin"
  joined_at?: string
}

export interface Offer {
  id: string
  created_by: string
  date: string
  players_needed: number
  field_id?: string
  message?: string
  status: "open" | "closed"
  created_at?: string
}

export interface OfferApplication {
  id: string
  offer_id: string
  user_id: string
  status: "pending" | "accepted" | "rejected"
  created_at?: string
}

export interface Friendship {
  id: string
  user_id: string
  friend_id: string
  status: "pending" | "accepted" | "rejected"
  created_at?: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id?: string
  team_id?: string
  content: string
  created_at?: string
}

export interface PlayerAvailability {
  id: string
  user_id: string
  day_of_week?: number
  specific_date?: string
  start_time: string
  end_time: string
  recurring: boolean
  created_at?: string
}

export interface PlayerProfile {
  id: string
  user_id: string
  about?: string
  skill_level?: "beginner" | "intermediate" | "skilled" | "professional"
  phone?: string
  availability_privacy: "everyone" | "friends-teams" | "private"
  created_at?: string
}

export interface OwnerProfile {
  id: string
  user_id: string
  about?: string
  phone?: string
  created_at?: string
}
