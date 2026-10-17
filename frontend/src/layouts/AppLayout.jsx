import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { NAV_ITEMS } from '../constants/roles.js'
import { Icon } from '../components/index.js'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user?.role))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((i) => i.path === location.pathname)
    return item?.label || 'Dashboard'
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand">WhatsApp SaaS</span>
          <button className="icon-btn" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
            <Icon name={collapsed ? 'Menu' : 'X'} size={18} />
          </button>
        </div>
        <nav>
          {items.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} onClick={() => setMobileOpen(false)}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <span className="text-sm text-gray-600 dark:text-gray-400">{user?.role}</span>}
          <button className="icon-btn" onClick={handleLogout} aria-label="Logout">
            <Icon name="LogOut" size={18} />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen((v) => !v)} aria-label="Open navigation">
            <Icon name="Menu" size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="topbar-title">{getPageTitle()}</div>
            <span className="hidden sm:inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-medium rounded-full">
              Demo Mode
            </span>
          </div>
          <div className="topbar-actions">
            <div className="relative">
              <button className="icon-btn" onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications">
                <Icon name="Bell" size={18} />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">No new notifications</p>
                </div>
              )}
            </div>
            <button className="icon-btn" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
              <Icon name={dark ? 'Sun' : 'Moon'} size={18} />
            </button>
            <div className="relative">
              <button className="icon-btn" onClick={() => setShowProfileMenu((v) => !v)} aria-label="Profile menu">
                <Icon name="ChevronDown" size={18} />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
