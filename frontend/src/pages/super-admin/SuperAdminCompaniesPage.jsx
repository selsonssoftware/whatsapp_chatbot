import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import {
  createCompany,
  fetchCompanies,
  fetchPlans,
  updateCompany,
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

const dateLabel = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString()
}

export default function SuperAdminCompaniesPage() {
  const companies = useSuperAdminResource(fetchCompanies)
  const plans = useSuperAdminResource(fetchPlans)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', plan_id: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const openCreate = () => {
    setForm({ name: '', email: '', plan_id: '' })
    setErrors({})
    setFormError('')
    setShowCreate(true)
  }

  const handleCreate = async () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Company name is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid e-mail address'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)
    setFormError('')
    try {
      await createCompany({
        name: form.name.trim(),
        email: form.email.trim() || null,
        plan_id: form.plan_id ? Number(form.plan_id) : null,
      })
      setShowCreate(false)
      setNotice('The company was created.')
      await companies.reload()
    } catch (error) {
      setFormError(error.message || 'The company could not be created.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (company) => {
    const status = company.status === 'active' ? 'suspended' : 'active'
    try {
      await updateCompany(company.id, { status })
      setNotice(`${company.name} is now ${status}.`)
      await companies.reload()
    } catch (error) {
      setNotice('')
      setFormError(error.message || 'The company could not be updated.')
    }
  }

  return (
    <div className="page space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Companies</h1>
          <p className="text-sm text-gray-500">
            Every tenant of the platform and the plan it is subscribed to.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Building2 size={16} className="mr-2" />
          New company
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
        {companies.isLoading ? (
          <p className="text-sm text-gray-500">Loading companies…</p>
        ) : companies.error ? (
          <Notice type="error" title="The companies could not be loaded.">
            {companies.error.message}
          </Notice>
        ) : (companies.data?.data || []).length === 0 ? (
          <EmptyState
            icon="Building2"
            title="No companies yet"
            description="Create the first company to assign a plan and start the onboarding."
            action={
              <Button variant="primary" onClick={openCreate}>
                Create a company
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
                  <th>Admins</th>
                  <th>Created</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {companies.data.data.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {company.name}
                      </span>
                      {company.email && (
                        <span className="block text-xs text-gray-500">{company.email}</span>
                      )}
                    </td>
                    <td>{company.plan || '—'}</td>
                    <td>
                      <Badge variant={company.status === 'active' ? 'success' : 'warning'}>
                        {company.status}
                      </Badge>
                    </td>
                    <td>{company.admins}</td>
                    <td>{dateLabel(company.created_at)}</td>
                    <td className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(company)}
                      >
                        {company.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
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
        title="New company"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} loading={isSaving}>
              Create company
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && <Notice type="error">{formError}</Notice>}
          <Input
            label="Company name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            error={errors.name}
            placeholder="Acme Corp"
          />
          <Input
            label="Billing e-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            error={errors.email}
            placeholder="billing@acme.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plan
            </label>
            <select
              value={form.plan_id}
              onChange={(event) => setForm({ ...form, plan_id: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">No plan yet</option>
              {(plans.data?.data || []).map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
