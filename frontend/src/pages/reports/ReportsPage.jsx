import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, Button, Badge, SearchBar, Icon, Tabs } from '../../components/index.js'
import { DEMO_CONTACTS } from '../../data/demoData.js'

const COLORS = ['#25D366', '#128C7E', '#4ade80', '#86efac', '#bbf7d0']

const demoMessageData = [
  { name: 'Mon', sent: 450, delivered: 420, read: 380, failed: 30 },
  { name: 'Tue', sent: 520, delivered: 490, read: 440, failed: 30 },
  { name: 'Wed', sent: 480, delivered: 460, read: 410, failed: 20 },
  { name: 'Thu', sent: 600, delivered: 570, read: 520, failed: 30 },
  { name: 'Fri', sent: 550, delivered: 530, read: 480, failed: 20 },
  { name: 'Sat', sent: 320, delivered: 310, read: 280, failed: 10 },
  { name: 'Sun', sent: 280, delivered: 270, read: 250, failed: 10 },
]

const demoConversationData = [
  { name: 'Open', value: 89 },
  { name: 'Resolved', value: 45 },
  { name: 'Pending', value: 22 },
]

const demoCampaignData = [
  { name: 'Welcome', sent: 1250, delivered: 1180, read: 950 },
  { name: 'Product Launch', sent: 850, delivered: 820, read: 680 },
  { name: 'Flash Sale', sent: 2000, delivered: 1720, read: 1200 },
  { name: 'Follow-up', sent: 500, delivered: 480, read: 400 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  const exportReport = () => {
    alert('Demo: Report exported as CSV')
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive analytics and reporting dashboard</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
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

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'messaging', label: 'Messaging' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'contacts', label: 'Contacts' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3,200</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% from last period</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">94.5%</p>
                <p className="text-sm text-red-600 mt-1">↓ 2% from last period</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">78.2%</p>
                <p className="text-sm text-green-600 mt-1">↑ 5% from last period</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2,847</p>
                <p className="text-sm text-green-600 mt-1">↑ 8% from last period</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Messaging Trends">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={demoMessageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sent" stroke="#25D366" name="Sent" />
                    <Line type="monotone" dataKey="delivered" stroke="#128C7E" name="Delivered" />
                    <Line type="monotone" dataKey="read" stroke="#4ade80" name="Read" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Conversation Status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={demoConversationData} cx="50%" cy="50%" outerRadius={80} label>
                      {demoConversationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'messaging' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Message Performance">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={demoMessageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#25D366" name="Sent" />
                    <Bar dataKey="delivered" fill="#128C7E" name="Delivered" />
                    <Bar dataKey="read" fill="#4ade80" name="Read" />
                    <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Delivery Rate Trend">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={demoMessageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="delivered" stroke="#25D366" name="Delivery %" />
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
                    {demoMessageData.map((data, index) => {
                      const rate = ((data.delivered / data.sent) * 100).toFixed(1)
                      return (
                        <tr key={index}>
                          <td>{data.name}</td>
                          <td>{data.sent}</td>
                          <td>{data.delivered}</td>
                          <td>{data.read}</td>
                          <td>{data.failed}</td>
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
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={demoCampaignData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#25D366" name="Sent" />
                    <Bar dataKey="delivered" fill="#128C7E" name="Delivered" />
                    <Bar dataKey="read" fill="#4ade80" name="Read" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Campaign Read Rates">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={demoCampaignData.map((c) => ({ ...c, readRate: ((c.read / c.sent) * 100).toFixed(1) }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="readRate" fill="#25D366" name="Read Rate %" />
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
                      <th>Sent</th>
                      <th>Delivered</th>
                      <th>Read</th>
                      <th>Delivery Rate</th>
                      <th>Read Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoCampaignData.map((campaign) => {
                      const deliveryRate = ((campaign.delivered / campaign.sent) * 100).toFixed(1)
                      const readRate = ((campaign.read / campaign.sent) * 100).toFixed(1)
                      return (
                        <tr key={campaign.name}>
                          <td className="font-medium">{campaign.name}</td>
                          <td>{campaign.sent}</td>
                          <td>{campaign.delivered}</td>
                          <td>{campaign.read}</td>
                          <td>{deliveryRate}%</td>
                          <td>{readRate}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{DEMO_CONTACTS.length}</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Contacts</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{DEMO_CONTACTS.filter((c) => c.status === 'active').length}</p>
              </Card>
              <Card>
                <p className="text-sm text-gray-600 dark:text-gray-400">With Tags</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{DEMO_CONTACTS.filter((c) => c.tags && c.tags.length > 0).length}</p>
              </Card>
            </div>

            <Card title="Contact Distribution by Groups">
              <div className="space-y-3">
                {['Customers', 'Leads', 'VIP'].map((group) => {
                  const count = DEMO_CONTACTS.filter((c) => c.groups?.includes(group)).length
                  const percentage = ((count / DEMO_CONTACTS.length) * 100).toFixed(1)
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
          Demo Mode: All analytics are based on simulated demo data. Real-time analytics will be available after backend integration.
        </p>
      </div>
    </div>
  )
}
