import { useState } from 'react'
import { Card, Button, Badge, Icon, Modal } from '../../components/index.js'

const INTEGRATIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Send and receive WhatsApp Business messages',
    icon: 'MessageSquare',
    fields: [
      { key: 'phoneNumberId', label: 'Phone Number ID', secret: false },
      { key: 'businessAccountId', label: 'Business Account ID', secret: false },
      { key: 'apiToken', label: 'API Token', secret: true },
    ],
  },
  {
    id: 'backend',
    name: 'Laravel Backend API',
    description: 'Point the frontend at the Laravel API once it is available',
    icon: 'Code',
    fields: [
      { key: 'apiUrl', label: 'API Base URL', secret: false },
      { key: 'apiToken', label: 'API Token', secret: true },
    ],
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Receive delivery, read and inbound message events',
    icon: 'Webhook',
    fields: [
      { key: 'callbackUrl', label: 'Callback URL', secret: false },
      { key: 'signingSecret', label: 'Signing Secret', secret: true },
    ],
  },
  {
    id: 'ai',
    name: 'AI Provider',
    description: 'Configure the model used by AI Agent responses',
    icon: 'Sparkles',
    fields: [
      { key: 'provider', label: 'Provider', secret: false },
      { key: 'model', label: 'Model', secret: false },
      { key: 'apiKey', label: 'API Key', secret: true },
    ],
  },
  {
    id: 'payment',
    name: 'Payment Gateway',
    description: 'Collect payments through WhatsApp payment links',
    icon: 'CreditCard',
    fields: [
      { key: 'provider', label: 'Provider', secret: false },
      { key: 'publishableKey', label: 'Publishable Key', secret: false },
      { key: 'secretKey', label: 'Secret Key', secret: true },
    ],
  },
  {
    id: 'email',
    name: 'Email Provider',
    description: 'Send transactional emails from campaigns and notifications',
    icon: 'Mail',
    fields: [
      { key: 'provider', label: 'Provider', secret: false },
      { key: 'fromEmail', label: 'From Email', secret: false },
      { key: 'apiKey', label: 'API Key', secret: true },
    ],
  },
]

const SETTINGS_KEY = 'wa_integration_settings'

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function IntegrationsPage() {
  const [settings, setSettings] = useState(() => readSettings())
  const [selected, setSelected] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState({})
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)

  const openConfig = (integration) => {
    setSelected(integration)
    const stored = settings[integration.id] || {}
    setConfig(Object.fromEntries(integration.fields.map((f) => [f.key, stored[f.key] || ''])))
    setErrors({})
    setNotice(null)
    setShowConfig(true)
  }

  const testConnection = () => {
    const missing = selected.fields.filter((f) => !String(config[f.key] || '').trim()).map((f) => f.label)
    if (missing.length) {
      setErrors(Object.fromEntries(selected.fields.map((f) => [f.key, missing.includes(f.label) ? 'Required' : ''])))
      setNotice({ type: 'error', message: `Add ${missing.join(', ')} before running the simulated test.` })
      return
    }
    setErrors({})
    setNotice({
      type: 'info',
      message: 'Simulated test completed locally. No external request was made and nothing is connected.',
    })
  }

  const saveConfig = () => {
    const missing = selected.fields.filter((f) => !String(config[f.key] || '').trim()).map((f) => f.label)
    if (missing.length) {
      setErrors(Object.fromEntries(selected.fields.map((f) => [f.key, missing.includes(f.label) ? 'Required' : ''])))
      return
    }
    const secrets = selected.fields.filter((f) => f.secret).map((f) => f.key)
    const safeConfig = Object.fromEntries(
      Object.entries(config).map(([key, value]) => [key, secrets.includes(key) ? '••••••••' : value])
    )
    const next = { ...settings, [selected.id]: { ...safeConfig, lastTested: 'Simulated (local)', savedAt: new Date().toISOString().slice(0, 10) } }
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    setShowConfig(false)
    setNotice({ type: 'success', message: `${selected.name} configuration saved locally. Secrets are masked and never sent anywhere.` })
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure third-party service integrations</p>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-4 px-4 py-3 rounded-md border text-sm ${
            notice.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : notice.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
          }`}
          role="status"
        >
          {notice.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTEGRATIONS.map((integration) => {
          const stored = settings[integration.id]
          return (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Icon name={integration.icon} size={24} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                  </div>
                </div>
                <Badge variant={stored ? 'info' : 'warning'}>{stored ? 'Configured' : 'Not configured'}</Badge>
              </div>
              {stored?.lastTested && (
                <p className="text-xs text-gray-500 mb-3">Last tested: {stored.lastTested}</p>
              )}
              <Button variant="secondary" className="w-full" onClick={() => openConfig(integration)}>
                {stored ? 'Configure' : 'Set up'}
              </Button>
            </Card>
          )
        })}
      </div>

      <Modal
        isOpen={showConfig && !!selected}
        onClose={() => setShowConfig(false)}
        title={selected ? `Configure ${selected.name}` : 'Configure integration'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfig(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={testConnection}>
              <Icon name="Check" size={16} />
              Test Connection
            </Button>
            <Button variant="primary" onClick={saveConfig}>
              Save Configuration
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            {selected.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor={`integration-${field.key}`}>
                  {field.label}
                </label>
                <input
                  id={`integration-${field.key}`}
                  type={field.secret ? 'password' : 'text'}
                  value={config[field.key] || ''}
                  onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors[field.key] ? 'border-red-500' : ''
                  }`}
                  placeholder={`Enter ${field.label}...`}
                />
                {errors[field.key] && <p className="error mt-1">{errors[field.key]}</p>}
              </div>
            ))}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Simulation: configuration is stored locally in this browser with secret values masked. No service is connected and no
                request leaves the app. Real backend and provider connections will be implemented in a later phase.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
