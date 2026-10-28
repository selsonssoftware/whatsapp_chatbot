import { useState } from 'react'
import {
  Megaphone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Calendar,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Send,
  X,
  FileText,
  Image,
  Video,
  File,
  Mic,
  MapPin,
  UserCheck,
  LayoutTemplate,
} from 'lucide-react'
import { BLAST_KPIS, CAMPAIGNS_DATA } from '../../data/mockBlastData.js'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS_DATA)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [showDrawer, setShowDrawer] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Drawer state
  const [drawerAudience, setDrawerAudience] = useState('contacts')
  const [drawerMsgType, setDrawerMsgType] = useState('text')
  const [drawerText, setDrawerText] = useState('')
  const [drawerMode, setDrawerMode] = useState('now')

  const handleSendCampaign = () => {
    setFeedback('Campaign scheduled and broadcast started successfully!')
    setShowDrawer(false)
    setTimeout(() => setFeedback(null), 4000)
  }

  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === 'scheduled' && c.status !== 'Scheduled') return false
    if (activeTab === 'sending' && c.status !== 'Sending') return false
    if (activeTab === 'completed' && c.status !== 'Completed') return false
    if (activeTab === 'failed' && c.status !== 'Failed') return false

    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false
    if (typeFilter !== 'All Types' && c.type !== typeFilter) return false

    if (search.trim()) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campaigns / Broadcast
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send bulk WhatsApp messages to your contacts or groups. Track delivery, read rates and engagement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Campaign Reports ▾
          </button>
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.campaigns.total.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.campaigns.total.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.campaigns.total.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Messages Sent</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.campaigns.sent.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.campaigns.sent.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.campaigns.sent.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Delivery Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.campaigns.deliveryRate.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.campaigns.deliveryRate.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.campaigns.deliveryRate.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Campaigns', 'Scheduled', 'Sending', 'Completed', 'Failed'].map((tab) => {
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
        {/* Table Area */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs`}>
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>Completed</option>
                <option>Sending</option>
                <option>Scheduled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Types</option>
                <option>Marketing</option>
                <option>Utility</option>
                <option>Authentication</option>
              </select>

              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>May 01, 2024 - May 31, 2024</span>
              </div>

              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter
              </button>
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
                  <th className="py-2.5 px-3 font-semibold">Campaign Name</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Audience</th>
                  <th className="py-2.5 px-3 font-semibold">Sent</th>
                  <th className="py-2.5 px-3 font-semibold">Delivered</th>
                  <th className="py-2.5 px-3 font-semibold">Read</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Scheduled At</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCampaigns.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <input type="checkbox" className="rounded accent-[#00A884]" />
                    </td>
                    <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-slate-400">{c.desc}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.type === 'Marketing'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                            : c.type === 'Utility'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.audience}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                      {c.sent}
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {c.delivered}
                        </span>
                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: c.delivered.includes('9') ? '95%' : '0%' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {c.read}
                        </span>
                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: c.read.includes('7') ? '75%' : '0%' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          c.status === 'Completed'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : c.status === 'Sending'
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-amber-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Completed'
                              ? 'bg-emerald-500'
                              : c.status === 'Sending'
                              ? 'bg-sky-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{c.scheduledAt}</td>
                    <td className="py-3 px-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
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
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                4
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                5
              </button>
              <span>...</span>
              <button className="px-1 text-xs">13</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Create New Campaign */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#00A884]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Create New Campaign
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Select Audience */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Audience
                </label>
              </div>

              <div className="flex gap-1 border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2 text-xs">
                {['Contacts', 'Groups', 'Segments'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDrawerAudience(t.toLowerCase())}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                      drawerAudience === t.toLowerCase()
                        ? 'bg-slate-100 dark:bg-slate-800 text-[#00A884]'
                        : 'text-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <select className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>Select contacts or groups</option>
                <option>All Customers (12,540)</option>
                <option>Active Leads (8,420)</option>
                <option>VIP Customers (9,840)</option>
              </select>

              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                <span>0 contacts selected</span>
                <button className="text-[#00A884] hover:underline font-medium">View List</button>
              </div>
            </div>

            {/* 2. Message Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Message Content
                  </label>
                </div>
                <button className="text-[11px] text-[#00A884] font-medium hover:underline">
                  Use Template
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1 mb-2 text-xs">
                {[
                  { id: 'text', icon: FileText, label: 'Text' },
                  { id: 'image', icon: Image, label: 'Image' },
                  { id: 'video', icon: Video, label: 'Video' },
                  { id: 'doc', icon: File, label: 'Document' },
                  { id: 'audio', icon: Mic, label: 'Audio' },
                  { id: 'loc', icon: MapPin, label: 'Location' },
                  { id: 'contact', icon: UserCheck, label: 'Contact' },
                  { id: 'template', icon: LayoutTemplate, label: 'Template' },
                ].map(({ id, icon: IconC, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDrawerMsgType(id)}
                    className={`p-1.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 text-[10px] transition ${
                      drawerMsgType === id
                        ? 'border-[#00A884] bg-emerald-50/50 text-[#00A884]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <IconC className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={drawerText}
                onChange={(e) => setDrawerText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />

              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                <button className="text-[#00A884] hover:underline font-medium">
                  Add Variables ▾
                </button>
                <span>{drawerText.length}/4096</span>
              </div>
            </div>

            {/* 3. Sending Options */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sending Options
                </label>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="campaignSend"
                    checked={drawerMode === 'now'}
                    onChange={() => setDrawerMode('now')}
                    className="accent-[#00A884]"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Send Now</span>
                    <p className="text-[10px] text-slate-400">Send messages immediately</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="campaignSend"
                    checked={drawerMode === 'schedule'}
                    onChange={() => setDrawerMode('schedule')}
                    className="accent-[#00A884]"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Schedule for Later
                    </span>
                    <p className="text-[10px] text-slate-400">Choose date and time</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSendCampaign}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              Send Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
