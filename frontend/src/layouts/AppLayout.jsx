import { useState, useEffect, useRef } from 'react'
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
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const closePopovers = () => {
      setShowNotifications(false)
      setShowProfileMenu(false)
    }
    document.addEventListener('scroll', closePopovers, true)
    return () => document.removeEventListener('scroll', closePopovers, true)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const active = nav.querySelector('.nav-item.active')
    if (!active) return
    const navBox = nav.getBoundingClientRect()
    const itemBox = active.getBoundingClientRect()
    let top = nav.scrollTop
    if (itemBox.top < navBox.top) top -= navBox.top - itemBox.top
    else if (itemBox.bottom > navBox.bottom) top += itemBox.bottom - navBox.bottom
    if (Math.abs(top - nav.scrollTop) > 1) nav.scrollTo({ top, behavior: 'smooth' })
  }, [location.pathname, mobileOpen, collapsed])

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user?.role))

  const searchResults = search.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(search.trim().toLowerCase()))
    : []

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
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {mobileOpen && <div className="sidebar-backdrop lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand">Blast WhatsApp </span>
          <button
            className="icon-btn hidden lg:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={collapsed ? 'Menu' : 'X'} size={18} />
          </button>
          <button className="icon-btn lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <Icon name="X" size={18} />
          </button>
        </div>
        <nav ref={navRef}>
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
        <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Icon name="Menu" size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="topbar-title">{getPageTitle()}</div>
            <span className="hidden sm:inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-medium rounded-full">
              Simulation
            </span>
          </div>
          <div className="topbar-actions">
            <div className="relative hidden md:block">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                aria-label="Search navigation modules"
                className="w-56 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {search.trim() && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 max-h-72 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-gray-500">No modules match "{search}"</p>
                  ) : (
                    searchResults.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path)
                          setSearch('')
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Icon name={item.icon} size={16} />
                        {item.label}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button className="icon-btn" onClick={() => setShowNotifications((v) => !v)} aria-label="Notifications">
                <Icon name="Bell" size={18} />
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-600 text-white text-[10px] leading-4 text-center">
                  3
                </span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Notifications</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>3 campaign replies are waiting in Team Inbox.</li>
                    <li>Order #2 is still pending payment.</li>
                    <li>Schedule "Welcome Flow" finished its run.</li>
                  </ul>
                </div>
              )}
            </div>
            <button className="icon-btn" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
              <Icon name={dark ? 'Sun' : 'Moon'} size={18} />
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowProfileMenu((v) => !v)}
                aria-label="Profile menu"
                aria-expanded={showProfileMenu}
              >
                <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
                  {(user?.name || 'U')
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <span className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.role}</span>
                </span>
                <Icon name="ChevronDown" size={16} />
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
        <main className="content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
