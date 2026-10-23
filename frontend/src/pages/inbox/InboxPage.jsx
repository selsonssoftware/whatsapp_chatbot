import { useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  Phone,
  MoreVertical,
  Flag,
  CheckCircle2,
  Paperclip,
  Smile,
  Mic,
  Send,
  Edit2,
  ArrowUpDown,
  Clock,
  Package,
  User,
  MessageSquare,
  FileText,
  Workflow,
  CheckCheck,
} from 'lucide-react'
import { INBOX_CONVERSATIONS } from '../../data/mockBlastData.js'

export default function InboxPage() {
  const [conversations, setConversations] = useState(INBOX_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState(INBOX_CONVERSATIONS[0].id)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [inputTab, setInputTab] = useState('reply')
  const [messageText, setMessageText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  const selected = conversations.find((c) => c.id === selectedId) || conversations[0]

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'unread' && c.unreadCount === 0) return false
    if (activeTab === 'assigned' && c.assignedTo !== 'Alex Carter') return false
    if (activeTab === 'resolved' && c.sla !== 'Resolved') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (!messageText.trim()) return

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'agent',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selected.id) {
          return {
            ...c,
            lastMessage: messageText,
            lastTime: newMsg.time,
            messages: [...(c.messages || []), newMsg],
          }
        }
        return c
      })
    )
    setMessageText('')
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const newNote = {
      author: 'Alex Carter',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: noteText,
    }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, conversationNotes: [...(c.conversationNotes || []), newNote] }
          : c
      )
    )
    setNoteText('')
    setIsAddingNote(false)
  }

  const handleResolve = () => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, sla: c.sla === 'Resolved' ? 'SLA 2h 00m' : 'Resolved' }
          : c
      )
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] text-slate-800 dark:text-slate-100">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Team Inbox</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage customer conversations and provide great support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations, contacts or messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-12 py-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">
              ⌘ K
            </span>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <Filter className="w-4 h-4 text-slate-500" />
            Filter
          </button>

          <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg shadow-sm transition">
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-3 shrink-0 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
            activeTab === 'all'
              ? 'bg-[#00A884]/10 text-[#00A884]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All <span className="text-xs font-semibold">(248)</span>
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg transition ${
            activeTab === 'unread'
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Unread <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">12</span>
        </button>
        <button
          onClick={() => setActiveTab('assigned')}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
            activeTab === 'assigned'
              ? 'bg-[#00A884]/10 text-[#00A884]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Assigned to me <span className="text-xs font-semibold">(8)</span>
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
            activeTab === 'resolved'
              ? 'bg-[#00A884]/10 text-[#00A884]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Resolved <span className="text-xs font-semibold">(216)</span>
        </button>
      </div>

      {/* 3-Column Workspace */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Col 1: Conversation List (3 cols) */}
        <div className="col-span-3 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-0">
          <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium cursor-pointer hover:text-slate-800 dark:hover:text-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5" /> Latest First
            </span>
            <span>{filteredConversations.length} chats</span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.map((c) => {
              const isSelected = c.id === selected.id
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-[#00A884]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 text-sm">
                        {c.name.charAt(0)}
                      </div>
                    )}
                    {c.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.name}</h4>
                      <span className="text-[11px] text-slate-400 shrink-0">{c.lastTime}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.lastMessage}</p>
                  </div>

                  {c.unreadCount > 0 && (
                    <span className="shrink-0 bg-[#00A884] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Col 2: Chat Stream (6 cols) */}
        <div className="col-span-6 flex flex-col min-h-0 border-r border-slate-200 dark:border-slate-800">
          {/* Top chat details */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {selected.avatar ? (
                  <img src={selected.avatar} alt={selected.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                    {selected.name.charAt(0)}
                  </div>
                )}
                {selected.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selected.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                {selected.sla}
              </span>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Assign & Priority */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500">
                <span>Assign to:</span>
                <select
                  value={selected.assignedTo}
                  onChange={(e) => {
                    const val = e.target.value
                    setConversations((prev) =>
                      prev.map((c) => (c.id === selected.id ? { ...c, assignedTo: val } : c))
                    )
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 font-medium text-slate-700 dark:text-slate-300"
                >
                  <option value="Alex Carter">Alex Carter</option>
                  <option value="Maria Garcia">Maria Garcia</option>
                  <option value="Rahul Mehta">Rahul Mehta</option>
                  <option value="Sarah Lee">Sarah Lee</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <span>Priority:</span>
                <select
                  value={selected.priority}
                  onChange={(e) => {
                    const val = e.target.value
                    setConversations((prev) =>
                      prev.map((c) => (c.id === selected.id ? { ...c, priority: val } : c))
                    )
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 font-medium text-red-600 dark:text-red-400"
                >
                  <option value="High">🚩 High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleResolve}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                selected.sla === 'Resolved'
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {selected.sla === 'Resolved' ? 'Reopen' : 'Resolve'}
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FBFB] dark:bg-slate-950/50">
            <div className="flex justify-center my-2">
              <span className="text-[11px] font-semibold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-0.5 shadow-2xs">
                Today
              </span>
            </div>

            {selected.messages?.map((m) => {
              const isMe = m.sender === 'agent'
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-sm shadow-2xs whitespace-pre-line leading-relaxed ${
                      isMe
                        ? 'bg-[#E7F8F0] dark:bg-emerald-950/60 text-slate-900 dark:text-white rounded-tr-none border border-emerald-100 dark:border-emerald-800/40'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {m.text}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                      <span>{m.time}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#00A884]" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Composer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Mode selection tabs */}
            <div className="flex items-center gap-2 mb-2 text-xs">
              <button
                onClick={() => setInputTab('reply')}
                className={`px-3 py-1 font-medium rounded-full transition ${
                  inputTab === 'reply'
                    ? 'bg-[#00A884] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Reply
              </button>
              <button
                onClick={() => setInputTab('note')}
                className={`px-3 py-1 font-medium rounded-full transition ${
                  inputTab === 'note'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Internal Note
              </button>
              <button
                onClick={() => setInputTab('template')}
                className={`flex items-center gap-1 px-3 py-1 font-medium rounded-full transition ${
                  inputTab === 'template'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" /> Template
              </button>
              <button
                onClick={() => setInputTab('flow')}
                className={`flex items-center gap-1 px-3 py-1 font-medium rounded-full transition ${
                  inputTab === 'flow'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Workflow className="w-3 h-3" /> WhatsApp Flow
              </button>
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <div className="flex items-center gap-1 text-slate-400 pl-1">
                <button type="button" className="p-1 hover:text-slate-600 rounded">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" className="p-1 hover:text-slate-600 rounded">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder={
                  inputTab === 'note'
                    ? 'Write an internal note visible only to your team...'
                    : 'Type a message...'
                }
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884]"
              />

              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ⌘ + ⏎ to send
              </span>

              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                className="p-2.5 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Col 3: Customer Details & Activity (3 cols) */}
        <div className="col-span-3 flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
          {/* Contact summary header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {selected.avatar ? (
                <img src={selected.avatar} alt={selected.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-lg">
                  {selected.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
                </span>
                <p className="text-xs text-slate-500">{selected.phone}</p>
                <p className="text-xs text-slate-500 truncate max-w-[150px]">{selected.email}</p>
                <p className="text-[11px] text-slate-400">{selected.location}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Customer since {selected.customerSince}
          </div>

          {/* 3 mini stats */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Orders</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selected.totalOrders || 5}</p>
            </div>
            <div className="border-x border-slate-200 dark:border-slate-700 px-1">
              <p className="text-[10px] text-slate-400 font-medium">Total Spent</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{selected.totalSpent || '$349.00'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Last Order</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">{selected.lastOrderDate || 'Apr 28, 2024'}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {selected.tags?.map((t, idx) => {
              const color =
                t === 'VIP'
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                  : t === 'Customer'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : t === 'Interested'
                  ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              return (
                <span key={idx} className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${color}`}>
                  {t}
                </span>
              )
            })}
          </div>

          {/* Customer Details Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Customer Details
              </h4>
              <button className="flex items-center gap-1 text-xs text-[#00A884] hover:underline font-medium">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Name</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selected.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selected.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{selected.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selected.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Language</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">English</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-500 italic">
                "{selected.notes || 'Prefers WhatsApp, interested in new product launches.'}"
              </div>
            </div>
          </div>

          {/* Conversation Notes */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Conversation Notes
              </h4>
              <button
                onClick={() => setIsAddingNote((v) => !v)}
                className="text-xs text-[#00A884] hover:underline font-medium"
              >
                + Add Note
              </button>
            </div>

            {isAddingNote && (
              <div className="mb-2 space-y-1.5">
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter a private team note..."
                  className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A884]"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setIsAddingNote(false)}
                    className="px-2 py-0.5 text-[11px] text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-2.5 py-0.5 text-[11px] bg-[#00A884] text-white rounded font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {(selected.conversationNotes || []).map((n, i) => (
                <div key={i} className="p-2 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-lg text-xs">
                  <div className="flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-400 font-semibold mb-1">
                    <span>{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{n.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Activity
              </h4>
              <button className="text-xs text-[#00A884] hover:underline font-medium">View all</button>
            </div>
            <div className="space-y-2.5 text-xs">
              {(selected.recentActivity || [
                { text: 'Order #12345 delivered', time: 'Apr 28, 2024 02:14 PM' },
                { text: 'Campaign message sent', time: 'Apr 20, 2024 11:30 AM' },
                { text: 'Replied to conversation', time: 'Apr 18, 2024 09:12 AM' },
                { text: 'Contact created', time: 'Apr 12, 2024 04:22 PM' },
              ]).map((act, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A884] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{act.text}</p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
