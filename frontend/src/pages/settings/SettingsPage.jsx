import { useState } from 'react'
import { Card, Button, Input, Tabs, Icon, Badge } from '../../components/index.js'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: { workspaceName: 'My Workspace', timezone: 'UTC', language: 'en' },
    whatsapp: { phoneNumber: '', businessName: '', description: '' },
    messaging: { defaultTemplate: '', autoReply: false, workingHours: '9:00-18:00' },
    team: { requireApproval: false, maxConversations: 10 },
    notifications: { emailAlerts: true, inAppAlerts: true },
    security: { twoFactorAuth: false, sessionTimeout: 30 },
    billing: { plan: 'Free', renewalDate: '2026-02-17' },
    privacy: { dataRetention: 90, anonymizeData: false },
  })

  const [saveStatus, setSaveStatus] = useState('')

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
  }

  const saveSettings = () => {
    setSaveStatus('Saving...')
    setTimeout(() => {
      setSaveStatus('Saved!')
      setTimeout(() => setSaveStatus(''), 2000)
    }, 500)
  }

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your workspace and preferences</p>
      </div>

      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'whatsapp', label: 'WhatsApp Business' },
          { id: 'messaging', label: 'Messaging' },
          { id: 'team', label: 'Team' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'security', label: 'Security' },
          { id: 'billing', label: 'Billing' },
          { id: 'privacy', label: 'Data & Privacy' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-6">
        {activeTab === 'general' && (
          <Card title="General Settings">
            <div className="space-y-4">
              <Input label="Workspace Name" value={settings.general.workspaceName} onChange={(e) => updateSetting('general', 'workspaceName', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <select
                  value={settings.general.language}
                  onChange={(e) => updateSetting('general', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'whatsapp' && (
          <Card title="WhatsApp Business Settings">
            <div className="space-y-4">
              <Input label="Phone Number" value={settings.whatsapp.phoneNumber} onChange={(e) => updateSetting('whatsapp', 'phoneNumber', e.target.value)} placeholder="+1234567890" />
              <Input label="Business Name" value={settings.whatsapp.businessName} onChange={(e) => updateSetting('whatsapp', 'businessName', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Description</label>
                <textarea
                  value={settings.whatsapp.description}
                  onChange={(e) => updateSetting('whatsapp', 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  Configure WhatsApp Business API in Integrations section.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'messaging' && (
          <Card title="Messaging Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Template</label>
                <select
                  value={settings.messaging.defaultTemplate}
                  onChange={(e) => updateSetting('messaging', 'defaultTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">None</option>
                  <option value="1">Welcome Template</option>
                  <option value="2">Order Update Template</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoReply"
                  checked={settings.messaging.autoReply}
                  onChange={(e) => updateSetting('messaging', 'autoReply', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="autoReply" className="text-sm text-gray-700 dark:text-gray-300">Enable Auto-Reply</label>
              </div>
              <Input label="Working Hours" value={settings.messaging.workingHours} onChange={(e) => updateSetting('messaging', 'workingHours', e.target.value)} placeholder="9:00-18:00" />
            </div>
          </Card>
        )}

        {activeTab === 'team' && (
          <Card title="Team Settings">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="approval"
                  checked={settings.team.requireApproval}
                  onChange={(e) => updateSetting('team', 'requireApproval', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="approval" className="text-sm text-gray-700 dark:text-gray-300">Require Approval for Campaigns</label>
              </div>
              <Input label="Max Concurrent Conversations per Agent" type="number" value={settings.team.maxConversations} onChange={(e) => updateSetting('team', 'maxConversations', e.target.value)} />
            </div>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card title="Notification Settings">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="emailAlerts" className="text-sm text-gray-700 dark:text-gray-300">Email Alerts</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inAppAlerts"
                  checked={settings.notifications.inAppAlerts}
                  onChange={(e) => updateSetting('notifications', 'inAppAlerts', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="inAppAlerts" className="text-sm text-gray-700 dark:text-gray-300">In-App Notifications</label>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card title="Security Settings">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="2fa"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="2fa" className="text-sm text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
              </div>
              <Input label="Session Timeout (minutes)" type="number" value={settings.security.sessionTimeout} onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)} />
              <Button variant="secondary">Change Password</Button>
            </div>
          </Card>
        )}

        {activeTab === 'billing' && (
          <Card title="Billing & Subscription">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Current Plan</span>
                  <Badge variant="info">{settings.billing.plan}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Renewal Date: {settings.billing.renewalDate}</p>
              </div>
              <Button variant="primary">Upgrade Plan</Button>
              <Button variant="secondary">View Payment History</Button>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  Demo Mode: No actual billing or payment processing.
                </p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'privacy' && (
          <Card title="Data & Privacy">
            <div className="space-y-4">
              <Input label="Data Retention Period (days)" type="number" value={settings.privacy.dataRetention} onChange={(e) => updateSetting('privacy', 'dataRetention', e.target.value)} />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymize"
                  checked={settings.privacy.anonymizeData}
                  onChange={(e) => updateSetting('privacy', 'anonymizeData', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="anonymize" className="text-sm text-gray-700 dark:text-gray-300">Anonymize Old Data</label>
              </div>
              <Button variant="danger">Export All Data</Button>
              <Button variant="danger">Delete Account</Button>
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <span className={saveStatus === 'Saved!' ? 'text-green-600 dark:text-green-400 self-center' : 'text-gray-600 dark:text-gray-400 self-center'}>{saveStatus}</span>
          <Button variant="primary" onClick={saveSettings}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
