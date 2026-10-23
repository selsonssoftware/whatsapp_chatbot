import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useSuperAdminAuth } from '../../hooks/useSuperAdminAuth.js'
import { Button, Card, Notice } from '../../components/index.js'

const dateLabel = (value) => {
  if (!value) return 'Not recorded yet'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? 'Not recorded yet' : parsed.toLocaleString()
}

/**
 * Settings of the Super Admin account and of the secure session it uses.
 */
export default function SuperAdminSettingsPage() {
  const { user, logout } = useSuperAdminAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500">
          The Super Admin account and the way it is authenticated.
        </p>
      </div>

      <Card title="Account">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">E-mail</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Login ID</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">
              {user?.user_id || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{user?.role}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Last sign in</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">
              {dateLabel(user?.last_login_at)}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Session">
        <Notice type="info">
          The console uses a server side session: the browser only holds the
          Laravel session cookie, every request is verified against the
          database and every write needs a CSRF token. Signing out destroys
          the session on the server immediately.
        </Notice>
        <Button variant="danger" className="mt-4" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          Sign out
        </Button>
      </Card>
    </div>
  )
}
