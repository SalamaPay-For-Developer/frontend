"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi, setTokens, clearTokens, getTokens } from "@/lib/api"
import type { User, Business } from "@/lib/types"
import { businessApi } from "@/lib/api"

interface AuthContextType {
  user: User | null
  activeBusiness: Business | null
  businesses: Business[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (phone: string, password: string) => Promise<void>
  register: (data: { phone_number: string; full_name: string; password: string; email?: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  refreshBusinesses: () => Promise<void>
  setActiveBusiness: (business: Business) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me()
      setUser(me)
    } catch {
      clearTokens()
      setUser(null)
    }
  }, [])

  const refreshBusinesses = useCallback(async () => {
    try {
      const list = await businessApi.myBusinesses()
      setBusinesses(list)
      const stored = typeof window !== "undefined" ? localStorage.getItem("active_business_id") : null
      if (stored && list.length > 0) {
        const found = list.find((b) => b.id === stored)
        if (found) setActiveBusinessState(found)
        else setActiveBusinessState(list[0])
      } else if (list.length > 0) {
        setActiveBusinessState(list[0])
      } else {
        setActiveBusinessState(null)
      }
    } catch {
      setBusinesses([])
      setActiveBusinessState(null)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const tokens = getTokens()
      if (tokens?.access) {
        await refreshUser()
        await refreshBusinesses()
      }
      setIsLoading(false)
    }
    init()
  }, [refreshUser, refreshBusinesses])

  const login = useCallback(async (phone: string, password: string) => {
    const data = await authApi.login(phone, password)
    setTokens(data.access, data.refresh)
    await refreshUser()
    await refreshBusinesses()
  }, [refreshUser, refreshBusinesses])

  const register = useCallback(async (data: { phone_number: string; full_name: string; password: string; email?: string }) => {
    await authApi.register(data)
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    if (typeof window !== "undefined") localStorage.removeItem("active_business_id")
    setUser(null)
    setBusinesses([])
    setActiveBusinessState(null)
    router.push("/auth/login")
  }, [router])

  const setActiveBusiness = useCallback((business: Business) => {
    setActiveBusinessState(business)
    if (typeof window !== "undefined") {
      localStorage.setItem("active_business_id", business.id)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        activeBusiness,
        businesses,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        refreshBusinesses,
        setActiveBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
