import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { SettingsContext } from './SettingsContext.jsx'
import { Banner, ConfirmDialog, LoadingState } from './ui.jsx'
import { settingsApi } from '../../services/settingsApi.js'
import GeneralTab from './tabs/GeneralTab.jsx'
import WhatsAppTab from './tabs/WhatsAppTab.jsx'
import MessagingTab from './tabs/MessagingTab.jsx'
import TeamTab from './tabs/TeamTab.jsx'
import IntegrationsTab from './tabs/IntegrationsTab.jsx'
import NotificationsTab from './tabs/NotificationsTab.jsx'
import SecurityTab from './tabs/SecurityTab.jsx'
import BillingTab from './tabs/BillingTab.jsx'
import AwayDataTab from './tabs/AwayDataTab.jsx'

const TABS = [
  { key: 'general', label: 'General', Component: GeneralTab },
  { key: 'whatsapp', label: 'WhatsApp Business', Component: WhatsAppTab },
  { key: 'messaging', label: 'Messaging', Component: MessagingTab },
  { key: 'team', label: 'Team & Permissions', Component: TeamTab },
  { key: 'integrations', label: 'Integrations', Component: IntegrationsTab },
  { key: 'notifications', label: 'Notifications', Component: NotificationsTab },
  { key: 'security', label: 'Security', Component: SecurityTab },
  { key: 'billing', label: 'Billing & Subscription', Component: BillingTab },
  { key: 'away', label: 'Away & Data', Component: AwayDataTab },
]

const TOAST_ICON = { success: CheckCircle2, error: AlertTriangle, info: Info }
const TOAST_TONE = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  error: 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  info: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [pendingTab, setPendingTab] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState(null)
  const [access, setAccess] = useState({ status: 'loading', can: {}, role: null, error: null })
  const timer = useRef(null)

  const loadAccess = useCallback(async (showLoading = true) => {
    if (showLoading) setAccess((a) => ({ ...a, status: 'loading', error: null }))
    try {
      const res = await settingsApi.access()
      setAccess({ status: 'ready', can: res?.can || {}, role: res?.role || null, error: null })
    } catch (e) {
      // Fail closed: without a confirmed permission set, everything is read-only.
      setAccess({ status: 'error', can: {}, role: null, error: e.message })
    }
  }, [])

  useEffect(() => {
    loadAccess(false)
  }, [loadAccess])

  const notify = useCallback((kind, message) => {
    clearTimeout(timer.current)
    setToast({ kind, message })
    timer.current = setTimeout(() => setToast(null), kind === 'error' ? 7000 : 4000)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Browser-level warning when closing/reloading with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  // Host app can handle the redirect; we only tell the user.
  useEffect(() => {
    const onExpired = () => notify('error', 'Your session has expired. Please log in again.')
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [notify])

  const requestTab = useCallback(
    (key) => {
      if (key === activeTab) return
      if (dirty) setPendingTab(key)
      else setActiveTab(key)
    },
    [activeTab, dirty]
  )

  const ctx = useMemo(() => ({ can: access.can, notify, goTo: requestTab }), [access.can, notify, requestTab])
  const Active = TABS.find((t) => t.key === activeTab)?.Component
  const ToastIcon = toast ? TOAST_ICON[toast.kind] : null

  return (
    <SettingsContext.Provider value={ctx}>
      <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your account, WhatsApp Business API, preferences and system configuration.
            </p>
          </div>
        </div>

        {/* Toast (live region) */}
        <div aria-live="polite" className="fixed top-4 right-4 z-[60] max-w-sm">
          {toast && (
            <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm shadow-lg ${TOAST_TONE[toast.kind]}`}>
              <ToastIcon className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button type="button" aria-label="Dismiss" onClick={() => setToast(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {access.status === 'error' && (
          <Banner kind="warning" onRetry={loadAccess}>
            Could not verify your permissions ({access.error}). Settings are shown read-only until this is resolved.
          </Banner>
        )}

        {/* Mobile: dropdown */}
        <div className="md:hidden">
          <label htmlFor="settings-tab-select" className="sr-only">Settings section</label>
          <select
            id="settings-tab-select"
            value={activeTab}
            onChange={(e) => requestTab(e.target.value)}
            className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
          >
            {TABS.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Tablet / desktop: tabs */}
        <div role="tablist" aria-label="Settings sections" className="hidden md:flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={activeTab === t.key}
              aria-controls="settings-panel"
              onClick={() => requestTab(t.key)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === t.key ? 'bg-[#00A884]/10 text-[#00A884] font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id="settings-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {access.status === 'loading' ? <LoadingState label="Checking permissions…" /> : Active && <Active key={activeTab} onDirtyChange={setDirty} />}
        </div>

        <ConfirmDialog
          open={!!pendingTab}
          title="Discard unsaved changes?"
          message="You have unsaved changes in this section. If you leave, they will be lost."
          confirmLabel="Discard and leave"
          danger
          onCancel={() => setPendingTab(null)}
          onConfirm={() => {
            setActiveTab(pendingTab)
            setPendingTab(null)
            setDirty(false)
          }}
        />
      </div>
    </SettingsContext.Provider>
  )
}
