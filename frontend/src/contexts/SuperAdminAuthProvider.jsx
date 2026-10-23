import { useCallback, useEffect, useMemo, useState } from 'react'
import { SuperAdminContext } from './SuperAdminContext.jsx'
import {
  fetchSuperAdminSession,
  loginSuperAdmin,
  logoutSuperAdmin,
} from '../services/superAdminService.js'

export const SESSION_LOADING = 'loading'
export const SESSION_AUTHENTICATED = 'authenticated'
export const SESSION_UNAUTHENTICATED = 'unauthenticated'

export function SuperAdminAuthProvider({ children }) {
  const [status, setStatus] = useState(SESSION_LOADING)
  const [user, setUser] = useState(null)

  // The session is restored from the server, the browser never stores a role
  // or an authorisation flag of its own.
  useEffect(() => {
    let cancelled = false

    const restore = async () => {
      try {
        const data = await fetchSuperAdminSession()

        if (cancelled) return

        setUser(data.user)
        setStatus(SESSION_AUTHENTICATED)
      } catch {
        if (cancelled) return

        setUser(null)
        setStatus(SESSION_UNAUTHENTICATED)
      }
    }

    restore()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await loginSuperAdmin(credentials)

    setUser(data.user)
    setStatus(SESSION_AUTHENTICATED)

    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutSuperAdmin()
    } catch {
      // The local session is dropped either way, a failing request must not
      // keep the user signed in.
    }

    setUser(null)
    setStatus(SESSION_UNAUTHENTICATED)
  }, [])

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout]
  )

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>
}
