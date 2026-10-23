import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useSuperAdminAuth } from '../../hooks/useSuperAdminAuth.js'
import { ROLES, USERS } from '../../constants/roles.js'
import { SUPER_ADMIN_DASHBOARD_PATH, dashboardPathForRole } from '../../constants/superAdmin.js'
import { Button, Notice } from '../../components/index.js'
import { authenticateAdmin, getAdminAccounts } from '../../services/authService.js'
import { getSupporters } from '../../services/supporterService.js'
import { loginAdminWithApi } from '../../services/adminService.js'

const initials = (name) =>
  String(name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

export default function LoginPage() {
  const { login: workspaceLogin, isAuthenticated, user: workspaceUser } = useAuth()
  const { login: superAdminLogin, status: saStatus, user: saUser } = useSuperAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect users who are already signed in to their designated dashboard
  useEffect(() => {
    if (saStatus === 'authenticated' && saUser?.role === ROLES.SUPER_ADMIN) {
      const from = location.state?.from
      const target =
        typeof from === 'string' && from.startsWith('/super-admin/')
          ? from
          : SUPER_ADMIN_DASHBOARD_PATH
      navigate(target, { replace: true })
    } else if (isAuthenticated && workspaceUser) {
      navigate(dashboardPathForRole(workspaceUser.role), { replace: true })
    }
  }, [saStatus, saUser, isAuthenticated, workspaceUser, navigate, location.state])

  const handleWorkspaceQuickLogin = (user) => {
    workspaceLogin(user)
    const target = dashboardPathForRole(user.role)
    navigate(target, { replace: true })
  }

  const handlePasswordLogin = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedLogin = credentials.email.trim()
    const password = credentials.password

    if (!trimmedLogin || !password) {
      setError('Enter your login ID and password.')
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // 1. First, attempt Super Admin authentication against the secure backend API
      let saAttemptError = null
      try {
        const saResult = await superAdminLogin({
          login: trimmedLogin,
          password,
        })

        if (saResult && (saResult.role === ROLES.SUPER_ADMIN || saResult.role === 'super_admin')) {
          const from = location.state?.from
          const target =
            typeof from === 'string' && from.startsWith('/super-admin/')
              ? from
              : SUPER_ADMIN_DASHBOARD_PATH
          navigate(target, { replace: true })
          return
        }
      } catch (err) {
        saAttemptError = err
        // If rate limited, propagate immediately
        if (err.status === 429) {
          throw err
        }
      }

      // 2. Next, check registered workspace accounts (Admin accounts in localStorage)
      const registeredAccounts = getAdminAccounts()
      const registeredSession = authenticateAdmin(registeredAccounts, {
        email: trimmedLogin,
        password,
      })

      if (registeredSession) {
        const sessionUser = {
          id: registeredSession.id,
          name: registeredSession.name,
          email: registeredSession.email,
          role: registeredSession.role || ROLES.ADMIN,
        }
        workspaceLogin(sessionUser)
        navigate(dashboardPathForRole(sessionUser.role), { replace: true })
        return
      }

      // 3. Check demo/seed workspace accounts (Admin and Supporter)
      const lowerLogin = trimmedLogin.toLowerCase()
      const matchedDemoUser = USERS.find(
        (u) =>
          u.email.toLowerCase() === lowerLogin ||
          (u.role === ROLES.ADMIN && (lowerLogin === 'admin' || lowerLogin === 'ava')) ||
          (u.role === ROLES.SUPPORTER && (lowerLogin === 'supporter' || lowerLogin === 'ravi'))
      )

      const allSupporters = getSupporters()
      const matchedSupporter = allSupporters.find(
        (s) => s.email?.toLowerCase() === lowerLogin
      )

      const isDemoPasswordValid =
        password === 'admin@123' ||
        password === 'password' ||
        password === 'demo123' ||
        password === 'supporter@123'

      if (matchedDemoUser && isDemoPasswordValid) {
        workspaceLogin(matchedDemoUser)
        navigate(dashboardPathForRole(matchedDemoUser.role), { replace: true })
        return
      }

      if (matchedSupporter && isDemoPasswordValid) {
        const supUser = {
          id: matchedSupporter.id,
          name: matchedSupporter.name,
          email: matchedSupporter.email,
          role: ROLES.SUPPORTER,
        }
        workspaceLogin(supUser)
        navigate('/supporter/inbox', { replace: true })
        return
      }

      // 4. Try live workspace API if available
      try {
        const liveAdminRes = await loginAdminWithApi({ login: trimmedLogin, password })
        if (liveAdminRes && liveAdminRes.user) {
          workspaceLogin(liveAdminRes.user)
          navigate(dashboardPathForRole(liveAdminRes.user.role || ROLES.ADMIN), { replace: true })
          return
        }
      } catch {
        // live workspace API not reachable or rejected
      }

      // 5. If Super Admin session had CSRF expiration, inform user
      if (saAttemptError?.status === 419) {
        throw new Error('Your secure session expired. Please try again.')
      }

      // 6. Otherwise reject with invalid credentials
      throw new Error('Invalid login ID or password. Please verify your credentials.')
    } catch (err) {
      if (err.status === 429) {
        setError(err.message || 'Too many sign-in attempts. Please wait a moment and try again.')
      } else {
        setError(err.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-emerald-50/40 to-green-100/60 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
        {/* Left Branding Showcase */}
        <section className="relative hidden lg:flex flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-purple-50/60 border border-slate-200/60 shadow-xl p-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c667] to-[#007c72] text-white shadow-lg">
              <MessageSquare size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#007c72] leading-tight">
                WhatsApp CRM
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
                Enterprise Platform
              </span>
            </div>
          </div>

          <div className="relative z-10 py-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-300/60">
              <ShieldCheck size={14} className="text-emerald-700" />
              Unified Role-Based Authentication
            </div>

            <h2 className="text-3xl font-bold text-slate-800 leading-tight">
              One login for all roles.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm max-w-md">
              Sign in with your Super Admin, Admin, or Supporter credentials.
              The platform automatically routes you to your authorized console.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-white/70 backdrop-blur rounded-2xl p-3 border border-slate-200/60 text-left">
                <span className="text-xs font-semibold text-slate-500 block">Super Admin</span>
                <span className="text-sm font-bold text-[#007c72]">Platform Console</span>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-3 border border-slate-200/60 text-left">
                <span className="text-xs font-semibold text-slate-500 block">Admin</span>
                <span className="text-sm font-bold text-emerald-700">Workspace Hub</span>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl p-3 border border-slate-200/60 text-left">
                <span className="text-xs font-semibold text-slate-500 block">Supporter</span>
                <span className="text-sm font-bold text-teal-700">Team Inbox</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-4">
            <span>Server-verified session security</span>
            <span>CSRF protected</span>
          </div>
        </section>

        {/* Right Common Sign-In Card */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#00c667] to-[#007c72] text-white shadow">
                <MessageSquare size={16} />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Sign in
              </h1>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Sign in to your WhatsApp CRM account.
            </p>

            {error && (
              <Notice
                type="error"
                onDismiss={() => setError('')}
              >
                {error}
              </Notice>
            )}

            {/* Quick Workspace Demo Accounts */}
            <div className="space-y-2.5 mb-6">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Quick Demo Access
              </span>
              {USERS.filter((u) => u.role !== 'super_admin').map((user) => (
                <button
                  key={user.id}
                  type="button"
                  id={`quick-login-${user.role.toLowerCase()}`}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-300 transition text-left"
                  onClick={() => handleWorkspaceQuickLogin(user)}
                >
                  <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-sm">
                    {initials(user.name)}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {user.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          user.role === ROLES.ADMIN
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </span>
                    <span className="block text-xs text-slate-500 truncate">
                      {user.email}
                    </span>
                  </span>

                  <ArrowRight size={16} className="text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-5">
              <span className="flex-1 h-px bg-slate-200" />
              or sign in with credentials
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Credential Form */}
            <form
              className="space-y-4"
              onSubmit={handlePasswordLogin}
              noValidate
            >
              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="login-id"
                >
                  Email / Login ID
                </label>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <input
                    id="login-id"
                    name="login"
                    type="text"
                    autoComplete="username"
                    value={credentials.email}
                    onChange={(event) =>
                      setCredentials((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                    placeholder="Enter email or login ID"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                  htmlFor="login-password"
                >
                  Password
                </label>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} aria-hidden="true" />
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={(event) =>
                      setCredentials((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full !h-11 !rounded-xl !bg-[#007c72] hover:!bg-[#005f59] text-white font-medium shadow-md hover:shadow-lg transition mt-2"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
                {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              New workspace account?{' '}
              <Link
                className="font-semibold text-[#007c72] hover:underline"
                to="/register"
              >
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}