import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database, UserType } from '@/lib/database.types'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userProfile: Database['public']['Tables']['users']['Row'] | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string, userType?: UserType, organization?: string) => Promise<void>
  signOut: () => Promise<void>
  connectWallet: (walletAddress: string) => Promise<void>
  updateUserProfile: (updates: Partial<Database['public']['Tables']['users']['Update']>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<Database['public']['Tables']['users']['Row'] | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Fetch user profile if logged in
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUserProfile(profile)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Fetch user profile on auth change
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName?: string, userType?: UserType, organization?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
          organization: organization,
        },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const connectWallet = async (walletAddress: string) => {
    if (!user) throw new Error('User must be logged in to connect wallet')
    
    const { error } = await supabase
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', user.id)
    
    if (error) throw error
    
    // Update local profile
    if (userProfile) {
      setUserProfile({ ...userProfile, wallet_address: walletAddress })
    }
  }

  const updateUserProfile = async (updates: Partial<Database['public']['Tables']['users']['Update']>) => {
    if (!user) throw new Error('User must be logged in to update profile')
    
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
    
    if (error) throw error
    
    // Update local profile
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates } as Database['public']['Tables']['users']['Row'])
    }
  }

  const value = {
    user,
    session,
    loading,
    userProfile,
    signIn,
    signUp,
    signOut,
    connectWallet,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}