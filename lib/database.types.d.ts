export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      fields: {
        Row: {
          id: string
          name: string
          location: string
          description: string | null
          image_url: string | null
          price_per_hour: number
          field_size: string | null
          surface_type: string
          field_type: string
          open_time: string | null
          close_time: string | null
          contact_phone: string | null
          contact_email: string | null
          owner_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          description?: string | null
          image_url?: string | null
          price_per_hour: number
          field_size?: string | null
          surface_type: string
          field_type: string
          open_time?: string | null
          close_time?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          owner_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          description?: string | null
          image_url?: string | null
          price_per_hour?: number
          field_size?: string | null
          surface_type?: string
          field_type?: string
          open_time?: string | null
          close_time?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          owner_id?: string
          created_at?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}
