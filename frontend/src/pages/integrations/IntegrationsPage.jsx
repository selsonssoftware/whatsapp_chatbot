import { useState } from 'react'
import {
  Plug,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Table,
  Mail,
  Calendar,
  Code,
  Webhook,
  Database,
  Layers,
} from 'lucide-react'
import { BLAST_KPIS, INTEGRATIONS_DATA } from '../../data/mockBlastData.js'

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [selectedId, setSelectedId] = useState('shopify')
  const [showDrawer, setShowDrawer] = useState(true)
  const [drawerTab, setDrawerTab] = useState('overview')
  const [feedback, setFeedback] = useState(null)

  // Drawer toggles
  const [syncToggles, setSyncToggles] = useState({
    products: true,
    orders: true,
    customers: true,
    inventory: false,
  })

  const selectedApp =
    integrations.find((i) => i.id === selectedId) || integrations[0]

  const handleTestConnection = () => {
    setFeedback('Connection to ' + selectedApp.name + ' verified successfully! (200 OK)')
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleSaveChanges = () => {
    setFeedback('Settings for ' + selectedApp.name + ' saved!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const filteredApps = integrations.filter((app) => {
    if (activeTab === 'crm' && app.category !== 'CRM') return false
    if (activeTab === 'e-commerce' && app.category !== 'E-commerce') return false
    if (activeTab === 'payment' && app.category !== 'Payment') return false
    if (activeTab === 'marketing' && app.category !== 'Marketing') return false
    if (activeTab === 'productivity' && app.category !== 'Productivity') return false
    if (activeTab === 'custom' && app.category !== 'Developer') return false

    if (categoryFilter !== 'All Categories' && app.category !== categoryFilter) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      return app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Integrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect BlastWhatsApp with your favorite tools and services. Sync data, automate workflows and do more with integrations.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition">
          <Plus className="w-4 h-4" />
          Add Custom Integration
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Integrations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Plug className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.integrations.total.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.integrations.total.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.integrations.total.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Integrations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.integrations.active.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.integrations.active.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.integrations.active.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Inactive Integrations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {BLAST_KPIS.integrations.inactive.value}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.integrations.inactive.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Failed Integrations</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {BLAST_KPIS.integrations.failed.value}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.integrations.failed.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Integrations', 'CRM & Sales', 'E-commerce', 'Payment', 'Marketing', 'Productivity', 'Custom APIs'].map((tab) => {
          const key = tab.toLowerCase().split(' ')[0]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                activeTab === key
                  ? 'bg-[#00A884]/10 text-[#00A884]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Apps Grid Column */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-4`}>
          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search integrations by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Categories</option>
                <option>E-commerce</option>
                <option>Payment</option>
                <option>CRM</option>
                <option>Marketing</option>
                <option>Productivity</option>
                <option>Developer</option>
              </select>

              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Status</option>
                <option>Connected</option>
                <option>Inactive</option>
              </select>

              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter
              </button>
            </div>
          </div>

          {/* Cards Grid (3 across) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filteredApps.map((app) => {
              const isSelected = app.id === selectedApp.id
              const isConnected = app.status === 'Connected'
              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedId(app.id)
                    setShowDrawer(true)
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#00A884] ring-2 ring-[#00A884]/20 bg-emerald-50/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${app.iconColor}`}>
                        {app.name.charAt(0)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          isConnected
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {app.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {app.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {app.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {app.category}
                    </span>
                    <button
                      className={`px-3 py-1 rounded-lg font-semibold text-xs transition ${
                        isConnected
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          : 'bg-[#00A884] text-white hover:bg-[#008f6f]'
                      }`}
                    >
                      {isConnected ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Drawer: App Configuration */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl ${selectedApp.iconColor}`}>
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedApp.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Sync your store with BlastWhatsApp. Automatically send order updates and abandoned cart reminders.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtabs */}
            <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
              {['Overview', 'Configuration', 'Sync Settings', 'Logs'].map((t) => (
                <button
                  key={t}
                  onClick={() => setDrawerTab(t.toLowerCase())}
                  className={`font-semibold pb-1 transition ${
                    drawerTab === t.toLowerCase()
                      ? 'text-[#00A884] border-b-2 border-[#00A884]'
                      : 'text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Connection Status Box */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Connection Status
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Connected successfully · Last synced: May 07, 2024 10:30 AM
                </p>
              </div>
              <button
                onClick={handleTestConnection}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 shadow-2xs"
              >
                Test Connection
              </button>
            </div>

            {/* Integration Features */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Integration Features
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                {[
                  'Sync products and inventory',
                  'Send order confirmations',
                  'Abandoned cart recovery',
                  'Customer notifications',
                  'Sync customer data',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A884]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials Form */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Credentials
              </span>
              <div>
                <label className="text-slate-500 block mb-1">Store URL</label>
                <input
                  type="text"
                  defaultValue="https://your-store.myshopify.com"
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">API Access Token</label>
                <input
                  type="password"
                  defaultValue="shpat_abcdef1234567890"
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>

              <button
                onClick={handleSaveChanges}
                className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                Save Changes
              </button>
            </div>

            {/* Sync Settings Toggles */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Sync Settings
              </span>
              {[
                { key: 'products', label: 'Sync Products' },
                { key: 'orders', label: 'Sync Orders' },
                { key: 'customers', label: 'Sync Customers' },
                { key: 'inventory', label: 'Sync Inventory' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSyncToggles((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                    className={`w-8 h-4.5 rounded-full transition relative ${
                      syncToggles[key] ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition ${
                        syncToggles[key] ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold rounded-xl text-xs transition border border-rose-200 dark:border-rose-900/40">
                Disconnect Integration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
