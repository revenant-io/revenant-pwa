'use client'

import React, { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
}

interface AuthContextType {
  user: User | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
})

function readUserFromCookie(): User | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user_info='))
  if (!match) return null
  try {
    const value = decodeURIComponent(match.split('=').slice(1).join('='))
    return JSON.parse(value) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialise lazily — runs once on first render (client-side only).
  // We cannot call document.cookie during SSR, so guard with typeof.
  const [user, setUser] = useState<User | null>(() =>
    typeof document !== 'undefined' ? readUserFromCookie() : null
  )
  const router = useRouter()

  // No useEffect needed for the initial cookie read — useState lazy initialiser handles it.

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
