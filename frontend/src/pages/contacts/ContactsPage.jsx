import { useState } from 'react'
import {
  Users,
  FolderPlus,
  UserCheck,
  UserX,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Send,
  Tag,
  Trash2,
  MessageSquare,
  Edit2,
  MoreVertical,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Image,
  Video,
  FileText,
  Info,
} from 'lucide-react'
import { BLAST_KPIS, CONTACTS_DATA } from '../../data/mockBlastData.js'

export default function ContactsPage() {
  const [contacts, setContacts] = useState(CONTACTS_DATA)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedIds, setSelectedIds] = useState([1, 2, 3, 4, 5, 6, 8, 9, 10])
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('Retail Customers (245 contacts)')
  const [groupMessage, setGroupMessage] = useState('')
  const [sendingOption, setSendingOption] = useState('now')
  const [messageType, setMessageType] = useState('text')
  const [feedback, setFeedback] = useState(null)

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(contacts.map((c) => c.id))
    }
  }

  const handleSendGroupMessage = () => {
    setFeedback('Message successfully queued for ' + selectedGroup + '!')
    setShowDrawer(false)
    setTimeout(() => setFeedback(null), 4000)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contacts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your contacts and groups. Send private messages to a group's members.
          </p>
        </div>

        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Contacts', 'Groups', 'Import (CSV)'].map((tab) => {
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

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Contacts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.contacts.totalContacts.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.contacts.totalContacts.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.contacts.totalContacts.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Groups</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <FolderPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.contacts.groups.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.contacts.groups.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.contacts.groups.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Contacts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.contacts.activeContacts.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.contacts.activeContacts.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.contacts.activeContacts.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Blocked Contacts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.contacts.blockedContacts.value}
            </h3>
            <span className="text-xs font-semibold text-rose-500">
              {BLAST_KPIS.contacts.blockedContacts.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.contacts.blockedContacts.period}</p>
        </div>
      </div>

      {/* Main Workspace (Table + Optional Right Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Table Section */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs transition-all`}>
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search contacts by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Groups</option>
                <option>Retail</option>
                <option>Wholesale</option>
                <option>Corporate</option>
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Tags</option>
                <option>VIP</option>
                <option>Customer</option>
                <option>Lead</option>
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter
              </button>
              <button className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between p-2.5 mb-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={() => setShowDrawer(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#00A884] text-white rounded-lg font-semibold hover:bg-[#008f6f] shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Private Message
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">
                  <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                  Add to Group
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-50">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Add Tag
                </button>
              </div>

              <button
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === contacts.length}
                      onChange={toggleSelectAll}
                      className="rounded accent-[#00A884]"
                    />
                  </th>
                  <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Phone Number</th>
                  <th className="py-2.5 px-3 font-semibold">Tags</th>
                  <th className="py-2.5 px-3 font-semibold">Group</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {contacts
                  .filter(
                    (c) =>
                      c.name.toLowerCase().includes(search.toLowerCase()) ||
                      c.phone.includes(search)
                  )
                  .map((c, idx) => {
                    const isChecked = selectedIds.includes(c.id)
                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                          isChecked ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(c.id)}
                            className="rounded accent-[#00A884]"
                          />
                        </td>
                        <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-700 dark:text-slate-200">
                              {c.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono">
                            <span className="w-2 h-2 rounded-full bg-[#00A884]" />
                            {c.phone}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1">
                            {c.tags.map((t, i) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  t === 'VIP'
                                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                                    : t === 'Customer'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{c.group}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              c.status === 'Active'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                c.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-400">
                            <button className="p-1 hover:text-[#00A884] rounded">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 hover:text-slate-600 rounded">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 hover:text-slate-600 rounded">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                4
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                5
              </button>
              <span>...</span>
              <button className="px-1 text-xs">1,284</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Send Private Message to Group */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00A884]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Send Private Message to Group
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Select Group */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#00A884] text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Group
                </label>
              </div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>Retail Customers (245 contacts)</option>
                <option>Wholesale Buyers (120 contacts)</option>
                <option>Corporate Accounts (85 contacts)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                This will send individual private messages to each member.
              </p>
            </div>

            {/* 2. Message Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
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

              <div className="flex gap-2 mb-2 text-xs">
                {['Text', 'Image', 'Video', 'Document'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMessageType(t.toLowerCase())}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                      messageType === t.toLowerCase()
                        ? 'bg-[#00A884] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <textarea
                rows={5}
                value={groupMessage}
                onChange={(e) => setGroupMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />

              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                <button className="text-[#00A884] hover:underline font-medium">
                  Add Variables ▾
                </button>
                <span>{groupMessage.length}/4096</span>
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
                    name="groupSending"
                    checked={sendingOption === 'now'}
                    onChange={() => setSendingOption('now')}
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
                    name="groupSending"
                    checked={sendingOption === 'schedule'}
                    onChange={() => setSendingOption('schedule')}
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

              <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Each contact will receive this message privately. They won't see other group members.
                </span>
              </div>
            </div>

            <button
              onClick={handleSendGroupMessage}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              Send to 245 Contacts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
