import { useState } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Plus,
  Eye,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  QrCode,
  Smartphone,
  ExternalLink,
} from 'lucide-react'
import { BLAST_KPIS, PAYMENTS_DATA } from '../../data/mockBlastData.js'

export default function PaymentsPage() {
  const [payments, setPayments] = useState(PAYMENTS_DATA)
  const [activeTab, setActiveTab] = useState('transactions')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [methodFilter, setMethodFilter] = useState('All Payment Methods')
  const [showDrawer, setShowDrawer] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState('Sports Shoe - $49.99')
  const [quantity, setQuantity] = useState(1)
  const [customerPhone, setCustomerPhone] = useState('98765 43210')
  const [feedback, setFeedback] = useState(null)

  const handleGenerateLink = () => {
    setFeedback('Payment link and QR code generated successfully!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== 'All Status' && p.status !== statusFilter) return false
    if (methodFilter !== 'All Payment Methods' && p.method !== methodFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.orderId.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q) ||
        p.product.toLowerCase().includes(q)
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
            Payments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Accept payments on WhatsApp with secure and seamless checkout. Track transactions, refunds and manage payment settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            Settings
          </button>
          <button
            onClick={() => setShowDrawer(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Payment Link
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
            <span className="text-xs font-medium text-slate-500">Total Payments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.payments.totalPayments.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.payments.totalPayments.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.payments.totalPayments.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Successful Payments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.payments.successfulPayments.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.payments.successfulPayments.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.payments.successfulPayments.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Pending Payments</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.payments.pendingPayments.value}
            </h3>
            <span className="text-xs font-semibold text-amber-500">
              {BLAST_KPIS.payments.pendingPayments.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.payments.pendingPayments.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Refunded Amount</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.payments.refundedAmount.value}
            </h3>
            <span className="text-xs font-semibold text-purple-600">
              {BLAST_KPIS.payments.refundedAmount.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.payments.refundedAmount.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['Transactions', 'Payment Links', 'Payment Methods', 'Settings', 'Analytics'].map((tab) => {
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
                placeholder="Search by order ID, customer name or phone number..."
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
                <option>Success</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Payment Methods</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Wallet</option>
                <option>Net Banking</option>
              </select>

              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>May 01, 2024 - May 31, 2024</span>
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
                  <th className="py-2.5 px-3 font-semibold">Order ID</th>
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">Product / Service</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Payment Method</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <input type="checkbox" className="rounded accent-[#00A884]" />
                    </td>
                    <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {p.orderId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {p.customer.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {p.customer}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{p.product}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{p.amount}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                        {p.method === 'UPI' && '⚡ UPI'}
                        {p.method === 'Card' && '💳 Card'}
                        {p.method === 'Wallet' && '👛 Wallet'}
                        {p.method === 'Net Banking' && '🏦 Net Banking'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          p.status === 'Success'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : p.status === 'Pending'
                            ? 'text-amber-500'
                            : p.status === 'Failed'
                            ? 'text-rose-500'
                            : 'text-purple-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'Success'
                              ? 'bg-emerald-500'
                              : p.status === 'Pending'
                              ? 'bg-amber-500'
                              : p.status === 'Failed'
                              ? 'bg-rose-500'
                              : 'bg-purple-600'
                          }`}
                        />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{p.date}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button className="p-1 hover:text-[#00A884] rounded">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:text-slate-600 rounded">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
              <span>...</span>
              <button className="px-1 text-xs">32</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Create Payment Link & QR Code */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#00A884]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Create Payment Link
                </h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product / Service *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <option>Sports Shoe - $49.99</option>
                  <option>Smart Watch - $89.99</option>
                  <option>Travel Backpack - $39.99</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Customer Phone (Optional)
                </label>
                <div className="flex">
                  <span className="p-2 border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-l-lg text-slate-500">
                    +91
                  </span>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="flex-1 p-2 border border-slate-200 dark:border-slate-700 rounded-r-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateLink}
                className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                Generate Payment Link
              </button>
            </div>

            {/* Generated Payment QR Code Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Payment QR Code
              </span>

              {/* Clean SVG QR Code */}
              <div className="flex justify-center my-2">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
                  <svg className="w-28 h-28" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="30" height="30" fill="#000" />
                    <rect x="5" y="5" width="20" height="20" fill="#fff" />
                    <rect x="10" y="10" width="10" height="10" fill="#000" />
                    <rect x="70" y="0" width="30" height="30" fill="#000" />
                    <rect x="75" y="5" width="20" height="20" fill="#fff" />
                    <rect x="80" y="10" width="10" height="10" fill="#000" />
                    <rect x="0" y="70" width="30" height="30" fill="#000" />
                    <rect x="5" y="75" width="20" height="20" fill="#fff" />
                    <rect x="10" y="80" width="10" height="10" fill="#000" />
                    {/* Data dots */}
                    <rect x="35" y="10" width="8" height="8" fill="#000" />
                    <rect x="50" y="15" width="8" height="8" fill="#000" />
                    <rect x="35" y="35" width="10" height="10" fill="#000" />
                    <rect x="55" y="35" width="15" height="10" fill="#000" />
                    <rect x="35" y="60" width="8" height="15" fill="#000" />
                    <rect x="50" y="65" width="12" height="8" fill="#000" />
                    <rect x="70" y="55" width="10" height="10" fill="#000" />
                    <rect x="85" y="70" width="12" height="12" fill="#000" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Scan to Pay via UPI / Card / Wallet</p>

              <div className="flex justify-center gap-2 pt-1">
                <button className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">
                  <Download className="w-3 h-3 text-slate-500" /> Download QR
                </button>
                <button className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">
                  <Share2 className="w-3 h-3 text-slate-500" /> Share
                </button>
              </div>
            </div>

            {/* WhatsApp Payment Preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                WhatsApp Preview
              </span>

              <div className="p-3 bg-[#EFEAE2] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 shadow-xs border border-slate-200/50 dark:border-slate-800 text-xs max-w-[90%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-600">
                      👟
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">Sports Shoe</h5>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$49.99</span>
                    </div>
                  </div>
                  <button className="w-full py-1.5 bg-[#00A884] text-white font-bold rounded-lg shadow-2xs hover:bg-[#008f6f] flex items-center justify-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> Pay Now
                  </button>
                  <div className="flex justify-end text-[9px] text-slate-400 mt-1">10:30 AM ✓✓</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
