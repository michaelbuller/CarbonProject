export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'project_developer' | 'verifier' | 'buyer' | 'regulator' | 'admin'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          wallet_address: string | null
          user_type: UserType
          organization: string | null
          commission_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          user_type?: UserType
          organization?: string | null
          commission_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          wallet_address?: string | null
          user_type?: UserType
          organization?: string | null
          commission_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'Renewable Energy' | 'Reforestation' | 'Carbon Capture' | 'Energy Efficiency' | 'Waste Management'
          location: string
          status: 'Planning' | 'Active' | 'Completed' | 'Suspended'
          user_id: string
          created_at: string
          updated_at: string
          total_credits: number
          available_credits: number
          price_per_credit: number
          vintage_year: number
          certification_standard: string | null
          verification_status: 'Pending' | 'Verified' | 'Rejected'
          api_number: string | null
          commission_name: string | null
          commission_state: string | null
          well_count: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'Renewable Energy' | 'Reforestation' | 'Carbon Capture' | 'Energy Efficiency' | 'Waste Management'
          location: string
          status?: 'Planning' | 'Active' | 'Completed' | 'Suspended'
          user_id: string
          created_at?: string
          updated_at?: string
          total_credits?: number
          available_credits?: number
          price_per_credit?: number
          vintage_year: number
          certification_standard?: string | null
          verification_status?: 'Pending' | 'Verified' | 'Rejected'
          api_number?: string | null
          commission_name?: string | null
          commission_state?: string | null
          well_count?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'Renewable Energy' | 'Reforestation' | 'Carbon Capture' | 'Energy Efficiency' | 'Waste Management'
          location?: string
          status?: 'Planning' | 'Active' | 'Completed' | 'Suspended'
          user_id?: string
          created_at?: string
          updated_at?: string
          total_credits?: number
          available_credits?: number
          price_per_credit?: number
          vintage_year?: number
          certification_standard?: string | null
          verification_status?: 'Pending' | 'Verified' | 'Rejected'
          api_number?: string | null
          commission_name?: string | null
          commission_state?: string | null
          well_count?: number
          metadata?: Json | null
        }
      }
      team_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'Admin' | 'Member' | 'Viewer'
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'Admin' | 'Member' | 'Viewer'
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'Admin' | 'Member' | 'Viewer'
          joined_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          size: number
          url: string
          uploaded_by: string
          uploaded_at: string
          category: 'Legal' | 'Technical' | 'Financial' | 'Certification' | 'Other'
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: string
          size: number
          url: string
          uploaded_by: string
          uploaded_at?: string
          category: 'Legal' | 'Technical' | 'Financial' | 'Certification' | 'Other'
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: string
          size?: number
          url?: string
          uploaded_by?: string
          uploaded_at?: string
          category?: 'Legal' | 'Technical' | 'Financial' | 'Certification' | 'Other'
        }
      }
      transactions: {
        Row: {
          id: string
          project_id: string
          type: 'Purchase' | 'Retirement' | 'Transfer'
          amount: number
          credits: number
          from_user_id: string | null
          to_user_id: string | null
          status: 'Pending' | 'Completed' | 'Failed'
          transaction_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'Purchase' | 'Retirement' | 'Transfer'
          amount: number
          credits: number
          from_user_id?: string | null
          to_user_id?: string | null
          status?: 'Pending' | 'Completed' | 'Failed'
          transaction_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'Purchase' | 'Retirement' | 'Transfer'
          amount?: number
          credits?: number
          from_user_id?: string | null
          to_user_id?: string | null
          status?: 'Pending' | 'Completed' | 'Failed'
          transaction_hash?: string | null
          created_at?: string
        }
      }
      compliance_checks: {
        Row: {
          id: string
          project_id: string
          check_type: string
          status: 'Pass' | 'Fail' | 'Pending'
          details: Json | null
          checked_at: string
          checked_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          check_type: string
          status: 'Pass' | 'Fail' | 'Pending'
          details?: Json | null
          checked_at?: string
          checked_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          check_type?: string
          status?: 'Pass' | 'Fail' | 'Pending'
          details?: Json | null
          checked_at?: string
          checked_by?: string | null
        }
      }
      commissions: {
        Row: {
          id: string
          name: string
          state: string
          contact_email: string | null
          contact_phone: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          state: string
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          state?: string
          contact_email?: string | null
          contact_phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_numbers: {
        Row: {
          id: string
          api_number: string
          commission_id: string | null
          operator_name: string | null
          field_name: string | null
          well_name: string | null
          well_status: string | null
          latitude: number | null
          longitude: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_number: string
          commission_id?: string | null
          operator_name?: string | null
          field_name?: string | null
          well_name?: string | null
          well_status?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_number?: string
          commission_id?: string | null
          operator_name?: string | null
          field_name?: string | null
          well_name?: string | null
          well_status?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
          updated_at?: string
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
  }
}