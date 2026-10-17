import { useState } from 'react'
import { Button, Card, Badge, SearchBar, Icon, Input, Tabs, Drawer } from '../../components/index.js'

const DEMO_API_LOGS = [
  { id: 1, method: 'POST', endpoint: '/api/messages/send', status: 200, duration: 245, timestamp: '2026-01-15 10:30:45', summary: 'Message sent successfully' },
  { id: 2, method: 'GET', endpoint: '/api/contacts', status: 200, duration: 89, timestamp: '2026-01-15 10:29:12', summary: 'Retrieved 25 contacts' },
  { id: 3, method: 'POST', endpoint: '/api/templates', status: 201, duration: 156, timestamp: '2026-01-15 10:28:33', summary: 'Template created' },
  { id: 4, method: 'POST', endpoint: '/api/webhook', status: 500, duration: 1200, timestamp: '2026-01-15 10:27:15', summary: 'Webhook processing failed' },
  { id: 5, method: 'GET', endpoint: '/api/campaigns/1', status: 200, duration: 67, timestamp: '2026-01-15 10:26:44', summary: 'Campaign details retrieved' },
  { id: 6, method: 'POST', endpoint: '/api/auth/login', status: 401, duration: 45, timestamp: '2026-01-15 10:25:22', summary: 'Authentication failed' },
]

export default function ApiLogsPage() {
  const [logs, setLogs] = useState(DEMO_API_LOGS)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)

  const filtered = logs.filter(
    (log) =>
      (log.endpoint + log.summary).toLowerCase().includes(search.toLowerCase()) &&
      (methodFilter === 'all' || log.method === methodFilter) &&
      (statusFilter === 'all' || log.status === statusFilter)
  )

  const viewLog = (log) => {
    setSelectedLog(log)
    setShowDrawer(true)
  }

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Method', 'Endpoint', 'Status', 'Duration', 'Timestamp', 'Summary'],
      ...logs.map((l) => [l.id, l.method, l.endpoint, l.status, l.duration, l.timestamp, l.summary]),
    ]
      .map((row) => row.join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'api-logs.csv'
    a.click()
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">API Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor API requests and responses</p>
        </div>
        <Button variant="secondary" onClick={exportLogs}>
          <Icon name="Download" size={16} />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." />
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="200">2xx Success</option>
          <option value="400">4xx Client Error</option>
          <option value="500">5xx Server Error</option>
        </select>
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Timestamp</th>
                <th>Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>
                    <Badge variant={log.method === 'GET' ? 'info' : log.method === 'POST' ? 'success' : 'warning'}>{log.method}</Badge>
                  </td>
                  <td className="font-mono text-sm">{log.endpoint}</td>
                  <td>
                    <Badge variant={log.status >= 200 && log.status < 300 ? 'success' : log.status >= 400 && log.status < 500 ? 'warning' : 'error'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td>{log.duration}ms</td>
                  <td>{log.timestamp}</td>
                  <td>{log.summary}</td>
                  <td>
                    <button className="icon-btn" onClick={() => viewLog(log)} aria-label="View">
                      <Icon name="Eye" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setSelectedLog(null) }}
        title="API Request Details"
        footer={
          <Button variant="secondary" onClick={() => { setShowDrawer(false); setSelectedLog(null) }}>
            Close
          </Button>
        }
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
                <Badge variant={selectedLog.method === 'GET' ? 'info' : 'success'}>{selectedLog.method}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge variant={selectedLog.status >= 200 && selectedLog.status < 300 ? 'success' : 'error'}>{selectedLog.status}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Endpoint</p>
              <p className="font-mono text-sm">{selectedLog.endpoint}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                <p>{selectedLog.duration}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Timestamp</p>
                <p>{selectedLog.timestamp}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Summary</p>
              <p>{selectedLog.summary}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Request Body (Demo)</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
                {JSON.stringify({ data: 'Sample request data...' }, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Response Body (Demo)</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
                {JSON.stringify({ success: true, message: 'Sample response...' }, null, 2)}
              </pre>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Sensitive data (API keys, tokens) is masked and not displayed.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
