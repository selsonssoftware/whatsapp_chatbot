import { useCallback, useEffect, useRef, useState } from 'react'
import { Link2, RefreshCw, Unlink } from 'lucide-react'
import { Banner, Button, Card, ConfirmDialog, SectionState, StatusBadge, formatDate } from '../ui.jsx'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi } from '../../../services/settingsApi.js'

let sdkPromise = null
function loadFacebookSdk(appId, version) {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const init = () => {
      window.FB.init({ appId, autoLogAppEvents: true, xfbml: false, version })
      resolve(window.FB)
    }
    if (window.FB) return init()
    window.fbAsyncInit = init
    const s = document.createElement('script')
    s.src = 'https://connect.facebook.net/en_US/sdk.js'
    s.async = true
    s.defer = true
    s.crossOrigin = 'anonymous'
    s.onerror = () => {
      sdkPromise = null
      reject(new Error('Could not load the Meta SDK. Disable ad/tracker blockers and try again.'))
    }
    document.body.appendChild(s)
    return undefined
  })
  return sdkPromise
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-800 dark:text-slate-100 text-right break-all">{children ?? '—'}</span>
    </div>
  )
}

export default function WhatsAppTab() {
  const { can, notify } = useSettings()
  const canManage = !!can.manageWhatsApp
  const [state, setState] = useState({ status: 'loading', info: null, error: null })
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState(null)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const mounted = useRef(true)
  const lock = useRef(false)

  const load = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const info = await settingsApi.whatsapp.status()
      if (mounted.current) setState({ status: 'ready', info, error: null })
    } catch (e) {
      if (mounted.current) setState((s) => ({ status: silent && s.info ? 'ready' : 'error', info: s.info, error: e.message }))
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  // While Meta/backend is still finishing the connection, poll the real status.
  const status = state.info?.status
  useEffect(() => {
    if (status !== 'pending') return undefined
    const t = setInterval(() => load(true), 10000)
    return () => clearInterval(t)
  }, [status, load])

  const startSignup = async () => {
    if (lock.current) return
    lock.current = true
    setConnecting(true)
    setConnectError(null)
    const session = {}
    const onMessage = (event) => {
      if (!/^https:\/\/(www|web)\.facebook\.com$/.test(event.origin)) return
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type !== 'WA_EMBEDDED_SIGNUP') return
        if (data.event === 'FINISH') {
          session.wabaId = data.data?.waba_id
          session.phoneNumberId = data.data?.phone_number_id
        } else if (data.event === 'CANCEL') {
          session.cancelled = true
        } else if (data.event === 'ERROR') {
          session.error = data.data?.error_message || 'Meta reported an error during signup.'
        }
      } catch {
        /* ignore non-JSON messages */
      }
    }
    window.addEventListener('message', onMessage)
    try {
      const cfg = await settingsApi.whatsapp.embeddedConfig()
      if (!cfg?.appId || !cfg?.configId) throw new Error('WhatsApp signup is not configured on the server yet.')
      const FB = await loadFacebookSdk(cfg.appId, cfg.graphVersion || 'v21.0')

      const response = await new Promise((resolve) =>
        FB.login((r) => resolve(r), {
          config_id: cfg.configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: { setup: {}, featureType: '', sessionInfoVersion: '3' },
        })
      )

      const code = response?.authResponse?.code
      if (session.error) throw new Error(session.error)
      if (!code || session.cancelled) {
        notify('info', 'WhatsApp connection was cancelled.')
        return
      }
      // The signup message can arrive slightly after the login callback.
      for (let i = 0; i < 20 && !session.wabaId; i += 1) await wait(150)

      // Only a short-lived authorization code goes to OUR server; it exchanges it for tokens.
      await settingsApi.whatsapp.connect({ code, wabaId: session.wabaId, phoneNumberId: session.phoneNumberId })
      await load(true)
      notify('info', 'Request sent. The connection status below comes from the server.')
    } catch (e) {
      setConnectError(e.message || 'Could not connect WhatsApp.')
      notify('error', e.message || 'Could not connect WhatsApp.')
    } finally {
      window.removeEventListener('message', onMessage)
      lock.current = false
      if (mounted.current) setConnecting(false)
    }
  }

  const disconnect = async () => {
    setDisconnecting(true)
    try {
      await settingsApi.whatsapp.disconnect()
      await load(true)
      notify('success', 'WhatsApp disconnected.')
      setConfirmDisconnect(false)
    } catch (e) {
      notify('error', e.message || 'Could not disconnect.')
    } finally {
      if (mounted.current) setDisconnecting(false)
    }
  }

  const info = state.info || {}
  const st = info.status || 'disconnected'

  return (
    <SectionState status={state.status} error={state.error} onRetry={() => load()}>
      <div className="space-y-4">
        {st === 'error' && (
          <Banner kind="error">
            {info.errorMessage || 'The WhatsApp connection has an error.'} Use Retry connection to try again.
          </Banner>
        )}
        {st === 'pending' && <Banner kind="info">Connection is pending. This page checks the status automatically.</Banner>}
        {connectError && (
          <Banner kind="error" onClose={() => setConnectError(null)}>
            {connectError}
          </Banner>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <Card
            title="WhatsApp Business Account"
            actions={
              <>
                <StatusBadge status={st} />
                <button type="button" onClick={() => load(true)} aria-label="Refresh status" className="text-slate-400 hover:text-slate-700">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </>
            }
          >
            <div>
              <Row label="Business account (WABA) ID">{info.wabaId}</Row>
              <Row label="Phone number">{info.phoneNumber}</Row>
              <Row label="Phone number ID">{info.phoneNumberId}</Row>
              <Row label="Display name">{info.displayName}</Row>
              <Row label="Business verification">{info.businessVerification}</Row>
              <Row label="Quality rating">{info.qualityRating}</Row>
              <Row label="Messaging tier">{info.messagingTier}</Row>
              <Row label="Connected since">{info.connectedAt ? formatDate(info.connectedAt) : null}</Row>
            </div>

            {canManage ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {st === 'disconnected' && (
                  <Button onClick={startSignup} busy={connecting}>
                    <Link2 className="w-3.5 h-3.5" /> Connect WhatsApp
                  </Button>
                )}
                {(st === 'error' || st === 'pending') && (
                  <Button onClick={startSignup} busy={connecting}>
                    <RefreshCw className="w-3.5 h-3.5" /> Retry connection
                  </Button>
                )}
                {st === 'connected' && (
                  <Button variant="secondary" onClick={startSignup} busy={connecting}>
                    <RefreshCw className="w-3.5 h-3.5" /> Reconnect
                  </Button>
                )}
                {st !== 'disconnected' && (
                  <Button variant="danger" onClick={() => setConfirmDisconnect(true)}>
                    <Unlink className="w-3.5 h-3.5" /> Disconnect
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 pt-2">Only authorized team members can connect or disconnect WhatsApp.</p>
            )}
          </Card>

          <Card title="Webhook & Status">
            <div>
              <Row label="Webhook">{info.webhook?.status ? <StatusBadge status={info.webhook.status} /> : null}</Row>
              <Row label="Last event received">{info.webhook?.lastEventAt ? formatDate(info.webhook.lastEventAt) : null}</Row>
              <Row label="Phone number status">{info.phoneStatus ? <StatusBadge status={info.phoneStatus} /> : null}</Row>
            </div>
            <p className="text-[11px] text-slate-400">
              Connection is completed with Meta's official Embedded Signup. Access tokens are stored only on the server and are never shown here.
            </p>
          </Card>
        </div>

        <ConfirmDialog
          open={confirmDisconnect}
          danger
          busy={disconnecting}
          title="Disconnect WhatsApp?"
          message="Campaigns and inbox messaging will stop working until you connect again."
          confirmLabel="Disconnect"
          onCancel={() => setConfirmDisconnect(false)}
          onConfirm={disconnect}
        />
      </div>
    </SectionState>
  )
}
