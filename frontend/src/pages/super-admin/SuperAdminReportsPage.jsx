import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import { fetchReports } from '../../services/superAdminService.js'
import { Card, Notice } from '../../components/index.js'

const currency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount || 0))

function Breakdown({ title, rows, emptyLabel }) {
  return (
    <Card title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.status || row.plan} className="flex items-center justify-between text-sm">
              <span className="capitalize text-gray-700 dark:text-gray-200">
                {row.status || row.plan}
              </span>
              <span className="text-gray-500">
                {row.count !== undefined ? row.count : currency(row.collected_amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default function SuperAdminReportsPage() {
  const reports = useSuperAdminResource(fetchReports)

  if (reports.isLoading) {
    return (
      <div className="page space-y-4">
        <p className="text-sm text-gray-500">Loading reports…</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="skeleton h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (reports.error) {
    return (
      <div className="page">
        <Notice type="error" title="The reports could not be loaded.">
          {reports.error.message}
        </Notice>
      </div>
    )
  }

  const data = reports.data || {}

  return (
    <div className="page space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Reports</h1>
        <p className="text-sm text-gray-500">
          Aggregated platform figures, calculated from the stored companies,
          subscriptions and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Breakdown
          title="Companies by status"
          rows={data.companies_by_status || []}
          emptyLabel="No company has been created yet."
        />
        <Breakdown
          title="Subscriptions by status"
          rows={data.subscriptions_by_status || []}
          emptyLabel="No subscription has been created yet."
        />
        <Breakdown
          title="Payments by status"
          rows={data.payments_by_status || []}
          emptyLabel="No payment has been recorded yet."
        />
      </div>

      <Card title="Revenue by plan">
        {(data.revenue_by_plan || []).length === 0 ? (
          <p className="text-sm text-gray-500">No plan is in use yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Subscriptions</th>
                  <th>Collected</th>
                </tr>
              </thead>
              <tbody>
                {data.revenue_by_plan.map((row) => (
                  <tr key={row.plan}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">{row.plan}</td>
                    <td>{row.subscriptions}</td>
                    <td>{currency(row.collected_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Collected amount per month">
        {(data.monthly_revenue || []).length === 0 ? (
          <p className="text-sm text-gray-500">No payment has been recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.monthly_revenue.map((month) => (
              <li key={month.month} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-200">{month.month}</span>
                <span className="text-gray-500">{currency(month.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Accounts">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {data.admin_accounts ?? 0} company admin accounts exist on the platform.
        </p>
      </Card>
    </div>
  )
}
