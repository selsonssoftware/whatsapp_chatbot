import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { KPICard, Card, Badge, Button } from '../components/index.js'
import { Icon } from '../components/index.js'
import { Users, MessageSquare, Send, TrendingUp } from 'lucide-react'

const dashboardData = {
  kpis: [
    { title: 'Total Contacts', value: '2,847', trend: { value: '12%', positive: true }, icon: Users },
    { title: 'Active Conversations', value: '156', trend: { value: '8%', positive: true }, icon: MessageSquare },
    { title: 'Messages Sent', value: '12,453', trend: { value: '23%', positive: true }, icon: Send },
    { title: 'Campaign Delivery Rate', value: '94.5%', trend: { value: '2%', positive: false }, icon: TrendingUp },
  ],
  messagingPerformance: [
    { name: 'Mon', sent: 450, delivered: 420, read: 380 },
    { name: 'Tue', sent: 520, delivered: 490, read: 440 },
    { name: 'Wed', sent: 480, delivered: 460, read: 410 },
    { name: 'Thu', sent: 600, delivered: 570, read: 520 },
    { name: 'Fri', sent: 550, delivered: 530, read: 480 },
    { name: 'Sat', sent: 320, delivered: 310, read: 280 },
    { name: 'Sun', sent: 280, delivered: 270, read: 250 },
  ],
  conversationStatus: [
    { name: 'Open', value: 89 },
    { name: 'Resolved', value: 45 },
    { name: 'Pending', value: 22 },
  ],
  recentCampaigns: [
    { id: 1, name: 'Welcome Campaign', status: 'Completed', recipients: 1250, sent: 1250, delivered: 1180, read: 950, date: '2026-01-15' },
    { id: 2, name: 'Product Launch', status: 'Completed', recipients: 850, sent: 850, delivered: 820, read: 680, date: '2026-01-14' },
    { id: 3, name: 'Flash Sale', status: 'In Progress', recipients: 2000, sent: 1800, delivered: 1720, read: 1200, date: '2026-01-13' },
    { id: 4, name: 'Follow-up', status: 'Scheduled', recipients: 500, sent: 0, delivered: 0, read: 0, date: '2026-01-18' },
  ],
  inboxActivity: [
    { agent: 'Alex Agent', conversations: 45, resolved: 38, avgResponse: '2m' },
    { agent: 'Sam Support', conversations: 38, resolved: 32, avgResponse: '3m' },
    { agent: 'Morgan Manager', conversations: 28, resolved: 25, avgResponse: '4m' },
  ],
  aiInsights: [
    { type: 'opportunity', message: '15 customers showing purchase intent based on recent conversations' },
    { type: 'alert', message: 'Response time increased by 30% in the last hour' },
    { type: 'info', message: 'AI resolved 45 queries automatically this week' },
  ],
}

export default function HomePage() {
  const [dateRange, setDateRange] = useState('7d')

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <Icon name="Download" size={16} />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardData.kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Messaging Performance">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.messagingPerformance}>
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
            <BarChart data={dashboardData.conversationStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#25D366" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Recent Campaigns" className="lg:col-span-2">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Delivered</th>
                  <th>Read</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="font-medium">{campaign.name}</td>
                    <td>
                      <Badge
                        variant={
                          campaign.status === 'Completed'
                            ? 'success'
                            : campaign.status === 'In Progress'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                    <td>{campaign.recipients}</td>
                    <td>{campaign.delivered}</td>
                    <td>{campaign.read}</td>
                    <td>{campaign.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Team Inbox Activity">
          <div className="space-y-4">
            {dashboardData.inboxActivity.map((activity, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{activity.agent}</span>
                  <Badge variant="info">{activity.conversations} conv</Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div>Resolved: {activity.resolved}</div>
                  <div>Avg Response: {activity.avgResponse}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="AI Assistant Insights">
        <div className="space-y-3">
          {dashboardData.aiInsights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : insight.type === 'alert'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={insight.type === 'opportunity' ? 'TrendingUp' : insight.type === 'alert' ? 'AlertCircle' : 'Info'}
                  size={20}
                  className={
                    insight.type === 'opportunity'
                      ? 'text-green-600 dark:text-green-400'
                      : insight.type === 'alert'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }
                />
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
