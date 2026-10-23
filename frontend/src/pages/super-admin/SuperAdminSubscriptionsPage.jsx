import { useState } from 'react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import {
  fetchCompanies,
  fetchPlans,
  fetchSubscriptions,
  saveSubscription,
} from '../../services/superAdminService.js'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Notice,
} from '../../components/index.js'

const dateLabel = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString()
}

const STATUS_VARIANTS = {
  active: 'success',
  trialing: 'info',
  canceled: 'error',
  expired: 'warning',
}

export default function SuperAdminSubscriptionsPage() {
  const subscriptions = useSuperAdminResource(fetchSubscriptions)
  const companies = useSuperAdminResource(fetchCompanies)
  const plans = useSuperAdminResource(fetchPlans)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ company_id: '', plan_id: '', status: 'active' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const openCreate = () => {
    setForm({ company_id: '', plan_id: '', status: 'active' })
    setErrors({})
    setFormError('')
    setShowCreate(true)
  }

  const handleSave = async () => {
    const nextErrors = {}
    if (!form.company_id) nextErrors.company_id = 'Select a company'
    if (!form.plan_id) nextErrors.plan_id = 'Select a plan'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)
    setFormError('')
    try {
      await saveSubscription({
        company_id: Number(form.company_id),
        plan_id: Number(form.plan_id),
        status: form.status,
        starts_at: new Date().toISOString().slice(0, 10),
      })
      setShowCreate(false)
      setNotice('The subscription was saved.')
      await subscriptions.reload()
    } catch (error) {
      setFormError(error.message || 'The subscription could not be saved.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Subscriptions
          </h1>
          <p className="text-sm text-gray-500">
            The plan every company is subscribed to and the period it runs for.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Assign a plan
        </Button>
      </div>

      {notice && (
        <Notice type="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      {formError && !showCreate && (
        <Notice type="error" onDismiss={() => setFormError('')}>
          {formError}
        </Notice>
      )}

      <Card>
        {subscriptions.isLoading ? (
          <p className="text-sm text-gray-500">Loading subscriptions…</p>
        ) : subscriptions.error ? (
          <Notice type="error" title="The subscriptions could not be loaded.">
            {subscriptions.error.message}
          </Notice>
        ) : (subscriptions.data?.data || []).length === 0 ? (
          <EmptyState
            icon="Repeat"
            title="No subscriptions yet"
            description="Assign a plan to a company to start a subscription."
            action={
              <Button variant="primary" onClick={openCreate}>
                Assign a plan
              </Button>
            }
          />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Starts</th>
                  <th>Ends</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.data.data.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {subscription.company?.name}
                    </td>
                    <td>{subscription.plan?.name}</td>
                    <td>
                      <Badge variant={STATUS_VARIANTS[subscription.status] || 'info'}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td>{dateLabel(subscription.starts_at)}</td>
                    <td>{dateLabel(subscription.ends_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Assign a plan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} loading={isSaving}>
              Save subscription
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <Notice type="error">{formError}</Notice>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <select
              value={form.company_id}
              onChange={(event) => setForm({ ...form, company_id: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a company</option>
              {(companies.data?.data || []).map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {errors.company_id && <p className="error mt-1">{errors.company_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plan
            </label>
            <select
              value={form.plan_id}
              onChange={(event) => setForm({ ...form, plan_id: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a plan</option>
              {(plans.data?.data || []).map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
            {errors.plan_id && <p className="error mt-1">{errors.plan_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
