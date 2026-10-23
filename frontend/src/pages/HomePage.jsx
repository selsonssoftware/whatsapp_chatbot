import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Lightbulb,
  MessageSquare,
  MoreVertical,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'

const PERFORMANCE_DATA = [
  { name: 'May 01', sent: 12500, delivered: 11800, read: 9400 },
  { name: 'May 02', sent: 14200, delivered: 13400, read: 10800 },
  { name: 'May 03', sent: 18500, delivered: 17600, read: 14200 },
  { name: 'May 04', sent: 19800, delivered: 18900, read: 15400 },
  { name: 'May 05', sent: 18200, delivered: 17400, read: 14100 },
  { name: 'May 06', sent: 19100, delivered: 18200, read: 14900 },
  { name: 'May 07', sent: 20400, delivered: 19500, read: 16200 },
]

const CONVERSATION_STATUS_DATA = [
  { name: 'Open', value: 612, percentage: '47.7%', color: '#00A884' },
  { name: 'Pending', value: 394, percentage: '30.7%', color: '#38BDF8' },
  { name: 'Resolved', value: 278, percentage: '21.6%', color: '#86EFAC' },
]

const RECENT_CAMPAIGNS = [
  {
    id: 1,
    name: 'Summer Collection 2024',
    subtitle: 'Promotional Campaign',
    sent: '12,540',
    deliveryRate: 98.2,
    status: 'Completed',
    date: 'May 07, 2024',
    time: '10:30 AM',
    iconColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    name: 'New Product Launch',
    subtitle: 'Product Announcement',
    sent: '8,420',
    deliveryRate: 96.8,
    status: 'Completed',
    date: 'May 05, 2024',
    time: '02:15 PM',
    iconColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 3,
    name: 'Cart Recovery',
    subtitle: 'Abandoned Cart',
    sent: '6,218',
    deliveryRate: 94.1,
    status: 'Completed',
    date: 'May 03, 2024',
    time: '11:20 AM',
    iconColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 4,
    name: 'Re-engagement',
    subtitle: 'Win Back Campaign',
    sent: '4,950',
    deliveryRate: 92.6,
    status: 'Running',
    date: 'May 02, 2024',
    time: '09:45 AM',
    iconColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 5,
    name: 'Flash Sale',
    subtitle: 'Limited Time Offer',
    sent: '11,320',
    deliveryRate: 97.4,
    status: 'Completed',
    date: 'May 01, 2024',
    time: '01:10 PM',
    iconColor: 'bg-rose-100 text-rose-700',
  },
]

const AGENTS_ACTIVITY = [
  {
    name: 'Alex Johnson',
    conversations: 342,
    responseTime: '2m 14s',
    status: 'Online',
    avatar: 'A',
    avatarBg: 'bg-blue-600',
  },
  {
    name: 'Maria Garcia',
    conversations: 286,
    responseTime: '3m 02s',
    status: 'Online',
    avatar: 'M',
    avatarBg: 'bg-purple-600',
  },
  {
    name: 'Rahul Mehta',
    conversations: 198,
    responseTime: '4m 35s',
    status: 'Online',
    avatar: 'R',
    avatarBg: 'bg-emerald-600',
  },
  {
    name: 'Sarah Lee',
    conversations: 176,
    responseTime: '3m 18s',
    status: 'Away',
    avatar: 'S',
    avatarBg: 'bg-amber-600',
  },
  {
    name: 'Daniel Kim',
    conversations: 154,
    responseTime: '5m 21s',
    status: 'Offline',
    avatar: 'D',
    avatarBg: 'bg-slate-600',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('May 01, 2024 - May 07, 2024')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const totalConversations = useMemo(
    () => CONVERSATION_STATUS_DATA.reduce((acc, curr) => acc + curr.value, 0),
    []
  )

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening with your WhatsApp CRM today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 transition"
            >
              <Calendar size={14} className="text-slate-400" />
              <span>{dateRange}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 z-20 text-xs animate-in fade-in zoom-in-95">
                {[
                  'Today (May 07, 2024)',
                  'Yesterday',
                  'May 01, 2024 - May 07, 2024',
                  'Last 30 days',
                  'This month (May 2024)',
                ].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range)
                      setShowDatePicker(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      dateRange === range
                        ? 'bg-emerald-50 text-emerald-800 font-semibold dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => navigate('/compose')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A884] hover:bg-[#008f6f] text-white text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-95"
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Screenshot Page 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Contacts */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Contacts
            </span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#00A884] flex items-center justify-center">
              <Users size={18} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              24,850
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +12.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            vs. previous 7 days
          </p>
        </div>

        {/* Card 2: Active Conversations */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Active Conversations
            </span>
            <span className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              1,284
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +8.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            vs. previous 7 days
          </p>
        </div>

        {/* Card 3: Messages Sent */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Messages Sent
            </span>
            <span className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Send size={18} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              86,420
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +18.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            vs. previous 7 days
          </p>
        </div>

        {/* Card 4: Campaign Delivery Rate */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Campaign Delivery
            </span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              96.8%
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ↑ +2.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            vs. previous 7 days
          </p>
        </div>
      </div>

      {/* Row 2: Charts (Messaging Performance & Conversation Status Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Messaging Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Messaging Performance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Messages sent, delivered and read over the last 7 days
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00A884]" />
                  Sent
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                  Delivered
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                  Read
                </span>
              </div>

              <select
                aria-label="Messaging performance time range"
                className="text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A884" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00A884" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="sent" stroke="#00A884" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="delivered" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorDelivered)" />
                <Area type="monotone" dataKey="read" stroke="#34D399" strokeWidth={2} fillOpacity={1} fill="url(#colorRead)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Conversation Status Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Conversation Status
            </h2>
            <select
              aria-label="Conversation status time range"
              className="text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CONVERSATION_STATUS_DATA}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {CONVERSATION_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {totalConversations.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Conversations
                </span>
              </div>
            </div>
          </div>

          {/* Donut Breakdown Legend List */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-3">
            {CONVERSATION_STATUS_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.value}
                  </span>
                  <span className="text-slate-400 font-medium w-11 text-right">
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Campaigns & Team Activity + AI Assistant Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Recent Campaigns Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Campaigns
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your latest broadcast campaigns
              </p>
            </div>

            <Link
              to="/campaigns"
              className="text-xs font-semibold text-[#00A884] hover:underline flex items-center gap-1"
            >
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="pb-3 font-semibold">Campaign Name</th>
                  <th className="pb-3 font-semibold">Sent</th>
                  <th className="pb-3 font-semibold w-36">Delivery Rate</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {RECENT_CAMPAIGNS.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-750 transition group">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconColor}`}>
                          <Send size={14} />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {c.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                      {c.sent}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 w-10">
                          {c.deliveryRate}%
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#00A884]"
                            style={{ width: `${c.deliveryRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 text-slate-500 whitespace-nowrap">
                      <div>{c.date}</div>
                      <div className="text-[10px] text-slate-400">{c.time}</div>
                    </td>

                    <td className="py-3 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Team Inbox Activity & AI Assistant Tip */}
        <div className="space-y-5 flex flex-col">
          {/* Team Activity Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Team Inbox Activity
              </h2>
              <Link
                to="/team"
                className="text-xs font-semibold text-[#00A884] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {AGENTS_ACTIVITY.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ${agent.avatarBg}`}
                    >
                      {agent.avatar}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                        {agent.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {agent.conversations} conv · {agent.responseTime}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'Online'
                          ? 'bg-emerald-500'
                          : agent.status === 'Away'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Tip Box (Screenshot Page 1 Bottom Right) */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-800 dark:to-slate-800 rounded-2xl p-4 border border-emerald-200/60 dark:border-emerald-800/40 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#007C72] dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles size={14} />
                AI Assistant
              </span>
              <Link
                to="/reports"
                className="text-[11px] font-semibold text-[#00A884] hover:underline"
              >
                View report →
              </Link>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb size={16} />
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white font-semibold">
                  Engagement is up by 18% this week!
                </strong>{' '}
                Your message read rate improved from 72% to 85%. Consider
                sending a follow-up campaign to contacts who haven't replied yet
                to boost conversions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
