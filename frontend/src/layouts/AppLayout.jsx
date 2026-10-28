import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { NAV_ITEMS } from '../constants/roles.js'
import { Icon } from '../components/index.js'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Gauge,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Shield,
  ShieldCheck,
  Sun,
  Target,
  User,
  X,
  Zap,
} from 'lucide-react'

function renderNavIcon(item, size = 18) {
  if (
    item.label?.trim().toLowerCase() === 'leads & pipeline' ||
    item.label?.trim().toLowerCase() === 'leads' ||
    item.path?.toLowerCase().includes('/leads')
  ) {
    return <Target size={size} aria-hidden="true" className="shrink-0" />
  }
  return <Icon name={item.icon} size={size} className="shrink-0" />
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
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
    const closePopovers = (e) => {
      if (!e.target.closest('#notifications-trigger') && !e.target.closest('#notifications-popover')) {
        setShowNotifications(false)
      }
      if (!e.target.closest('#profile-trigger') && !e.target.closest('#profile-popover')) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('click', closePopovers)
    return () => document.removeEventListener('click', closePopovers)
  }, [])

  const currentNavItem =
    NAV_ITEMS.find((i) => i.path === location.pathname) ||
    NAV_ITEMS.find((i) => location.pathname.startsWith(`${i.path}/`)) || {
      label: 'Dashboard',
      path: '/dashboard',
    }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col antialiased text-slate-800 dark:text-slate-100">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 min-h-screen">
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-all duration-200 ease-in-out shrink-0 ${
            collapsed ? 'w-18' : 'w-64'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Sidebar Header Brand */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-full bg-[#00A884] text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition">
                <MessageCircle size={18} fill="currentColor" strokeWidth={0} />
              </span>
              {!collapsed && (
                <span className="text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">
                  Blast<span className="text-[#00A884]">WhatsApp</span>
                </span>
              )}
            </Link>

            <button
              type="button"
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-md"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            ref={navRef}
            className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 custom-scrollbar"
            aria-label="Sidebar navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group ${
                    isActive
                      ? 'bg-[#E8F8F3] text-[#00A884] dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                {renderNavIcon(item, 17)}
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                    {item.hasChildren && !item.badge && (
                      <ChevronRight
                        size={13}
                        className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer User Info */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {!collapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A884] to-[#007C72] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {(user?.name || 'A')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize truncate">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-red-600 rounded-lg"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header Bar */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            {/* Left: Mobile trigger & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Link to="/dashboard" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                  Home
                </Link>
                <span>›</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
                  {currentNavItem.label}
                </span>
              </nav>
            </div>

            {/* Center: WABA Status Pill Group (Matching reference PDF on all 17 screens) */}
            <div className="hidden xl:flex items-center gap-3.5 bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-full px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
              <span className="flex items-center gap-1.5">
                <MessageCircle size={14} className="text-[#00A884]" fill="currentColor" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">WABA Number:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">+1 555 123 4567</span>
              </span>

              <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />

              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-[#00A884]" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                <span className="flex items-center gap-1 text-[#00A884] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00A884] animate-pulse" />
                  Connected
                </span>
              </span>

              <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#00A884]" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Quality:</span>
                <span className="flex items-center gap-1 text-[#00A884] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00A884]" />
                  High
                </span>
              </span>

              <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />

              <span className="flex items-center gap-1.5">
                <Gauge size={13} className="text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-medium">Tier:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">MSG_LIMIT</span>
              </span>
            </div>

            {/* Right: Actions, Notifications, Dark Mode & User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notifications-trigger"
                  type="button"
                  onClick={() => setShowNotifications((v) => !v)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                </button>

                {showNotifications && (
                  <div
                    id="notifications-popover"
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                        Notifications (3)
                      </span>
                      <span className="text-[11px] text-[#00A884] font-semibold hover:underline cursor-pointer">
                        Mark all as read
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                        <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                          Campaign "Summer Collection" Completed
                        </p>
                        <p className="text-emerald-700/80 dark:text-emerald-400 text-[11px]">
                          12,540 messages delivered with 98.2% delivery rate.
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          New WhatsApp Order #ORD12345
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Sarah Johnson purchased 2x Sports Shoe ($99.98).
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Webhook Quality Alert: High
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          All Meta Cloud API health metrics are optimal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={() => setDark((v) => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={dark ? 'Light Mode' : 'Dark Mode'}
              >
                {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              {/* User Avatar & Role Dropdown */}
              <div className="relative">
                <button
                  id="profile-trigger"
                  type="button"
                  onClick={() => setShowProfileMenu((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {(user?.name || 'A')[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {user?.role || 'Admin'}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </span>
                </button>

                {showProfileMenu && (
                  <div
                    id="profile-popover"
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-1.5 z-50 text-left animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'admin@example.com'}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Role: {user?.role || 'Admin'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setShowProfileMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <User size={14} className="text-slate-400" />
                        Account Settings
                      </button>

                      <button
                        onClick={() => {
                          navigate('/team')
                          setShowProfileMenu(false)
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Shield size={14} className="text-slate-400" />
                        Team & Permissions
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
