import { useState } from 'react'
import { AuthContext } from './AuthContext.jsx'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('demo_session')
    return stored ? JSON.parse(stored) : null
  })
  const login = (u) => {
    setUser(u)
    localStorage.setItem('demo_session', JSON.stringify(u))
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('demo_session')
  }
  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
}
