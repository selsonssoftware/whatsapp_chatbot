import { Card, Button, Icon } from '../components/index.js'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <Card className="not-found">
        <div className="not-found-code" aria-hidden="true">404</div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          <Icon name="LayoutDashboard" size={16} className="inline mr-1" />
          Back to dashboard
        </Button>
      </Card>
    </div>
  )
}
