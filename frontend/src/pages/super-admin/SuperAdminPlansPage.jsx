import { Check } from 'lucide-react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import { fetchPlans } from '../../services/superAdminService.js'
import { Badge, Card, EmptyState, Notice } from '../../components/index.js'

const currency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount || 0))

export default function SuperAdminPlansPage() {
  const plans = useSuperAdminResource(fetchPlans)

  if (plans.isLoading) {
    return (
      <div className="page space-y-4">
        <p className="text-sm text-gray-500">Loading plans…</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (plans.error) {
    return (
      <div className="page">
        <Notice type="error" title="The plans could not be loaded.">
          {plans.error.message}
        </Notice>
      </div>
    )
  }

  const items = plans.data?.data || []

  return (
    <div className="page space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Plans</h1>
        <p className="text-sm text-gray-500">
          The subscription plans a company can be subscribed to and the features
          each plan includes.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon="Layers"
            title="No plans configured"
            description="Run the database seeder to create the Basic, Advance and Prime plans."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <Badge variant={plan.is_active ? 'success' : 'warning'}>
                  {plan.is_active ? 'active' : 'inactive'}
                </Badge>
              </div>

              <p className="mt-4 text-2xl font-bold text-brand-700">
                {currency(plan.price_monthly)}
                <span className="text-sm font-normal text-gray-500"> / month</span>
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {plan.companies} {plan.companies === 1 ? 'company' : 'companies'} on this plan
              </p>

              <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                {plan.features.length === 0 ? (
                  <li className="text-gray-400">No features included.</li>
                ) : (
                  plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check size={14} className="text-brand-600" aria-hidden="true" />
                      {feature.replace(/_/g, ' ')}
                    </li>
                  ))
                )}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
