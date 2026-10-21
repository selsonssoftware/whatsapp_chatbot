import { useNavigate } from 'react-router-dom'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { USERS } from '../../constants/roles.js'

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (u) => {
    login(u)
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">
            <MessageSquare size={20} />
          </span>
          <span className="login-brand-name">Blast WhatsApp</span>
        </div>

        <h1 className="login-title">Sign in to your workspace</h1>
        <p className="login-subtitle">Choose an account to continue</p>

        <div className="login-buttons">
          {USERS.map((u) => (
            <button key={u.id} type="button" className="login-role" onClick={() => handleLogin(u)}>
              <span className="login-role-avatar" aria-hidden="true">
                {initials(u.name)}
              </span>
              <span className="login-role-meta">
                <span className="login-role-name">{u.name}</span>
                <span className="login-role-email">{u.email}</span>
              </span>
              <span className="role-badge">{u.role}</span>
              <ArrowRight size={16} className="login-role-arrow" />
            </button>
          ))}
        </div>

        <p className="login-note">Workspace data is stored in this browser only.</p>
      </div>
    </div>
  )
}
