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
          email: string
          nickname: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      records: {
        Row: {
          id: string
          user_id: string
          draw_number: number
          numbers: number[]
          created_at: string
          is_winner: boolean | null
          matched_count: number | null
        }
        Insert: {
          id?: string
          user_id: string
          draw_number: number
          numbers: number[]
          created_at?: string
          is_winner?: boolean | null
          matched_count?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          draw_number?: number
          numbers?: number[]
          created_at?: string
          is_winner?: boolean | null
          matched_count?: number | null
        }
      }
      winning_stores: {
        Row: {
          id: string
          draw_number: number
          rank: number
          store_name: string
          address: string
          type: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          draw_number: number
          rank: number
          store_name: string
          address: string
          type?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          draw_number?: number
          rank?: number
          store_name?: string
          address?: string
          type?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}