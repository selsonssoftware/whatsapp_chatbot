import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Banner, Button, Card, EmptyState, SectionState, StatusBadge, formatDate } from '../ui.jsx'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi } from '../../../services/settingsApi.js'

function Usage({ item }) {
  const unlimited = item.limit === null || item.limit === undefined
  const pct = unlimited || !item.limit ? 0 : Math.min(100, Math.round((item.used / item.limit) * 100))
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span>{item.label}</span>
        <span className="font-semibold">
          {Number(item.used || 0).toLocaleString()} / {unlimited ? 'Unlimited' : Number(item.limit).toLocaleString()}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : 'bg-[#00A884]'}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}

export default function BillingTab() {
  const { can, notify } = useSettings()
  const [sub, setSub] = useState({ status: 'loading', data: null, error: null })
  const [pay, setPay] = useState({ status: 'loading', items: [], error: null })
  const [upgrading, setUpgrading] = useState(null)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    setSub((s) => ({ ...s, status: 'loading', error: null }))
    setPay((p) => ({ ...p, status: 'loading', error: null }))
    const [s, p] = await Promise.allSettled([settingsApi.billing.subscription(), settingsApi.billing.payments()])
    if (!mounted.current) return
    setSub(s.status === 'fulfilled' ? { status: 'ready', data: s.value, error: null } : { status: 'error', data: null, error: s.reason?.message })
    setPay(
      p.status === 'fulfilled'
        ? { status: 'ready', items: Array.isArray(p.value) ? p.value : p.value?.items || [], error: null }
        : { status: 'error', items: [], error: p.reason?.message }
    )
  }, [])

  useEffect(() => {
    mounted.current = true
    const timer = window.setTimeout(load, 0)
    return () => {
      window.clearTimeout(timer)
      mounted.current = false
    }
  }, [load])

  const upgrade = async (plan) => {
    if (upgrading) return
    setUpgrading(plan)
    try {
      const res = await settingsApi.billing.requestUpgrade(plan)
      if (res?.checkoutUrl && /^https:\/\//i.test(res.checkoutUrl)) {
        window.location.assign(res.checkoutUrl)
        return
      }
      notify('success', res?.message || 'Upgrade request submitted.')
      load()
    } catch (e) {
      notify('error', e.message || 'Could not start the upgrade.')
    } finally {
      if (mounted.current) setUpgrading(null)
    }
  }

  const d = sub.data || {}
  const features = d.features || []
  const usage = d.usage || []

  return (
    <SectionState status={sub.status} error={sub.error} onRetry={load}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card title="Current Plan" actions={<StatusBadge status={d.status || 'inactive'} />}>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{d.plan || '—'}</p>
          <dl className="grid grid-cols-2 gap-y-1.5 gap-x-3">
            <dt className="text-slate-400">Start date</dt>
            <dd className="font-semibold text-right">{formatDate(d.startDate, false)}</dd>
            <dt className="text-slate-400">Expiry date</dt>
            <dd className="font-semibold text-right">{formatDate(d.expiryDate, false)}</dd>
            <dt className="text-slate-400">Renewal</dt>
            <dd className="font-semibold text-right">
              {d.renewal ? `${d.renewal.autoRenew ? 'Auto-renews' : 'Manual renewal'}${d.renewal.nextRenewalDate ? ` · ${formatDate(d.renewal.nextRenewalDate, false)}` : ''}` : '—'}
            </dd>
          </dl>

          {d.upgradeEnabled && can.manageBilling && (d.availablePlans || []).length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] text-slate-400">Upgrade options</p>
              <div className="flex flex-wrap gap-2">
                {d.availablePlans.map((p) => (
                  <Button key={p.key} variant="secondary" busy={upgrading === p.key} disabled={!!upgrading} onClick={() => upgrade(p.key)}>
                    Upgrade to {p.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title="Usage Limits">
          {!usage.length ? <EmptyState title="No usage data available" /> : <div className="space-y-3">{usage.map((u) => <Usage key={u.key || u.label} item={u} />)}</div>}
        </Card>

        <Card title="Plan Features">
          {!features.length ? (
            <EmptyState title="No feature information available" />
          ) : (
            <ul className="space-y-1.5">
              {features.map((f) => (
                <li key={f.label} className={`flex items-center gap-2 ${f.included ? '' : 'text-slate-400'}`}>
                  {f.included ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{f.label}</span>
                  {!f.included && <span className="text-[10px]">(not included)</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Payment History">
          {pay.status === 'loading' && <p className="text-slate-400">Loading…</p>}
          {pay.status === 'error' && <Banner kind="error" onRetry={load}>{pay.error || 'Could not load payment history.'}</Banner>}
          {pay.status === 'ready' && !pay.items.length && <EmptyState title="No payment records yet" />}
          {pay.status === 'ready' && pay.items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400">
                  <tr><th className="py-1.5 pr-2">Date</th><th className="py-1.5 pr-2">Description</th><th className="py-1.5 pr-2 text-right">Amount</th><th className="py-1.5">Status</th></tr>
                </thead>
                <tbody>
                  {pay.items.map((p) => (
                    <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-1.5 pr-2">{formatDate(p.date, false)}</td>
                      <td className="py-1.5 pr-2">{p.description || '—'}</td>
                      <td className="py-1.5 pr-2 text-right font-semibold">{p.amount != null ? `${p.currency || ''} ${Number(p.amount).toLocaleString()}`.trim() : '—'}</td>
                      <td className="py-1.5"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </SectionState>
  )
}
