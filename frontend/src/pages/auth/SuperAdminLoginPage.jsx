import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { useSuperAdminAuth } from '../../hooks/useSuperAdminAuth.js'
import { SUPER_ADMIN_DASHBOARD_PATH } from '../../constants/superAdmin.js'
import { Button } from '../../components/index.js'
import WhatsAppMark from '../../components/WhatsAppMark.jsx'

const GENERIC_ERROR = 'Those credentials are not valid for a Super Admin account.'

function validate(form) {
  const errors = {}

  if (!form.login.trim()) {
    errors.login = 'Enter your Super Admin login ID or e-mail address.'
  }

  if (!form.password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

/**
 * Maps a failed authentication request to a message that never reveals
 * whether the account exists or which role it holds.
 */
function toMessage(error) {
  if (!error) return GENERIC_ERROR
  if (error.status === 429) {
    return error.message || 'Too many attempts. Please wait a moment and try again.'
  }
  if (error.status === 419) {
    return 'Your secure session expired. Please try again.'
  }
  if (error.status === 401 || error.status === 403) {
    return error.message || GENERIC_ERROR
  }
  if (error.status >= 500) {
    return 'The authentication server ran into an error. Please try again later.'
  }
  return error.message || 'The authentication server could not be reached. Please try again.'
}

export default function SuperAdminLoginPage() {
  const { login } = useSuperAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({ ...current, [name]: value }))
    setFormError('')
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await login({ login: form.login.trim(), password: form.password })

      const requestedPath = location.state?.from
      const target =
        typeof requestedPath === 'string' && requestedPath.startsWith('/super-admin/')
          ? requestedPath
          : SUPER_ADMIN_DASHBOARD_PATH

      navigate(target, { replace: true })
    } catch (error) {
      setFormError(toMessage(error))
      setForm((current) => ({ ...current, password: '' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page login-page-super-admin">
      <div className="login-accent login-accent-top" aria-hidden="true" />
      <div className="login-accent login-accent-bottom" aria-hidden="true" />

      <main className="login-card login-card-super-admin">
        <div className="login-brand">
          <span className="login-brand-mark">
            <WhatsAppMark size={24} />
          </span>

          <span className="flex flex-col">
            <span className="login-brand-name">WhatsApp CRM</span>
            <span className="login-brand-role">Super Admin Console</span>
          </span>
        </div>

        <h1 className="login-title">Super Admin sign in</h1>

        <p className="login-subtitle">
          Platform access for managing companies, plans and subscriptions.
        </p>

        {formError && (
          <div className="login-alert" role="alert">
            {formError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label" htmlFor="super-admin-login">
              Email / Login ID
            </label>

            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" aria-hidden="true" />

              <input
                id="super-admin-login"
                name="login"
                type="text"
                className="login-input login-input-with-icon"
                value={form.login}
                onChange={handleChange}
                autoComplete="username"
                placeholder="super.admin@company.com"
                aria-invalid={Boolean(errors.login)}
                aria-describedby={errors.login ? 'super-admin-login-error' : undefined}
              />
            </div>

            {errors.login && (
              <p className="error" id="super-admin-login-error">
                {errors.login}
              </p>
            )}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="super-admin-password">
              Password
            </label>

            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" aria-hidden="true" />

              <input
                id="super-admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input-with-icon login-input-with-action"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Your password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'super-admin-password-error' : undefined}
              />

              <button
                type="button"
                className="login-input-action"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.password && (
              <p className="error" id="super-admin-password-error">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="login-submit !h-11 !rounded-lg"
            loading={isSubmitting}
          >
            {!isSubmitting && <LogIn size={16} aria-hidden="true" />}
            {isSubmitting ? 'Signing in...' : 'Sign in as Super Admin'}
          </Button>
        </form>

        <p className="login-note">
          Authorised platform personnel only. Every sign-in attempt is verified
          server side and logged.
        </p>
      </main>

      <p className="login-footer">
        Workspace user?{' '}
        <Link className="login-link" to="/login">
          Go to workspace sign in
        </Link>
      </p>
    </div>
  )
}
