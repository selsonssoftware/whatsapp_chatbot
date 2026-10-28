import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext.jsx'
export function useAuth() { return useContext(AuthContext) }
