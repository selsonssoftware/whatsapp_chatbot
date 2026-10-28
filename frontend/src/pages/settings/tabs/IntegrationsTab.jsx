import { useCallback, useEffect, useRef, useState } from 'react'
import { Banner, Button, Card, ConfirmDialog, EmptyState, Modal, SectionState, SelectInput, StatusBadge, TextInput, formatDate } from '../ui.jsx'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi, ApiError } from '../../../services/settingsApi.js'

// Defence in depth: never render anything that looks like a credential, even if the API sends it.
const SENSITIVE = /token|secret|password|passwd|private|credential|authorization|api[_-]?key/i
const safeDiagnostics = (obj) =>
  Object.entries(obj || {}).filter(([k, v]) => !SENSITIVE.test(k) && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'))

export default function IntegrationsTab() {
  const { can, notify, goTo } = useSettings()
  const canManage = !!can.manageIntegrations
  const [state, setState] = useState({ status: 'loading', items: [], whatsapp: null, error: null })
  const [configure, setConfigure] = useState(null) // { item, values }
  const [formErrors, setFormErrors] = useState({})
  const [confirm, setConfirm] = useState(null) // item to disconnect
  const [busyKey, setBusyKey] = useState(null)
  const [testResults, setTestResults] = useState({}) // key -> { ok, message }
  const mounted = useRef(true)

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    const [list, wa] = await Promise.allSettled([settingsApi.integrations.list(), settingsApi.whatsapp.status()])
    if (!mounted.current) return
    if (list.status === 'rejected') {
      setState({ status: 'error', items: [], whatsapp: null, error: list.reason?.message || 'Could not load integrations.' })
      return
    }
    setState({
      status: 'ready',
      items: (Array.isArray(list.value) ? list.value : list.value?.items || []).filter((i) => i.key !== 'whatsapp'),
      whatsapp: wa.status === 'fulfilled' ? wa.value : null,
      error: null,
    })
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  const act = async (key, fn, okMsg, onOk) => {
    if (busyKey) return
    setBusyKey(key)
    setFormErrors({})
    try {
      const res = await fn()
      await load()
      if (okMsg) notify('success', okMsg)
      onOk?.(res)
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        const flat = {}
        Object.entries(e.errors).forEach(([k, v]) => {
          flat[k.replace(/^config\./, '')] = Array.isArray(v) ? v[0] : String(v)
        })
        setFormErrors(flat)
      }
      notify('error', e.message || 'Action failed.')
    } finally {
      if (mounted.current) setBusyKey(null)
    }
  }

  const test = async (item) => {
    setBusyKey(item.key)
    try {
      const res = await settingsApi.integrations.test(item.key)
      setTestResults((r) => ({ ...r, [item.key]: { ok: res?.ok !== false, message: res?.message || (res?.ok === false ? 'Test failed.' : 'Test passed.') } }))
    } catch (e) {
      setTestResults((r) => ({ ...r, [item.key]: { ok: false, message: e.message || 'Test failed.' } }))
    } finally {
      if (mounted.current) setBusyKey(null)
    }
  }

  const openConfigure = (item) => {
    setFormErrors({})
    setConfigure({ item, values: {} }) // secret values are never prefilled
  }

  const submitConfigure = () => {
    const { item, values } = configure
    const e = {}
    ;(item.configFields || []).forEach((f) => {
      if (f.required && !String(values[f.name] ?? '').trim()) e[f.name] = `${f.label} is required.`
    })
    if (Object.keys(e).length) return setFormErrors(e)
    return act(item.key, () => settingsApi.integrations.connect(item.key, values), `${item.name} saved.`, () => setConfigure(null))
  }

  const wa = state.whatsapp

  return (
    <SectionState status={state.status} error={state.error} onRetry={load}>
      <div className="space-y-4">
        <Card
          title="WhatsApp Cloud API"
          actions={<StatusBadge status={wa?.status || 'disconnected'} />}
          description="Managed from the WhatsApp Business tab."
        >
          {wa === null && <Banner kind="warning">Could not read the WhatsApp connection status.</Banner>}
          {wa && (
            <div className="text-[11px] text-slate-500 space-y-0.5">
              <div>Account ID: <b>{wa.wabaId || '—'}</b></div>
              <div>Phone: <b>{wa.phoneNumber || '—'}</b></div>
              {wa.errorMessage && <div className="text-red-600">{wa.errorMessage}</div>}
            </div>
          )}
          <Button variant="secondary" onClick={() => goTo('whatsapp')}>Manage connection</Button>
        </Card>

        {!state.items.length ? (
          <Card><EmptyState title="No other integrations available" description="Integrations enabled for your plan will appear here." /></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {state.items.map((item) => {
              const connected = item.status === 'connected'
              const busy = busyKey === item.key
              const diag = safeDiagnostics(item.diagnostics)
              const tr = testResults[item.key]
              return (
                <Card key={item.key} title={item.name} description={item.description} actions={<StatusBadge status={item.status} />}>
                  {item.status === 'error' && item.error && <Banner kind="error">{item.error}</Banner>}
                  {diag.length > 0 && (
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                      {diag.map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-slate-400">{k}</dt>
                          <dd className="font-medium text-slate-700 dark:text-slate-200 break-all">{String(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {item.lastCheckedAt && <p className="text-[10px] text-slate-400">Last checked: {formatDate(item.lastCheckedAt)}</p>}
                  {tr && <Banner kind={tr.ok ? 'success' : 'error'}>{tr.message}</Banner>}

                  {canManage ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {!connected && item.status !== 'pending' && item.status !== 'error' && (
                        <Button onClick={() => openConfigure(item)} disabled={!!busyKey}>Connect</Button>
                      )}
                      {connected && <Button variant="secondary" onClick={() => openConfigure(item)} disabled={!!busyKey}>Configure</Button>}
                      {(item.status === 'error' || item.status === 'pending') && (
                        <Button busy={busy} disabled={!!busyKey} onClick={() => act(item.key, () => settingsApi.integrations.reconnect(item.key), `${item.name} reconnected.`)}>
                          Reconnect
                        </Button>
                      )}
                      {item.status !== 'disconnected' && (
                        <Button variant="secondary" busy={busy} disabled={!!busyKey} onClick={() => test(item)}>Test</Button>
                      )}
                      {item.status !== 'disconnected' && (
                        <Button variant="danger" disabled={!!busyKey} onClick={() => setConfirm(item)}>Disconnect</Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">Only authorized team members can manage integrations.</p>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        <Modal
          open={!!configure}
          wide
          busy={!!busyKey}
          title={configure ? `Configure ${configure.item.name}` : ''}
          onClose={() => setConfigure(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfigure(null)} disabled={!!busyKey}>Cancel</Button>
              <Button onClick={submitConfigure} busy={!!busyKey}>Save</Button>
            </>
          }
        >
          {configure && (
            <>
              {!(configure.item.configFields || []).length && <p>No configuration is required. Click Save to connect.</p>}
              {(configure.item.configFields || []).map((f) =>
                f.type === 'select' ? (
                  <SelectInput
                    key={f.name}
                    label={f.label}
                    required={f.required}
                    value={configure.values[f.name]}
                    options={f.options || []}
                    placeholder="Select"
                    error={formErrors[f.name]}
                    onChange={(v) => setConfigure({ ...configure, values: { ...configure.values, [f.name]: v } })}
                  />
                ) : (
                  <TextInput
                    key={f.name}
                    label={f.label}
                    required={f.required}
                    type={f.type === 'secret' ? 'password' : 'text'}
                    autoComplete="off"
                    placeholder={f.type === 'secret' ? 'Stored securely on the server' : ''}
                    value={configure.values[f.name]}
                    error={formErrors[f.name]}
                    onChange={(v) => setConfigure({ ...configure, values: { ...configure.values, [f.name]: v } })}
                  />
                )
              )}
            </>
          )}
        </Modal>

        <ConfirmDialog
          open={!!confirm}
          danger
          busy={!!busyKey}
          title={`Disconnect ${confirm?.name || ''}?`}
          message="Features that depend on this integration will stop working."
          confirmLabel="Disconnect"
          onCancel={() => setConfirm(null)}
          onConfirm={() => act(confirm.key, () => settingsApi.integrations.disconnect(confirm.key), `${confirm.name} disconnected.`, () => setConfirm(null))}
        />
      </div>
    </SectionState>
  )
}
