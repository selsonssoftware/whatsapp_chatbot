import { useContext } from 'react'
import { SuperAdminContext } from '../contexts/SuperAdminContext.jsx'

export function useSuperAdminAuth() {
  return useContext(SuperAdminContext)
}
