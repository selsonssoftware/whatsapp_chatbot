import { Building2, CreditCard, Layers, Repeat } from 'lucide-react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import { fetchSuperAdminDashboard } from '../../services/superAdminService.js'
import { Badge, Card, EmptyState, KPICard, Notice } from '../../components/index.js'

const currency = (amount, code = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(Number(amount || 0))

const dateLabel = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString()
}

export default function SuperAdminDashboardPage() {
  const { data, error, isLoading, reload } = useSuperAdminResource(fetchSuperAdminDashboard)

  if (isLoading) {
    return (
      <div className="page space-y-4">
        <p className="text-sm text-gray-500">Loading platform overview…</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="skeleton h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <Notice type="error" title="The platform overview could not be loaded.">
          {error.message}
        </Notice>
        <button className="btn btn-secondary" onClick={reload}>
          Try again
        </button>
      </div>
    )
  }

  const stats = data?.stats || {}
  const distribution = data?.plan_distribution || []

  return (
    <div className="page space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Companies" value={stats.companies ?? 0} icon={Building2} />
        <KPICard
          title="Active subscriptions"
          value={stats.active_subscriptions ?? 0}
          icon={Repeat}
        />
        <KPICard
          title="Collected amount"
          value={currency(stats.collected_amount)}
          icon={CreditCard}
        />
        <KPICard title="Plans" value={stats.plans ?? 0} icon={Layers} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Companies on each plan" className="xl:col-span-1">
          {distribution.length === 0 ? (
            <EmptyState
              size="sm"
              icon="Layers"
              title="No plans in use"
              description="No company is subscribed to a plan yet."
            />
          ) : (
            <ul className="space-y-3">
              {distribution.map((entry) => (
                <li key={entry.plan}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {entry.plan}
                    </span>
                    <span className="text-gray-500">{entry.companies}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{
                        width: `${stats.companies ? Math.round((entry.companies / stats.companies) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest companies" className="xl:col-span-2">
          {(data?.companies || []).length === 0 ? (
            <EmptyState
              size="sm"
              icon="Building2"
              title="No companies yet"
              description="Create the first company to start managing subscriptions."
            />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.companies.map((company) => (
                    <tr key={company.id}>
                      <td className="font-medium text-gray-900 dark:text-gray-100">
                        {company.name}
                      </td>
                      <td>{company.plan || '—'}</td>
                      <td>
                        <Badge variant={company.status === 'active' ? 'success' : 'warning'}>
                          {company.status}
                        </Badge>
                      </td>
                      <td>{dateLabel(company.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Card title="Latest payments">
        {(data?.recent_payments || []).length === 0 ? (
          <EmptyState
            size="sm"
            icon="CreditCard"
            title="No payments recorded"
            description="Payments recorded for a company subscription appear here."
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid at</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.company?.name}
                    </td>
                    <td>{payment.plan || '—'}</td>
                    <td>{currency(payment.amount, payment.currency || 'USD')}</td>
                    <td>
                      <Badge variant={payment.status === 'paid' ? 'success' : 'warning'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td>{dateLabel(payment.paid_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
