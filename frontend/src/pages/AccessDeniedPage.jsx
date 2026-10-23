import { Link } from 'react-router-dom'
import { Button, Card, EmptyState, Icon } from '../components/index.js'
import { useAuth } from '../hooks/useAuth.js'

export default function AccessDeniedPage() {
  const { user } = useAuth()

  return (
    <div className="page">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access denied</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        You do not have permission to open this module.
      </p>
      <Card>
        <EmptyState
          icon="Shield"
          title="Restricted module"
          description={`This module is limited to admins and managers. You are signed in as ${user?.role || 'a guest'}.`}
          action={
            <Link to="/dashboard">
              <Button variant="primary">
                <Icon name="LayoutDashboard" size={16} />
                Back to Dashboard
              </Button>
            </Link>
          }
        />
      </Card>
    </div>
  )
}
