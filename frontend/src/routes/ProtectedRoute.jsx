import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useSuperAdminAuth } from '../hooks/useSuperAdminAuth.js'
import { ROLES } from '../constants/roles.js'
import { SUPER_ADMIN_DASHBOARD_PATH } from '../constants/superAdmin.js'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  const { user: saUser, status: saStatus } = useSuperAdminAuth()

  if (!isAuthenticated && saStatus === 'authenticated' && saUser?.role === ROLES.SUPER_ADMIN) {
    return <Navigate to={SUPER_ADMIN_DASHBOARD_PATH} replace />
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/access-denied" replace />
  return children
}
