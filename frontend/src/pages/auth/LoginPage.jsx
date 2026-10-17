import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { DEMO_USERS } from '../../constants/roles.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleLogin = (u) => {
    login(u)
    navigate('/dashboard')
  }
  return (
    <div className="login-page">
      <h1>WhatsApp SaaS Demo</h1>
      <p>Quick Demo Login</p>
      <div className="demo-buttons">
        {DEMO_USERS.map((u) => (
          <button key={u.id} onClick={() => handleLogin(u)}>
            {u.role} - {u.name}
          </button>
        ))}
      </div>
    </div>
  )
}
