export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          price: number
          image: string
          type: string
          seats: number
          transmission: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          price: number
          image: string
          type: string
          seats: number
          transmission: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          price?: number
          image?: string
          type?: string
          seats?: number
          transmission?: string
          available?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          car_id: string
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          car_id: string
          user_id: string
          start_date: string
          end_date: string
          total_price: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          total_price?: number
          status?: string
          created_at?: string
        }
      }
    }
  }
}