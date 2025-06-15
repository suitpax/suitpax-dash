import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company: string | null
          plan: "free" | "pro" | "enterprise"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          company?: string | null
          plan?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company?: string | null
          plan?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: "low" | "medium" | "high"
          status: "pending" | "in_progress" | "completed"
          category: "travel" | "expense" | "meeting" | "general"
          assignee: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          status?: "pending" | "in_progress" | "completed"
          category?: "travel" | "expense" | "meeting" | "general"
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          status?: "pending" | "in_progress" | "completed"
          category?: "travel" | "expense" | "meeting" | "general"
          assignee?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          currency: string
          category: string
          date: string
          receipt_url: string | null
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          currency?: string
          category: string
          date: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          currency?: string
          category?: string
          date?: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
