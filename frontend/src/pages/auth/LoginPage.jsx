import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { ROLES, dashboardPathForRole } from '../../constants/roles.js'
import { Button, Notice } from '../../components/index.js'
import { loginAdminWithApi } from '../../services/adminService.js'

export default function LoginPage() {
  const { login: workspaceLogin, isAuthenticated, user: workspaceUser } = useAuth()
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect users who are already signed in to their designated dashboard
  useEffect(() => {
    if (isAuthenticated && workspaceUser) {
      navigate(dashboardPathForRole(workspaceUser.role), { replace: true })
    }
  }, [isAuthenticated, workspaceUser, navigate])

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
      const response = await loginAdminWithApi({ login: trimmedLogin, password })
      const admin = response?.admin

      if (response?.status !== true || !admin?.admin_id || !admin?.name || !admin?.email) {
        throw new Error(response?.message || 'The login response was incomplete. Please try again.')
      }

      const sessionUser = {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: ROLES.ADMIN,
      }

      workspaceLogin(sessionUser)
      navigate(dashboardPathForRole(sessionUser.role), { replace: true })
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
              Sign in with your Admin or Supporter credentials.
              The workspace automatically routes you to your authorized area.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-4">
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
