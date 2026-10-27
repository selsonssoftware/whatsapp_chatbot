import { useCallback, useEffect, useRef, useState } from 'react'
import { Banner, Button, Card, ConfirmDialog, EmptyState, SectionState, TextInput, formatDate } from '../ui.jsx'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi, ApiError } from '../../../services/settingsApi.js'

const EMPTY_PW = { current_password: '', password: '', password_confirmation: '' }

function flat(errors) {
  const out = {}
  Object.entries(errors || {}).forEach(([k, v]) => {
    out[k] = Array.isArray(v) ? v[0] : String(v)
  })
  return out
}

export default function SecurityTab({ onDirtyChange }) {
  const { notify } = useSettings()
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [pw, setPw] = useState(EMPTY_PW)
  const [pwErrors, setPwErrors] = useState({})
  const [pwBusy, setPwBusy] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [confirmOthers, setConfirmOthers] = useState(false)
  const [tf, setTf] = useState({ step: 'idle', setup: null, code: '', error: null, busy: false })
  const mounted = useRef(true)
  const dirtyCb = useRef(onDirtyChange)
  dirtyCb.current = onDirtyChange

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const data = await settingsApi.security.overview()
      if (mounted.current) setState({ status: 'ready', data, error: null })
    } catch (e) {
      if (mounted.current) setState({ status: 'error', data: null, error: e.message })
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
      dirtyCb.current?.(false)
    }
  }, [load])

  const pwDirty = Object.values(pw).some(Boolean)
  useEffect(() => {
    dirtyCb.current?.(pwDirty)
  }, [pwDirty])

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwBusy) return
    const errs = {}
    if (!pw.current_password) errs.current_password = 'Enter your current password.'
    if (pw.password.length < 8) errs.password = 'New password must be at least 8 characters.'
    else if (pw.password === pw.current_password) errs.password = 'New password must be different from the current one.'
    if (pw.password !== pw.password_confirmation) errs.password_confirmation = 'Passwords do not match.'
    if (Object.keys(errs).length) return setPwErrors(errs)
    setPwErrors({})
    setPwBusy(true)
    try {
      await settingsApi.security.changePassword(pw)
      setPw(EMPTY_PW)
      notify('success', 'Password changed.')
      load()
    } catch (err) {
      if (err instanceof ApiError) setPwErrors(flat(err.errors))
      notify('error', err.message || 'Could not change password.')
    } finally {
      if (mounted.current) setPwBusy(false)
    }
    return undefined
  }

  const revoke = async (id) => {
    setBusyId(id)
    try {
      await settingsApi.security.revokeSession(id)
      notify('success', 'Session signed out.')
      await load()
    } catch (e) {
      notify('error', e.message || 'Could not sign out session.')
    } finally {
      if (mounted.current) setBusyId(null)
    }
  }

  const revokeOthers = async () => {
    setBusyId('others')
    try {
      await settingsApi.security.revokeOtherSessions()
      notify('success', 'Signed out of all other sessions.')
      setConfirmOthers(false)
      await load()
    } catch (e) {
      notify('error', e.message || 'Could not sign out other sessions.')
    } finally {
      if (mounted.current) setBusyId(null)
    }
  }

  // ----- two-factor (only when backend reports support) -----
  const tfRun = async (fn, after) => {
    setTf((t) => ({ ...t, busy: true, error: null }))
    try {
      const res = await fn()
      after?.(res)
    } catch (e) {
      setTf((t) => ({ ...t, error: e.message || 'Request failed.' }))
    } finally {
      if (mounted.current) setTf((t) => ({ ...t, busy: false }))
    }
  }

  const d = state.data || {}
  const sessions = d.sessions || []
  const activity = d.activity || []
  const others = sessions.filter((s) => !s.current)

  return (
    <SectionState status={state.status} error={state.error} onRetry={load}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Card title="Change Password" description={d.passwordChangedAt ? `Last changed ${formatDate(d.passwordChangedAt)}` : undefined}>
          <form onSubmit={changePassword} className="space-y-3" autoComplete="off">
            <TextInput label="Current password" required type="password" autoComplete="current-password" value={pw.current_password} onChange={(v) => setPw({ ...pw, current_password: v })} error={pwErrors.current_password} />
            <TextInput label="New password" required type="password" autoComplete="new-password" hint="At least 8 characters." value={pw.password} onChange={(v) => setPw({ ...pw, password: v })} error={pwErrors.password} />
            <TextInput label="Confirm new password" required type="password" autoComplete="new-password" value={pw.password_confirmation} onChange={(v) => setPw({ ...pw, password_confirmation: v })} error={pwErrors.password_confirmation} />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setPw(EMPTY_PW); setPwErrors({}) }} disabled={!pwDirty || pwBusy}>Cancel</Button>
              <button type="submit" disabled={pwBusy || !pwDirty} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white disabled:opacity-50">
                {pwBusy ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </Card>

        <Card title="Two-Factor Authentication">
          {!d.twoFactor?.supported ? (
            <p className="text-slate-400">Two-factor authentication is not available for your account.</p>
          ) : (
            <>
              <p>
                Status: <b>{d.twoFactor.enabled ? 'Enabled' : 'Disabled'}</b>
              </p>
              {tf.error && <Banner kind="error">{tf.error}</Banner>}
              {tf.step === 'idle' && !d.twoFactor.enabled && (
                <Button busy={tf.busy} onClick={() => tfRun(() => settingsApi.security.twoFactorSetup(), (res) => setTf((t) => ({ ...t, step: 'confirm', setup: res, code: '' })))}>
                  Set up
                </Button>
              )}
              {tf.step === 'confirm' && (
                <div className="space-y-2">
                  {tf.setup?.qrImageUrl && <img src={tf.setup.qrImageUrl} alt="Scan with your authenticator app" className="w-36 h-36 border rounded-lg" />}
                  {tf.setup?.manualKey && <p className="break-all">Manual key: <code>{tf.setup.manualKey}</code></p>}
                  <TextInput label="6-digit code" inputMode="numeric" maxLength={6} value={tf.code} onChange={(v) => setTf((t) => ({ ...t, code: v.replace(/\D/g, '') }))} />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setTf({ step: 'idle', setup: null, code: '', error: null, busy: false })}>Cancel</Button>
                    <Button busy={tf.busy} disabled={tf.code.length !== 6} onClick={() => tfRun(() => settingsApi.security.twoFactorConfirm(tf.code), () => { setTf({ step: 'idle', setup: null, code: '', error: null, busy: false }); notify('success', 'Two-factor authentication enabled.'); load() })}>
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
              {tf.step === 'idle' && d.twoFactor.enabled && (
                <Button variant="danger" onClick={() => setTf((t) => ({ ...t, step: 'disable', code: '' }))}>Disable</Button>
              )}
              {tf.step === 'disable' && (
                <div className="space-y-2">
                  <TextInput label="Enter a code to disable" inputMode="numeric" maxLength={6} value={tf.code} onChange={(v) => setTf((t) => ({ ...t, code: v.replace(/\D/g, '') }))} />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setTf({ step: 'idle', setup: null, code: '', error: null, busy: false })}>Cancel</Button>
                    <Button variant="danger" busy={tf.busy} disabled={tf.code.length !== 6} onClick={() => tfRun(() => settingsApi.security.twoFactorDisable(tf.code), () => { setTf({ step: 'idle', setup: null, code: '', error: null, busy: false }); notify('success', 'Two-factor authentication disabled.'); load() })}>
                      Disable
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        <Card
          title="Active Sessions"
          actions={others.length > 0 && <Button variant="secondary" onClick={() => setConfirmOthers(true)}>Sign out others</Button>}
        >
          {!sessions.length ? (
            <EmptyState title="No session data available" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {s.device || 'Unknown device'} {s.current && <span className="text-[10px] text-emerald-600">(this device)</span>}
                    </p>
                    <p className="text-[11px] text-slate-400">{[s.ip, s.location].filter(Boolean).join(' · ')} · {formatDate(s.lastActive)}</p>
                  </div>
                  {!s.current && (
                    <Button variant="secondary" busy={busyId === s.id} disabled={!!busyId} onClick={() => revoke(s.id)}>Sign out</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent Login & Audit Activity">
          {!activity.length ? (
            <EmptyState title="No activity recorded" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {activity.map((a) => (
                <li key={a.id} className="py-2 flex justify-between gap-3">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{a.event}</span>
                  <span className="text-[11px] text-slate-400 text-right">{[a.ip, formatDate(a.at)].filter(Boolean).join(' · ')}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <ConfirmDialog
          open={confirmOthers}
          busy={busyId === 'others'}
          title="Sign out other sessions?"
          message="You will stay signed in here. All other devices will be signed out."
          confirmLabel="Sign out others"
          onCancel={() => setConfirmOthers(false)}
          onConfirm={revokeOthers}
        />
      </div>
    </SectionState>
  )
}
