import { ROLES } from './roles.js'

/**
 * Navigation of the platform Super Admin area.
 *
 * Every entry points to a page that is backed by the Super Admin API, no
 * module links to a screen that does not exist.
 */
export const SUPER_ADMIN_NAV = [
  { label: 'Dashboard', path: '/super-admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Companies', path: '/super-admin/companies', icon: 'Building2' },
  { label: 'Plans', path: '/super-admin/plans', icon: 'Layers' },
  { label: 'Feature Controls', path: '/super-admin/feature-controls', icon: 'SlidersHorizontal' },
  { label: 'Subscriptions', path: '/super-admin/subscriptions', icon: 'Repeat' },
  { label: 'Payments', path: '/super-admin/payments', icon: 'CreditCard' },
  { label: 'Reports', path: '/super-admin/reports', icon: 'BarChart3' },
  { label: 'Settings', path: '/super-admin/settings', icon: 'Settings' },
]

export const SUPER_ADMIN_ROLE = ROLES.SUPER_ADMIN

export const SUPER_ADMIN_LOGIN_PATH = '/login'

export const SUPER_ADMIN_DASHBOARD_PATH = '/super-admin/dashboard'

/**
 * The dashboard a signed in user is allowed to see.
 */
export function dashboardPathForRole(role) {
  if (role === ROLES.SUPER_ADMIN) return SUPER_ADMIN_DASHBOARD_PATH
  return role === ROLES.SUPPORTER ? '/supporter/inbox' : '/dashboard'
}
