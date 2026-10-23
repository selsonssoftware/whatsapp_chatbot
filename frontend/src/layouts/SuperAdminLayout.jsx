import { useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useSuperAdminAuth } from '../hooks/useSuperAdminAuth.js'
import { SUPER_ADMIN_NAV } from '../constants/superAdmin.js'
import { Icon } from '../components/index.js'
import WhatsAppMark from '../components/WhatsAppMark.jsx'

function initials(name) {
  return String(name || 'SA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/**
 * Shell of the platform Super Admin area.
 */
export default function SuperAdminLayout() {
  const { user, logout } = useSuperAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)

  const activeItem =
    SUPER_ADMIN_NAV.find((item) => item.path === location.pathname) ||
    SUPER_ADMIN_NAV.find((item) => location.pathname.startsWith(`${item.path}/`))

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#super-admin-content">
        Skip to main content
      </a>

      {mobileOpen && (
        <div
          className="sidebar-backdrop lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar super-admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand super-admin-brand">
            <span className="super-admin-brand-mark">
              <WhatsAppMark size={16} />
            </span>
            WhatsApp CRM
          </span>
          <button
            className="icon-btn lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav ref={navRef} aria-label="Super Admin sections">
          {SUPER_ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              onClick={() => setMobileOpen(false)}
            >
              <Icon name={item.icon} size={18} />
              <span className="super-admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="text-sm text-gray-600 dark:text-gray-400">Super Admin</span>
          <button className="icon-btn" onClick={handleLogout} aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button
            className="icon-btn mobile-only"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="topbar-title">{activeItem?.label || 'Super Admin'}</div>
            <span className="hidden sm:inline-flex items-center px-2 py-1 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
              Platform
            </span>
          </div>

          <div className="topbar-actions">
            <div className="user-chip">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
                {initials(user?.name)}
              </span>
              <span className="hidden sm:inline flex-col items-start leading-tight">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </span>
            </div>
            <button className="icon-btn" onClick={handleLogout} aria-label="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="content" id="super-admin-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
