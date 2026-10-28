import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  ArrowRight,
  Sparkles,
  Zap,
  Headphones,
  CheckCircle2,
  Bot,
  MessageCircle,
} from 'lucide-react'
import { Button, Notice } from '../../components/index.js'
import { registerAdminWithApi } from '../../services/adminService.js'
import { validateRegistration } from '../../services/authService.js'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

const BENEFITS = [
  { icon: Sparkles, label: 'AI campaigns' },
  { icon: Zap, label: 'Automated workflows' },
  { icon: Headphones, label: 'Omni-channel triage' },
]

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field) => (event) => {
    const { value } = event.target
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateRegistration(form)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    setIsSubmitting(true)
    setNotice(null)
    try {
      const response = await registerAdminWithApi(form)
      setNotice({
        type: 'success',
        message: response?.message || 'Admin account registered successfully.',
      })
      setForm(EMPTY_FORM)
    } catch (error) {
      setNotice({
        type: 'error',
        message: error.message || 'Unable to register your account. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-emerald-50/40 to-green-100/60 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
        {/* Left illustration panel */}
        <div className="relative hidden lg:flex flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-purple-50/60 border border-slate-200/60 shadow-xl p-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c667] to-[#007c72] text-white shadow-lg">
              <MessageSquare size={20} />
            </span>
            <span className="text-lg font-bold text-[#007c72]">Blast WhatsApp</span>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center py-8">
            <div className="relative w-full max-w-md aspect-square">
              {/* Glass platform */}
              <div className="absolute inset-x-8 bottom-6 h-6 rounded-full bg-gradient-to-r from-blue-200/60 to-purple-200/60 blur-md" />
              <div className="absolute inset-x-12 bottom-8 h-3 rounded-full bg-white/60 backdrop-blur border border-white/40 shadow" />

              {/* Robot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-44 h-44 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border border-white/60 shadow-2xl flex items-center justify-center backdrop-blur">
                    <Bot size={88} className="text-slate-700" strokeWidth={1.25} />
                  </div>
                  {/* Glowing eyes */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 flex gap-6">
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]" />
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_3px_rgba(59,130,246,0.8)]" />
                  </div>
                </div>
              </div>

              {/* Floating chat bubbles */}
              <div className="absolute top-6 left-4 px-4 py-2 rounded-2xl rounded-bl-sm bg-white/80 backdrop-blur border border-blue-200/60 shadow-lg text-sm text-slate-700 flex items-center gap-2">
                <MessageCircle size={14} className="text-blue-500" />
                Hello! How can I help?
              </div>
              <div className="absolute top-20 right-2 px-4 py-2 rounded-2xl rounded-br-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg text-sm flex items-center gap-2">
                <Sparkles size={14} />
                AI powered
              </div>
              <div className="absolute bottom-24 left-10 px-4 py-2 rounded-2xl rounded-bl-sm bg-white/80 backdrop-blur border border-emerald-200/60 shadow-lg text-sm text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Campaign sent
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Your AI assistant, always on.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Launch AI-powered campaigns, automate workflows, and triage
              conversations across every channel — in minutes.
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-slate-200/70 rounded-3xl shadow-2xl p-8 lg:p-10">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                OFFICIAL BUSINESS API INFRASTRUCTURE
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Get started with BlastWhatsApp and launch AI-powered campaigns,
              automated workflows, and omni-channel triage in minutes.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <Icon size={13} className="text-[#007c72]" />
                  {label}
                </span>
              ))}
            </div>

            {notice && (
              <Notice type={notice.type} onDismiss={() => setNotice(null)}>
                {notice.message}
              </Notice>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-name">
                  Full name
                </label>
                <input
                  id="register-name"
                  name="name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#00c667] focus:border-transparent transition"
                  value={form.name}
                  onChange={update('name')}
                  autoComplete="name"
                  placeholder="Ava Admin"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="error mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-email">
                  Work email
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#00c667] focus:border-transparent transition"
                  value={form.email}
                  onChange={update('email')}
                  autoComplete="email"
                  placeholder="admin@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="error mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-phone">
                  Phone number
                </label>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#00c667] focus:border-transparent transition"
                  value={form.phone}
                  onChange={update('phone')}
                  autoComplete="tel"
                  placeholder="+919876543210"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <p className="error mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#00c667] focus:border-transparent transition"
                  value={form.password}
                  onChange={update('password')}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && <p className="error mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-confirm">
                  Confirm password
                </label>
                <input
                  id="register-confirm"
                  name="confirmPassword"
                  type="password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-[#00c667] focus:border-transparent transition"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword && <p className="error mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full !h-11 !rounded-xl !bg-[#007c72] hover:!bg-[#005f59] mt-2"
                loading={isSubmitting}
              >
                {isSubmitting ? 'Registering…' : 'Create admin account'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              Already registered?{' '}
              <Link className="font-semibold text-[#007c72] hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
