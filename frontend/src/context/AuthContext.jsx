import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, role = 'user') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Handle specific error cases
        const errorMsg = error.message || ''
        
        if (errorMsg.includes('Email not confirmed') || errorMsg.includes('email') && errorMsg.includes('confirm')) {
          return { 
            data: null, 
            error: { message: 'Your email is not confirmed. Please check your inbox and click the confirmation link.' }
          }
        }
        
        if (errorMsg.includes('Invalid') || errorMsg.includes('credentials')) {
          return { 
            data: null, 
            error: { message: 'Invalid email or password.' }
          }
        }
        
        // Generic error for any other case
        return { 
          data: null, 
          error: { message: 'Your email is not confirmed. Please verify your email to login.' }
        }
      }
      
      return { data, error }
    } catch (err) {
      return { 
        data: null, 
        error: { message: 'Your email is not confirmed. Please check your inbox for the confirmation link.' }
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const getToken = async () => {
    if (!session) return null
    return session.access_token
  }

  const getUserRole = () => {
    return user?.user_metadata?.role || 'user'
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getToken,
    getUserRole,
    isAuthenticated: !!user,
    isAdmin: getUserRole() === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}