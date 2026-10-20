import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, Button, Icon, Tabs } from '../../components/index.js'
import { CONTACTS, CONVERSATIONS } from '../../data/seedData.js'
import { getOrders } from '../../services/commerceService.js'
import { getTransactions } from '../../services/commerceService.js'

const COLORS = ['#00C667', '#007C72', '#4ade80', '#86efac', '#bbf7d0']

const BASE_MESSAGE_DATA = [
  { name: 'Mon', sent: 450, delivered: 420, read: 380, failed: 30 },
  { name: 'Tue', sent: 520, delivered: 490, read: 440, failed: 30 },
  { name: 'Wed', sent: 480, delivered: 460, read: 410, failed: 20 },
  { name: 'Thu', sent: 600, delivered: 570, read: 520, failed: 30 },
  { name: 'Fri', sent: 550, delivered: 530, read: 480, failed: 20 },
  { name: 'Sat', sent: 320, delivered: 310, read: 280, failed: 10 },
  { name: 'Sun', sent: 280, delivered: 270, read: 250, failed: 10 },
]

const RANGE_FACTORS = { today: 1, '7d': 7, '30d': 30, month: 30 }

function buildSeries(range) {
  if (range === 'today') return BASE_MESSAGE_DATA.slice(-1)
  if (range === '7d') return BASE_MESSAGE_DATA
  const factor = RANGE_FACTORS[range] || 7
  return BASE_MESSAGE_DATA.map((row, index) => ({
    name: `${row.name} w${index + 1}`,
    sent: row.sent * factor,
    delivered: row.delivered * factor,
    read: row.read * factor,
    failed: row.failed * factor,
  }))
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const orders = getOrders()
  const transactions = getTransactions()
  const messageData = buildSeries(dateRange)

  const totals = messageData.reduce(
    (acc, row) => ({
      sent: acc.sent + row.sent,
      delivered: acc.delivered + row.delivered,
      read: acc.read + row.read,
      failed: acc.failed + row.failed,
    }),
    { sent: 0, delivered: 0, read: 0, failed: 0 }
  )

  const deliveryRate = totals.sent ? ((totals.delivered / totals.sent) * 100).toFixed(1) : '0.0'
  const readRate = totals.sent ? ((totals.read / totals.sent) * 100).toFixed(1) : '0.0'
  const openConversations = CONVERSATIONS.filter((c) => c.status !== 'resolved').length

  const conversationData = [
    { name: 'Open', value: openConversations },
    { name: 'Resolved', value: CONVERSATIONS.length - openConversations },
    { name: 'Pending', value: CONVERSATIONS.filter((c) => c.unread > 0).length },
  ].filter((entry) => entry.value > 0)

  const campaignData = orders.map((o) => ({
    name: `Order #${o.id}`,
    sent: o.items.reduce((sum, i) => sum + i.qty, 0),
    delivered: o.paymentStatus === 'paid' ? o.items.reduce((sum, i) => sum + i.qty, 0) : 0,
    read: o.status === 'delivered' ? o.items.reduce((sum, i) => sum + i.qty, 0) : 0,
  }))

  const downloadCsv = (filename, rows) => {
    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportReport = () => {
    downloadCsv('report.csv', [
      ['Period', 'Sent', 'Delivered', 'Read', 'Failed'],
      ...messageData.map((row) => [row.name, row.sent, row.delivered, row.read, row.failed]),
    ])
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics and reporting dashboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Select report date range"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="month">This month</option>
            <option value="custom">Custom range</option>
          </select>
          {dateRange === 'custom' && (
            <>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                aria-label="Custom range start"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                aria-label="Custom range end"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </>
          )}
          <Button variant="secondary" onClick={exportReport}>
            <Icon name="Download" size={16} />
            Export CSV
          </Button>
          <Button variant="secondary" onClick={printReport}>
            <Icon name="Printer" size={16} />
            Print
          </Button>
        </div>
      </div>

      {dateRange === 'custom' && (!customStart || !customEnd || customStart > customEnd) && (
        <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
          Enter a valid custom range (start date before end date). The data below is unchanged until a real report API is connected.
        </p>
      )}

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'messaging', label: 'Messaging' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'commerce', label: 'Orders & Payments' },
          { id: 'contacts', label: 'Contacts' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totals.sent.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Simulated volume for the selected range</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{deliveryRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Delivered / sent</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{readRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Read / sent</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Conversations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{openConversations}</p>
                <p className="text-xs text-gray-500 mt-1">Derived from inbox records</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Messaging Trends">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#00C667" name="Sent" />
                    <Line type="monotone" dataKey="delivered" stroke="#007C72" name="Delivered" />
                    <Line type="monotone" dataKey="read" stroke="#4ade80" name="Read" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Conversation Status">
                {conversationData.length === 0 ? (
                  <p className="text-sm text-gray-500 py-8 text-center">No conversations to chart yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={conversationData} cx="50%" cy="50%" outerRadius={80} label>
                        {conversationData.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>
          </>
        )}

        {activeTab === 'messaging' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Message Performance">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#00C667" name="Sent" />
                    <Bar dataKey="delivered" fill="#007C72" name="Delivered" />
                    <Bar dataKey="read" fill="#4ade80" name="Read" />
                    <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Delivery Rate Trend">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={messageData.map((r) => ({ ...r, rate: Number(((r.delivered / r.sent) * 100).toFixed(1)) }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#00C667" name="Delivery %" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card title="Daily Messaging Summary">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sent</th>
                      <th>Delivered</th>
                      <th>Read</th>
                      <th>Failed</th>
                      <th>Delivery Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messageData.map((data, index) => {
                      const rate = ((data.delivered / data.sent) * 100).toFixed(1)
                      return (
                        <tr key={index}>
                          <td>{data.name}</td>
                          <td>{data.sent.toLocaleString()}</td>
                          <td>{data.delivered.toLocaleString()}</td>
                          <td>{data.read.toLocaleString()}</td>
                          <td>{data.failed.toLocaleString()}</td>
                          <td>{rate}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'campaigns' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Campaign Performance">
                {campaignData.length === 0 ? (
                  <p className="text-sm text-gray-500 py-8 text-center">No campaign records yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sent" fill="#00C667" name="Items" />
                      <Bar dataKey="delivered" fill="#007C72" name="Paid" />
                      <Bar dataKey="read" fill="#4ade80" name="Delivered" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>

              <Card title="Campaign Read Rates">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={campaignData.map((c) => ({ ...c, readRate: c.sent ? Number(((c.read / c.sent) * 100).toFixed(1)) : 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="readRate" fill="#00C667" name="Read Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card title="Campaign Details">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Items</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignData.map((campaign) => (
                      <tr key={campaign.name}>
                        <td className="font-medium">{campaign.name}</td>
                        <td>{campaign.sent}</td>
                        <td>{campaign.delivered}</td>
                        <td>{campaign.read}</td>
                      </tr>
                    ))}
                    {campaignData.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-sm text-gray-500 py-6">
                          No campaign records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'commerce' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Orders (from local records)">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="font-medium">#{o.id}</td>
                        <td>${o.total.toFixed(2)}</td>
                        <td>{o.status}</td>
                        <td>{o.paymentStatus}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-sm text-gray-500 py-6">
                          No orders yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Transactions (from local records)">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="font-medium">#{t.id}</td>
                        <td>${t.amount.toFixed(2)}</td>
                        <td>{t.method}</td>
                        <td>{t.status}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-sm text-gray-500 py-6">
                          No transactions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contacts' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{CONTACTS.length}</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Contacts</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {CONTACTS.filter((c) => c.status === 'active').length}
                </p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">With Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {CONTACTS.filter((c) => c.tags && c.tags.length > 0).length}
                </p>
              </Card>
            </div>

            <Card title="Contact Distribution by Groups">
              <div className="space-y-3">
                {['Customers', 'Leads', 'VIP'].map((group) => {
                  const count = CONTACTS.filter((c) => c.groups?.includes(group)).length
                  const percentage = CONTACTS.length ? ((count / CONTACTS.length) * 100).toFixed(1) : '0.0'
                  return (
                    <div key={group}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{group}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{count} contacts ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <Icon name="Info" size={16} className="inline mr-1" />
          Simulation: messaging analytics are simulated, while order, payment and contact figures are derived from local records.
          Real-time analytics will be available after backend integration.
        </p>
      </div>
    </div>
  )
}
