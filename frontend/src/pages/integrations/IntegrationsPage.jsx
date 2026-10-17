import { useState } from 'react'
import { Card, Button, Badge, Icon, Input, Tabs } from '../../components/index.js'

const INTEGRATIONS = [
  { id: 'whatsapp', name: 'WhatsApp Business API', description: 'Connect your WhatsApp Business account', icon: 'MessageSquare', status: 'not_configured', fields: ['API Key', 'Phone Number ID', 'Webhook URL'] },
  { id: 'backend', name: 'Backend API', description: 'Connect to your backend service', icon: 'Code', status: 'not_configured', fields: ['API URL', 'API Key'] },
  { id: 'ai', name: 'AI Provider', description: 'Configure AI model provider', icon: 'Sparkles', status: 'not_configured', fields: ['Provider', 'API Key', 'Model'] },
  { id: 'payment', name: 'Payment Provider', description: 'Configure payment gateway', icon: 'CreditCard', status: 'not_configured', fields: ['Provider', 'API Key', 'Secret Key'] },
  { id: 'email', name: 'Email Provider', description: 'Configure email service', icon: 'Mail', status: 'not_configured', fields: ['Provider', 'API Key', 'From Email'] },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [selected, setSelected] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState({})

  const openConfig = (integration) => {
    setSelected(integration)
    setConfig({})
    setShowConfig(true)
  }

  const testConnection = () => {
    alert('Demo: Connection test simulated. In production, this would verify the integration.')
  }

  const saveConfig = () => {
    setIntegrations((prev) => prev.map((i) => (i.id === selected.id ? { ...i, status: 'configured' } : i)))
    setShowConfig(false)
    alert('Integration configured (demo)')
  }

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure third-party service integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Icon name={integration.icon} size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                </div>
              </div>
              <Badge variant={integration.status === 'configured' ? 'success' : 'warning'}>
                {integration.status === 'configured' ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => openConfig(integration)}>
              {integration.status === 'configured' ? 'Configure' : 'Connect'}
            </Button>
          </Card>
        ))}
      </div>

      {showConfig && selected && (
        <Card title={`Configure ${selected.name}`} className="mt-6">
          <div className="space-y-4">
            {selected.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field}</label>
                <input
                  type={field.toLowerCase().includes('key') || field.toLowerCase().includes('secret') ? 'password' : 'text'}
                  value={config[field] || ''}
                  onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={`Enter ${field}...`}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" onClick={testConnection}>
                <Icon name="Check" size={16} />
                Test Connection
              </Button>
              <Button variant="primary" onClick={saveConfig}>
                Save Configuration
              </Button>
              <Button variant="secondary" onClick={() => setShowConfig(false)}>
                Cancel
              </Button>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Demo Mode: No actual credentials are stored. Configure in production environment.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
