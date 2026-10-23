import { useState } from 'react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import {
  createPayment,
  fetchPayments,
  fetchSubscriptions,
} from '../../services/superAdminService.js'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Notice,
} from '../../components/index.js'

const currency = (amount, code = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(Number(amount || 0))

const dateLabel = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString()
}

const STATUS_VARIANTS = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'info',
}

export default function SuperAdminPaymentsPage() {
  const payments = useSuperAdminResource(fetchPayments)
  const subscriptions = useSuperAdminResource(fetchSubscriptions)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    subscription_id: '',
    amount: '',
    currency: 'USD',
    method: 'manual',
    status: 'paid',
    reference: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedSubscription = (subscriptions.data?.data || []).find(
    (subscription) => String(subscription.id) === String(form.subscription_id)
  )

  const openCreate = () => {
    setForm({
      subscription_id: '',
      amount: '',
      currency: 'USD',
      method: 'manual',
      status: 'paid',
      reference: '',
    })
    setErrors({})
    setFormError('')
    setShowCreate(true)
  }

  const handleSave = async () => {
    const nextErrors = {}
    if (!form.subscription_id) nextErrors.subscription_id = 'Select a subscription'
    if (!form.amount || Number(form.amount) < 0) nextErrors.amount = 'Enter the collected amount'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)
    setFormError('')
    try {
      await createPayment({
        company_id: selectedSubscription.company.id,
        subscription_id: Number(form.subscription_id),
        amount: Number(form.amount),
        currency: form.currency,
        method: form.method,
        status: form.status,
        reference: form.reference.trim() || null,
      })
      setShowCreate(false)
      setNotice('The payment was recorded.')
      await payments.reload()
    } catch (error) {
      setFormError(error.message || 'The payment could not be recorded.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Payments</h1>
          <p className="text-sm text-gray-500">
            Payments collected for the subscription of a company.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Record a payment
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
        {payments.isLoading ? (
          <p className="text-sm text-gray-500">Loading payments…</p>
        ) : payments.error ? (
          <Notice type="error" title="The payments could not be loaded.">
            {payments.error.message}
          </Notice>
        ) : (payments.data?.data || []).length === 0 ? (
          <EmptyState
            icon="CreditCard"
            title="No payments recorded"
            description="Record the payment of a company subscription to build up the revenue report."
            action={
              <Button variant="primary" onClick={openCreate}>
                Record a payment
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
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Paid at</th>
                </tr>
              </thead>
              <tbody>
                {payments.data.data.map((payment) => (
                  <tr key={payment.id}>
                    <td className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.company?.name}
                    </td>
                    <td>{payment.plan || '—'}</td>
                    <td>{currency(payment.amount, payment.currency || 'USD')}</td>
                    <td>{payment.method}</td>
                    <td>
                      <Badge variant={STATUS_VARIANTS[payment.status] || 'info'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td>{payment.reference || '—'}</td>
                    <td>{dateLabel(payment.paid_at)}</td>
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
        title="Record a payment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} loading={isSaving}>
              Save payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <Notice type="error">{formError}</Notice>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subscription
            </label>
            <select
              value={form.subscription_id}
              onChange={(event) => {
                const subscription = (subscriptions.data?.data || []).find(
                  (entry) => String(entry.id) === String(event.target.value)
                )
                setForm({
                  ...form,
                  subscription_id: event.target.value,
                  amount: subscription?.plan?.price_monthly || form.amount,
                })
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a subscription</option>
              {(subscriptions.data?.data || []).map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {subscription.company?.name} · {subscription.plan?.name}
                </option>
              ))}
            </select>
            {errors.subscription_id && <p className="error mt-1">{errors.subscription_id}</p>}
          </div>

          <Input
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            error={errors.amount}
          />

          <Input
            label="Reference"
            value={form.reference}
            onChange={(event) => setForm({ ...form, reference: event.target.value })}
            placeholder="Invoice or transfer reference"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <input
                value={form.currency}
                maxLength={3}
                onChange={(event) =>
                  setForm({ ...form, currency: event.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Method
              </label>
              <select
                value={form.method}
                onChange={(event) => setForm({ ...form, method: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="manual">Manual</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank transfer</option>
              </select>
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
