import { useState } from 'react'
import {
  Settings,
  Building,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
  MessageSquare,
  Bell,
  Lock,
  CreditCard,
  Database,
  Sliders,
  Check,
} from 'lucide-react'
import { SETTINGS_CONFIG } from '../../data/mockBlastData.js'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [profile, setProfile] = useState(SETTINGS_CONFIG.profile)
  const [company, setCompany] = useState(SETTINGS_CONFIG.company)
  const [preferences, setPreferences] = useState(SETTINGS_CONFIG.preferences)
  const [businessHours, setBusinessHours] = useState(SETTINGS_CONFIG.businessHours)
  const [awayMessage, setAwayMessage] = useState(SETTINGS_CONFIG.awayMessage)
  const [dataRetention, setDataRetention] = useState(SETTINGS_CONFIG.dataRetention)
  const [feedback, setFeedback] = useState(null)

  const handleSave = (msg = 'Settings saved successfully!') => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleDay = (idx) => {
    setBusinessHours((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, active: !d.active } : d))
    )
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your account, WhatsApp Business API, preferences and system configuration.
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm border border-emerald-300 dark:border-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
        {[
          { key: 'general', label: 'General' },
          { key: 'whatsapp', label: 'WhatsApp Business' },
          { key: 'messaging', label: 'Messaging' },
          { key: 'team', label: 'Team & Permissions' },
          { key: 'integrations', label: 'Integrations' },
          { key: 'notifications', label: 'Notifications' },
          { key: 'security', label: 'Security' },
          { key: 'billing', label: 'Billing & Subscription' },
          { key: 'privacy', label: 'Data & Privacy' },
          { key: 'advanced', label: 'Advanced' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'bg-[#00A884]/10 text-[#00A884] font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3 Columns Layout matching Screenshot 17 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Column 1: Business Profile & Company Details & Hours */}
        <div className="space-y-4">
          {/* Business Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Business Profile</h3>
              <button
                onClick={() => handleSave('Business profile updated!')}
                className="flex items-center gap-1 text-[#00A884] font-semibold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-[#00A884]/10 border border-[#00A884]/20 flex items-center justify-center font-bold text-xl text-[#00A884] shrink-0">
                🏢
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 block">Business Name *</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Description</label>
                  <input
                    type="text"
                    value={profile.description}
                    onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-[10px] text-slate-400 block">Website</label>
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                  className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Email</label>
                <input
                  type="text"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]"
              />
            </div>
          </div>

          {/* Company Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Company Details</h3>
              <button
                onClick={() => handleSave('Company details saved!')}
                className="flex items-center gap-1 text-[#00A884] font-semibold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">Company Name *</label>
                <input
                  type="text"
                  defaultValue={company.name}
                  className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Industry</label>
                <select className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <option>E-commerce</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block">Address</label>
              <textarea
                rows={2}
                defaultValue={company.address}
                className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 leading-relaxed text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">GST / Tax ID (Optional)</label>
                <input
                  type="text"
                  defaultValue={company.gstTaxId}
                  className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Support Phone</label>
                <input
                  type="text"
                  defaultValue={company.supportPhone}
                  className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Business Hours</h3>
                <p className="text-[10px] text-slate-400">Set your availability hours for customer support.</p>
              </div>
              <button
                onClick={() => handleSave('Business hours updated!')}
                className="flex items-center gap-1 text-[#00A884] font-semibold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div className="space-y-1.5">
              {businessHours.map((d, idx) => (
                <div key={d.day} className="flex items-center justify-between py-1 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer w-28">
                    <input
                      type="checkbox"
                      checked={d.active}
                      onChange={() => toggleDay(idx)}
                      className="rounded accent-[#00A884]"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{d.day}</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                      {d.active ? d.start : 'Closed'}
                    </span>
                    <span className="text-slate-400">-</span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                      {d.active ? d.end : 'Closed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Time Zone, Preferences & Away Message */}
        <div className="space-y-4">
          {/* Time Zone & Language */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Time Zone & Language
            </h3>

            <div>
              <label className="text-slate-500 block mb-1">Time Zone</label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>(GMT+05:30) India Standard Time (IST)</option>
                <option>(GMT+00:00) UTC</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-1">Date Format</label>
                <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Language</label>
                <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleSave('Time zone settings saved!')}
              className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
            >
              Save Changes
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Preferences
            </h3>

            <div className="space-y-2.5">
              {[
                { key: 'autoAssign', label: 'Auto-assign new conversations' },
                { key: 'notificationSound', label: 'Play notification sound' },
                { key: 'showMessagePreview', label: 'Show message preview' },
                { key: 'compactView', label: 'Compact view' },
                { key: 'linkShortening', label: 'Enable link shortening' },
                { key: 'trackAnalytics', label: 'Track message analytics' },
                { key: 'saveSentHistory', label: 'Save sent message history' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
                  <button
                    type="button"
                    onClick={() => togglePreference(key)}
                    className={`w-8 h-4.5 rounded-full transition relative ${
                      preferences[key] ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition ${
                        preferences[key] ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Away Message Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Away Message</h3>
                <p className="text-[10px] text-slate-400">
                  Automatically reply when you are outside business hours.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAwayMessage((p) => ({ ...p, enabled: !p.enabled }))
                }
                className={`w-8 h-4.5 rounded-full transition relative ${
                  awayMessage.enabled ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition ${
                    awayMessage.enabled ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Message Template</label>
              <textarea
                rows={3}
                value={awayMessage.text}
                onChange={(e) => setAwayMessage((p) => ({ ...p, text: e.target.value }))}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 leading-relaxed text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">{`{{customer_name}}`}</span>
            </div>

            <button
              onClick={() => handleSave('Away message updated!')}
              className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
            >
              Save
            </button>
          </div>
        </div>

        {/* Column 3: Account Status, Default Settings, Data Retention */}
        <div className="space-y-4">
          {/* Account Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Account Status</h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Your account is active and all systems are working properly.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">WABA Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  +1 555 123 4567
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Business Verification</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Phone Number Status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Messaging Tier</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  MSG_LIMIT
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Quality Rating</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> High
                </span>
              </div>
            </div>
          </div>

          {/* Default Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Default Settings</h3>
              <button
                onClick={() => handleSave('Defaults saved!')}
                className="flex items-center gap-1 text-[#00A884] font-semibold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">
                Default Message Template Language
              </label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>English (en_US)</option>
                <option>Spanish (es_ES)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Default Sender Number</label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono">
                <option>+1 555 123 4567</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Default Team</label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>Support</option>
                <option>Sales</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Default Assignment Rule</label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>Round Robin</option>
                <option>Load Balanced</option>
                <option>Manual Only</option>
              </select>
            </div>

            <button
              onClick={() => handleSave('Defaults saved!')}
              className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
            >
              Save Changes
            </button>
          </div>

          {/* Data Retention */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Data Retention</h3>
              <button
                onClick={() => handleSave('Retention policies updated!')}
                className="flex items-center gap-1 text-[#00A884] font-semibold hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Keep message history for</label>
              <select
                value={dataRetention.messageHistory}
                onChange={(e) =>
                  setDataRetention((p) => ({ ...p, messageHistory: e.target.value }))
                }
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>12 Months</option>
                <option>6 Months</option>
                <option>24 Months</option>
                <option>Indefinite</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Auto-delete logs older than</label>
              <select
                value={dataRetention.autoDeleteLogs}
                onChange={(e) =>
                  setDataRetention((p) => ({ ...p, autoDeleteLogs: e.target.value }))
                }
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>6 Months</option>
                <option>3 Months</option>
                <option>12 Months</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Keep contact data for</label>
              <select
                value={dataRetention.contactData}
                onChange={(e) =>
                  setDataRetention((p) => ({ ...p, contactData: e.target.value }))
                }
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>24 Months</option>
                <option>12 Months</option>
                <option>Indefinite</option>
              </select>
            </div>

            <button
              onClick={() => handleSave('Data retention policy saved!')}
              className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
