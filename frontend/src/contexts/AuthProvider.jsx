import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { ROLES } from '../constants/roles.js'

const normalizeUser = (u) => {
  if (!u) return u
  const role = (u.role || '').toLowerCase()
  if (role === 'admin') return { ...u, role: ROLES.ADMIN }
  return u
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Remove a legacy privileged demo session that no longer has a valid UI
    // or API route. Regular workspace authentication remains unchanged.
    localStorage.removeItem('wc_demo_auth')
    const stored = localStorage.getItem('wa_session')
    if (!stored) return null
    try {
      return normalizeUser(JSON.parse(stored))
    } catch {
      return null
    }
  })
  const login = useCallback((u) => {
    const normalized = normalizeUser(u)
    setUser(normalized)
    localStorage.setItem('wa_session', JSON.stringify(normalized))
  }, [])
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('wa_session')
  }, [])

  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
}
