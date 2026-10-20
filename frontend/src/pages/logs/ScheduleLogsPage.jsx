import { useState } from 'react'
import { Button, Card, Badge, SearchBar, Icon, Drawer } from '../../components/index.js'

const SEED_SCHEDULE_LOGS = [
  { id: 1, type: 'campaign', name: 'Welcome Campaign', status: 'sent', scheduledAt: '2026-01-15 10:00', executedAt: '2026-01-15 10:05', recipients: 1250, delivered: 1180, failed: 70 },
  { id: 2, type: 'automation', name: 'New Lead Follow-up', status: 'pending', scheduledAt: '2026-01-16 09:00', executedAt: null, recipients: 50, delivered: 0, failed: 0 },
  { id: 3, type: 'campaign', name: 'Flash Sale', status: 'in_progress', scheduledAt: '2026-01-15 14:00', executedAt: '2026-01-15 14:01', recipients: 2000, delivered: 850, failed: 20 },
  { id: 4, type: 'automation', name: 'Customer Birthday', status: 'sent', scheduledAt: '2026-01-14 08:00', executedAt: '2026-01-14 08:01', recipients: 15, delivered: 15, failed: 0 },
  { id: 5, type: 'campaign', name: 'Follow-up', status: 'failed', scheduledAt: '2026-01-13 16:00', executedAt: '2026-01-13 16:01', recipients: 500, delivered: 0, failed: 500 },
]

export default function ScheduleLogsPage() {
  const [logs, setLogs] = useState(SEED_SCHEDULE_LOGS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)

  const filtered = logs.filter(
    (log) =>
      (log.name).toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'all' || log.type === typeFilter) &&
      (statusFilter === 'all' || log.status === statusFilter)
  )

  const viewLog = (log) => {
    setSelectedLog(log)
    setShowDrawer(true)
  }

  const retryTask = (id) => {
    if (!confirm('Retry this task?')) return
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'pending' } : l)))
  }

  const cancelTask = (id) => {
    if (!confirm('Cancel this task?')) return
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'cancelled' } : l)))
  }

  const totalTasks = logs.length
  const sentTasks = logs.filter((l) => l.status === 'sent').length
  const pendingTasks = logs.filter((l) => l.status === 'pending').length
  const failedTasks = logs.filter((l) => l.status === 'failed').length

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Schedule Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor scheduled tasks and their execution status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalTasks}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{sentTasks}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingTasks}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedTasks}</p>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Types</option>
          <option value="campaign">Campaign</option>
          <option value="automation">Automation</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Status</th>
                <th>Scheduled</th>
                <th>Executed</th>
                <th>Recipients</th>
                <th>Delivered</th>
                <th>Failed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>
                    <Badge variant={log.type === 'campaign' ? 'info' : 'warning'}>{log.type}</Badge>
                  </td>
                  <td className="font-medium">{log.name}</td>
                  <td>
                    <Badge
                      variant={
                        log.status === 'sent'
                          ? 'success'
                          : log.status === 'pending'
                          ? 'warning'
                          : log.status === 'in_progress'
                          ? 'info'
                          : 'error'
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>
                  <td>{log.scheduledAt}</td>
                  <td>{log.executedAt || '-'}</td>
                  <td>{log.recipients}</td>
                  <td>{log.delivered}</td>
                  <td>{log.failed}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => viewLog(log)} aria-label="View">
                        <Icon name="Eye" size={16} />
                      </button>
                      {log.status === 'failed' && (
                        <button className="icon-btn text-yellow-600" onClick={() => retryTask(log.id)} aria-label="Retry">
                          <Icon name="RefreshCw" size={16} />
                        </button>
                      )}
                      {(log.status === 'pending' || log.status === 'in_progress') && (
                        <button className="icon-btn text-red-600" onClick={() => cancelTask(log.id)} aria-label="Cancel">
                          <Icon name="XCircle" size={16} />
                        </button>
                      )}
                    </div>
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
        title="Task Details"
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <Badge variant={selectedLog.type === 'campaign' ? 'info' : 'warning'}>{selectedLog.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge
                  variant={
                    selectedLog.status === 'sent'
                      ? 'success'
                      : selectedLog.status === 'pending'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {selectedLog.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Task Name</p>
              <p className="font-medium">{selectedLog.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled At</p>
                <p>{selectedLog.scheduledAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Executed At</p>
                <p>{selectedLog.executedAt || 'Not executed yet'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recipients</p>
                <p className="font-medium">{selectedLog.recipients}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="font-medium text-green-600">{selectedLog.delivered}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p className="font-medium text-red-600">{selectedLog.failed}</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Simulation: no actual background jobs are running.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
