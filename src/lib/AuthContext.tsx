"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types"
import { apiLogin, apiRegister } from "./api"

interface AuthContextProps {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user?: User | null; error?: unknown }>
  signIn: (email: string, password: string) => Promise<{ user?: User | null; error?: unknown }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("umusic_user") : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User
        setUser(parsed)
      } catch {
        // ignore parse errors
      }
    }
    setLoading(false)
  }, []);

  async function signUp(email: string, password: string) {
    try {
      const fullName = email.split("@")[0]
      const newUser = await apiRegister(email, password, fullName)
      setUser(newUser)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("umusic_user", JSON.stringify(newUser))
      }
      return { user: newUser, error: null }
    } catch (error: unknown) {
      return { user: null, error }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const loggedIn = await apiLogin(email, password)
      setUser(loggedIn)
      if (typeof window !== "undefined") {
        window.localStorage.setItem("umusic_user", JSON.stringify(loggedIn))
      }
      return { user: loggedIn, error: null }
    } catch (error: unknown) {
      return { user: null, error }
    }
  }

  async function signOut() {
    setUser(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("umusic_user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}