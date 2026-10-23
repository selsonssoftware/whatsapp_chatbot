import { Navigate, useLocation } from 'react-router-dom'
import { useSuperAdminAuth } from '../hooks/useSuperAdminAuth.js'
import { useAuth } from '../hooks/useAuth.js'
import { ROLES } from '../constants/roles.js'
import {
  SUPER_ADMIN_LOGIN_PATH,
  dashboardPathForRole,
} from '../constants/superAdmin.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

/**
 * Protects the Super Admin routes.
 *
 * The session is verified by the Laravel API on every page load, so the
 * browser can not fake access. A signed in user that is not a Super Admin is
 * redirected to the dashboard they are allowed to use.
 */
export default function SuperAdminRoute({ children }) {
  const { status, user } = useSuperAdminAuth()
  const { user: tenantUser } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" className="text-brand-600" />
      </div>
    )
  }

  if (status !== 'authenticated' || !user) {
    // A normal admin that is signed in to the workspace is sent back to
    // their own dashboard, everybody else has to sign in first.
    if (tenantUser && tenantUser.role !== ROLES.SUPER_ADMIN) {
      return <Navigate to={dashboardPathForRole(tenantUser.role)} replace />
    }

    return (
      <Navigate
        to={SUPER_ADMIN_LOGIN_PATH}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (user.role !== ROLES.SUPER_ADMIN) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return children
}
