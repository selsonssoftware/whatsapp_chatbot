import { useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { BLAST_KPIS, SCHEDULE_LOGS_DATA } from '../../data/mockBlastData.js'

export default function ScheduleLogsPage() {
  const [logs, setLogs] = useState(SCHEDULE_LOGS_DATA)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedId, setSelectedId] = useState(1)
  const [showDrawer, setShowDrawer] = useState(true)
  const [feedback, setFeedback] = useState(null)

  const selectedLog = logs.find((l) => l.id === selectedId) || logs[0]

  const handleRefresh = () => {
    setFeedback('Schedule queue refreshed!')
    setTimeout(() => setFeedback(null), 2500)
  }

  const filteredLogs = logs.filter((l) => {
    if (activeTab === 'campaigns' && l.type !== 'Campaign') return false
    if (activeTab === 'automation' && l.type !== 'Automation') return false
    if (activeTab === 'broadcasts' && l.type !== 'Broadcast') return false
    if (activeTab === 'follow-ups' && l.type !== 'Follow-up') return false

    if (typeFilter !== 'All Types' && l.type !== typeFilter) return false
    if (statusFilter !== 'All Status' && l.status !== statusFilter) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        l.scheduleId.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q) ||
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
            Schedule Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track all scheduled messages, campaigns and automation tasks with real-time status and delivery details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition">
            <Plus className="w-4 h-4" />
            Schedule Message
          </button>
        </div>
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
            <span className="text-xs font-medium text-slate-500">Total Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.scheduleLogs.totalScheduled.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.scheduleLogs.totalScheduled.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.scheduleLogs.totalScheduled.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Sent</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.scheduleLogs.sent.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.scheduleLogs.sent.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.scheduleLogs.sent.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.scheduleLogs.pending.value}
            </h3>
            <span className="text-xs font-semibold text-amber-500">
              {BLAST_KPIS.scheduleLogs.pending.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.scheduleLogs.pending.period}</p>
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
              {BLAST_KPIS.scheduleLogs.failed.value}
            </h3>
            <span className="text-xs font-semibold text-rose-500">
              {BLAST_KPIS.scheduleLogs.failed.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.scheduleLogs.failed.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Schedules', 'Campaigns', 'Automation', 'Broadcasts', 'Follow-ups', 'Reminders'].map((tab) => {
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
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by message, campaign, contact or schedule ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-600 dark:text-slate-300"
              >
                <option>All Types</option>
                <option>Campaign</option>
                <option>Automation</option>
                <option>Broadcast</option>
                <option>Follow-up</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-600 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>Sent</option>
                <option>Pending</option>
                <option>Failed</option>
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
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded accent-[#00A884]" />
                  </th>
                  <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Schedule ID</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Scheduled Time</th>
                  <th className="py-2.5 px-3 font-semibold">Message / Campaign</th>
                  <th className="py-2.5 px-3 font-semibold">Recipients</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Sent Time</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((l, idx) => {
                  const isSelected = l.id === selectedLog.id
                  return (
                    <tr
                      key={l.id}
                      onClick={() => {
                        setSelectedId(l.id)
                        setShowDrawer(true)
                      }}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input type="checkbox" className="rounded accent-[#00A884]" />
                      </td>
                      <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {l.scheduleId}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            l.type === 'Campaign'
                              ? 'bg-purple-50 text-purple-700'
                              : l.type === 'Automation'
                              ? 'bg-blue-50 text-blue-700'
                              : l.type === 'Broadcast'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{l.scheduledTime}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {l.message}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">
                        {l.recipients}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            l.status === 'Sent'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : l.status === 'Pending'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              l.status === 'Sent'
                                ? 'bg-emerald-500'
                                : l.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{l.sentTime}</td>
                      <td className="py-3 px-3 text-right">
                        <button className="p-1 text-slate-400 hover:text-[#00A884] rounded">
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
              <button className="px-1 text-xs">124</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Schedule Details */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs font-mono">{selectedLog.scheduleId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {selectedLog.status}
                </span>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata list */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Message / Campaign</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedLog.message}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Scheduled Time</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedLog.scheduledTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Sent Time</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedLog.sentTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Recipients</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedLog.recipients}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Message Template</span>
                <span className="font-mono text-[#00A884] font-medium">
                  {selectedLog.template || 'product_offer_v1'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Created By</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Admin</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Created At</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  May 06, 2024 04:20 PM
                </span>
              </div>
            </div>

            {/* Message Content Preview Card */}
            <div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
                Message Content
              </span>
              <div className="p-3 bg-[#EFEAE2] dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 shadow-2xs text-xs space-y-1">
                  <p className="font-bold text-[#008069]">🎉 Special Offer!</p>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    Get 20% off on all sports shoes. Limited time offer. Shop now!
                  </p>
                  <button className="w-full mt-2 py-1 bg-white border border-slate-200 text-sky-600 font-semibold text-[10px] rounded shadow-2xs">
                    View Products
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Summary Grid */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
                Delivery Summary
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400">Total Recipients</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedLog.recipients}
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300">
                    Delivered
                  </span>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
                    {selectedLog.delivered || '1,180 (94.4%)'}
                  </p>
                </div>
                <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-800">
                  <span className="text-[10px] text-sky-700 dark:text-sky-300">Read</span>
                  <p className="text-sm font-bold text-sky-800 dark:text-sky-200 mt-0.5">
                    {selectedLog.read || '840 (67.2%)'}
                  </p>
                </div>
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-800">
                  <span className="text-[10px] text-rose-700 dark:text-rose-300">Failed</span>
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-200 mt-0.5">
                    {selectedLog.failed || '42 (3.4%)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Failure Reason Box if any */}
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> Failure Reason (if any)
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[10px] leading-relaxed">
                {selectedLog.failureReason ||
                  '42 messages failed to deliver. Reasons: Invalid number (25), User blocked (10), Template error (7).'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
