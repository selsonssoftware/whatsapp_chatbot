import { useMemo, useState } from 'react'
import { useSuperAdminResource } from '../../hooks/useSuperAdminResource.js'
import { fetchFeatureControls, setFeatureControl } from '../../services/superAdminService.js'
import { Badge, Card, EmptyState, Notice } from '../../components/index.js'

export default function SuperAdminFeatureControlsPage() {
  const controls = useSuperAdminResource(fetchFeatureControls)
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [pendingFeature, setPendingFeature] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const companies = useMemo(() => controls.data?.data || [], [controls.data])
  const features = controls.data?.features || {}

  const selected = useMemo(() => {
    const match = companies.find((entry) => String(entry.company.id) === String(selectedCompanyId))
    return match || companies[0] || null
  }, [companies, selectedCompanyId])

  const isEnabled = (feature) => {
    if (!selected) return false
    if (Object.prototype.hasOwnProperty.call(selected.overrides || {}, feature)) {
      return Boolean(selected.overrides[feature])
    }
    return Boolean(selected.plan?.features?.includes(feature))
  }

  const handleToggle = async (feature) => {
    if (!selected) return
    setPendingFeature(feature)
    setError('')
    setNotice('')
    try {
      await setFeatureControl({
        company_id: selected.company.id,
        feature,
        enabled: !isEnabled(feature),
      })
      setNotice('The feature permission was saved.')
      await controls.reload()
    } catch (err) {
      setError(err.message || 'The feature permission could not be saved.')
    } finally {
      setPendingFeature('')
    }
  }

  if (controls.isLoading) {
    return (
      <div className="page space-y-4">
        <p className="text-sm text-gray-500">Loading feature controls…</p>
        <div className="skeleton h-72" />
      </div>
    )
  }

  if (controls.error) {
    return (
      <div className="page">
        <Notice type="error" title="The feature controls could not be loaded.">
          {controls.error.message}
        </Notice>
      </div>
    )
  }

  return (
    <div className="page space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Feature Controls
        </h1>
        <p className="text-sm text-gray-500">
          Grant or revoke a platform feature for a single company. An override
          always wins over the features included in the plan.
        </p>
      </div>

      {notice && (
        <Notice type="success" onDismiss={() => setNotice('')}>
          {notice}
        </Notice>
      )}
      {error && (
        <Notice type="error" onDismiss={() => setError('')}>
          {error}
        </Notice>
      )}

      {companies.length === 0 ? (
        <Card>
          <EmptyState
            icon="SlidersHorizontal"
            title="No companies to configure"
            description="Create a company first, then manage the features it may use."
          />
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <label
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="feature-controls-company"
            >
              Company
            </label>
            <select
              id="feature-controls-company"
              value={String(selected?.company.id || '')}
              onChange={(event) => setSelectedCompanyId(event.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {companies.map((entry) => (
                <option key={entry.company.id} value={entry.company.id}>
                  {entry.company.name}
                </option>
              ))}
            </select>
            {selected?.plan ? (
              <Badge variant="info">{selected.plan.name} plan</Badge>
            ) : (
              <Badge variant="warning">No plan</Badge>
            )}
          </div>

          <Card>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {Object.entries(features).map(([key, label]) => {
                const enabled = isEnabled(key)
                const isPending = pendingFeature === key
                const overridden = Object.prototype.hasOwnProperty.call(
                  selected?.overrides || {},
                  key
                )

                return (
                  <li
                    key={key}
                    className="flex items-center justify-between gap-4 py-3 flex-wrap"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {overridden
                          ? 'Overridden for this company'
                          : enabled
                            ? 'Included in the plan'
                            : 'Not included in the plan'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      aria-label={`${label} for ${selected?.company.name}`}
                      disabled={isPending}
                      onClick={() => handleToggle(key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                        enabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                      } ${isPending ? 'opacity-60 cursor-wait' : ''}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </>
      )}
    </div>
  )
}
