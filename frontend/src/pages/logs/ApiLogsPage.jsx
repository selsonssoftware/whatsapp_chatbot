import { useState } from 'react'
import {
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  Download,
  BookOpen,
  Eye,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Code,
} from 'lucide-react'
import { BLAST_KPIS, API_LOGS_DATA } from '../../data/mockBlastData.js'

export default function ApiLogsPage() {
  const [logs, setLogs] = useState(API_LOGS_DATA)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('All Methods')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedLogId, setSelectedLogId] = useState(1)
  const [showDrawer, setShowDrawer] = useState(true)
  const [drawerTab, setDrawerTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const selectedLog = logs.find((l) => l.id === selectedLogId) || logs[0]

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(JSON.stringify(text, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredLogs = logs.filter((l) => {
    if (activeTab === 'requests' && l.method !== 'POST') return false
    if (activeTab === 'webhooks' && l.type !== 'Webhook') return false
    if (activeTab === 'errors' && l.status < 400) return false

    if (methodFilter !== 'All Methods' && l.method !== methodFilter) return false
    if (statusFilter !== 'All Status' && String(l.status) !== statusFilter) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        l.endpoint.toLowerCase().includes(q) ||
        l.messageId.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            API Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track all WhatsApp API requests, responses and webhook events in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            API Documentation
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Requests</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.apiLogs.totalRequests.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.apiLogs.totalRequests.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.apiLogs.totalRequests.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Successful</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.apiLogs.successful.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.apiLogs.successful.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.apiLogs.successful.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Failed</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.apiLogs.failed.value}
            </h3>
            <span className="text-xs font-semibold text-rose-500">
              {BLAST_KPIS.apiLogs.failed.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.apiLogs.failed.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg. Response Time</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.apiLogs.avgResponseTime.value}
            </h3>
            <span className="text-xs font-semibold text-blue-600">
              {BLAST_KPIS.apiLogs.avgResponseTime.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.apiLogs.avgResponseTime.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Logs', 'API Requests', 'API Responses', 'Webhook Events', 'Errors'].map((tab) => {
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Table Column */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs`}>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by message ID, contact, endpoint or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300"
              >
                <option>All Methods</option>
                <option>POST</option>
                <option>GET</option>
              </select>

              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300">
                <option>All Endpoints</option>
                <option>/messages</option>
                <option>/media</option>
                <option>/webhooks</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>200</option>
                <option>201</option>
                <option>400</option>
                <option>404</option>
              </select>

              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>May 01 - May 31</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Method</th>
                  <th className="py-2.5 px-3 font-semibold">Endpoint</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Response Time</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Message ID / Reference</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredLogs.map((l, idx) => {
                  const isSelected = l.id === selectedLog.id
                  return (
                    <tr
                      key={l.id}
                      onClick={() => {
                        setSelectedLogId(l.id)
                        setShowDrawer(true)
                      }}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-2 text-slate-400 font-sans">{idx + 1}</td>
                      <td className="py-3 px-3 text-slate-500 font-sans">{l.time}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.method === 'POST'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          }`}
                        >
                          {l.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {l.endpoint}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status < 300
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{l.timeMs}</td>
                      <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-300">
                        {l.type}
                      </td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[130px]">
                        {l.messageId}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="p-1 hover:text-[#00A884] rounded">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span>Show 10 per page ▾</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded bg-[#00A884] text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                3
              </button>
              <span>...</span>
              <button className="px-1 text-xs">1,256</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: API Log Details */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedLog.method === 'POST'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedLog.method}
                </span>
                <span className="font-bold font-mono text-xs">{selectedLog.endpoint}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedLog.status} OK
                </span>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtabs */}
            <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5 text-xs">
              {['Overview', 'Request', 'Response', 'Headers'].map((t) => (
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

            {/* Overview Metadata */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Time</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  May 07, 2024 10:30:24 AM
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Response Time</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedLog.timeMs}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Type</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedLog.type}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Message ID</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                  {selectedLog.messageId}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">To (Phone)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  +91 98765 43210
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Template Name</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  order_confirmation
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Success
                </span>
              </div>
            </div>

            {/* Request Payload JSON box */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Request Payload</span>
                <button
                  onClick={() => handleCopy(selectedLog.payload || { messaging_product: 'whatsapp' })}
                  className="flex items-center gap-1 text-[11px] text-[#00A884] hover:underline font-semibold"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-36">
                {JSON.stringify(
                  selectedLog.payload || {
                    messaging_product: 'whatsapp',
                    to: '+919876543210',
                    type: 'template',
                    template: { name: 'order_confirmation', language: { code: 'en' } },
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Response Payload JSON box */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">Response Payload</span>
                <button
                  onClick={() => handleCopy(selectedLog.response || { messaging_product: 'whatsapp' })}
                  className="flex items-center gap-1 text-[11px] text-[#00A884] hover:underline font-semibold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-sky-400 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-36">
                {JSON.stringify(
                  selectedLog.response || {
                    messaging_product: 'whatsapp',
                    contacts: [{ input: '919876543210', wa_id: '919876543210' }],
                    messages: [{ id: 'wamid.HBgMOTE...001' }],
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
