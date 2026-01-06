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
        // Check for email not confirmed error
        if (error.message && error.message.includes('Email not confirmed')) {
          return { 
            data: null, 
            error: { message: 'Please confirm your email address. Check your inbox for the confirmation link.' }
          }
        }
        return { data, error }
      }
      
      return { data, error }
    } catch (err) {
      return { 
        data: null, 
        error: { message: 'Login failed. Please check your credentials.' }
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