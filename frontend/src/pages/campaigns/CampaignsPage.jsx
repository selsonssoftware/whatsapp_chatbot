import { useState } from 'react'
import { Button, Card, Badge, Tabs, SearchBar, Modal, Icon, Input } from '../../components/index.js'
import { getTemplates } from '../../services/templateService.js'
import { DEMO_CONTACTS } from '../../data/demoData.js'

const DEMO_CAMPAIGNS = [
  {
    id: 1,
    name: 'Welcome Campaign',
    status: 'completed',
    recipients: 1250,
    sent: 1250,
    delivered: 1180,
    read: 950,
    failed: 70,
    templateId: 1,
    scheduledAt: '2026-01-10 10:00',
    sentAt: '2026-01-10 10:05',
    createdAt: '2026-01-08',
  },
  {
    id: 2,
    name: 'Product Launch',
    status: 'completed',
    recipients: 850,
    sent: 850,
    delivered: 820,
    read: 680,
    failed: 30,
    templateId: 1,
    scheduledAt: '2026-01-12 14:00',
    sentAt: '2026-01-12 14:02',
    createdAt: '2026-01-11',
  },
  {
    id: 3,
    name: 'Flash Sale',
    status: 'in_progress',
    recipients: 2000,
    sent: 1800,
    delivered: 1720,
    read: 1200,
    failed: 80,
    templateId: 1,
    scheduledAt: '2026-01-15 09:00',
    sentAt: '2026-01-15 09:01',
    createdAt: '2026-01-13',
  },
  {
    id: 4,
    name: 'Follow-up',
    status: 'scheduled',
    recipients: 500,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    templateId: 2,
    scheduledAt: '2026-01-20 10:00',
    sentAt: null,
    createdAt: '2026-01-16',
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [templates] = useState(() => getTemplates())
  const [form, setForm] = useState({ name: '', templateId: '', recipients: '', scheduledDate: '', scheduledTime: '' })
  const [selectedContacts, setSelectedContacts] = useState([])

  const filtered = campaigns.filter(
    (c) =>
      (filter === 'all' || c.status === filter) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  )

  const createCampaign = () => {
    if (!form.name || !form.templateId || selectedContacts.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    const newCampaign = {
      id: Date.now(),
      name: form.name,
      status: 'scheduled',
      recipients: selectedContacts.length,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
      templateId: Number(form.templateId),
      scheduledAt: `${form.scheduledDate} ${form.scheduledTime}`,
      sentAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    setCampaigns((prev) => [...prev, newCampaign])
    setShowForm(false)
    setForm({ name: '', templateId: '', recipients: '', scheduledDate: '', scheduledTime: '' })
    setSelectedContacts([])
  }

  const viewDetails = (campaign) => {
    setSelectedCampaign(campaign)
    setShowDetails(true)
  }

  const pauseCampaign = (id) => {
    if (!confirm('Pause this campaign?')) return
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'paused' } : c)))
  }

  const resumeCampaign = (id) => {
    if (!confirm('Resume this campaign?')) return
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'in_progress' } : c)))
  }

  const cancelCampaign = (id) => {
    if (!confirm('Cancel this campaign?')) return
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'cancelled' } : c)))
  }

  const duplicateCampaign = (campaign) => {
    const copy = {
      ...campaign,
      id: Date.now(),
      name: campaign.name + ' (Copy)',
      status: 'draft',
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
      scheduledAt: null,
      sentAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setCampaigns((prev) => [...prev, copy])
  }

  const deleteCampaign = (id) => {
    if (!confirm('Delete this campaign?')) return
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  const statusColors = {
    draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
    scheduled: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
    in_progress: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
    completed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    paused: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
    cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
  }

  const toggleContact = (id) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0)
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0)
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.delivered, 0)
  const avgDeliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Campaigns & Broadcast</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage message campaigns</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Icon name="Plus" size={16} />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRecipients.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Messages Sent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalSent.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalDelivered.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Delivery Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgDeliveryRate}%</p>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'draft', label: 'Draft' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ]}
          activeTab={filter}
          onChange={setFilter}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search campaigns..." />
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Read</th>
                <th>Failed</th>
                <th>Scheduled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.name}</td>
                  <td>
                    <Badge className={statusColors[c.status]}>{c.status.replace('_', ' ')}</Badge>
                  </td>
                  <td>{c.recipients}</td>
                  <td>{c.sent}</td>
                  <td>{c.delivered}</td>
                  <td>{c.read}</td>
                  <td>{c.failed}</td>
                  <td>{c.scheduledAt || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => viewDetails(c)} aria-label="View">
                        <Icon name="Eye" size={16} />
                      </button>
                      {c.status === 'in_progress' && (
                        <button className="icon-btn text-yellow-600" onClick={() => pauseCampaign(c.id)} aria-label="Pause">
                          <Icon name="Pause" size={16} />
                        </button>
                      )}
                      {c.status === 'paused' && (
                        <button className="icon-btn text-green-600" onClick={() => resumeCampaign(c.id)} aria-label="Resume">
                          <Icon name="Play" size={16} />
                        </button>
                      )}
                      {(c.status === 'scheduled' || c.status === 'in_progress') && (
                        <button className="icon-btn text-red-600" onClick={() => cancelCampaign(c.id)} aria-label="Cancel">
                          <Icon name="XCircle" size={16} />
                        </button>
                      )}
                      <button className="icon-btn" onClick={() => duplicateCampaign(c)} aria-label="Duplicate">
                        <Icon name="Copy" size={16} />
                      </button>
                      <button className="icon-btn text-red-600" onClick={() => deleteCampaign(c.id)} aria-label="Delete">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Create Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createCampaign}>
              Create Campaign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Campaign Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
            <select
              value={form.templateId}
              onChange={(e) => setForm({ ...form, templateId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Date</label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Time</label>
              <input
                type="time"
                value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Recipients</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {DEMO_CONTACTS.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c.id)}
                    onChange={() => toggleContact(c.id)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{c.phone}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Selected: {selectedContacts.length} contacts</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelectedCampaign(null) }}
        title={selectedCampaign?.name}
        footer={
          <Button variant="secondary" onClick={() => { setShowDetails(false); setSelectedCampaign(null) }}>
            Close
          </Button>
        }
      >
        {selectedCampaign && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge className={statusColors[selectedCampaign.status]}>{selectedCampaign.status.replace('_', ' ')}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedCampaign.createdAt}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Recipients</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedCampaign.recipients}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Sent</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedCampaign.sent}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{selectedCampaign.delivered}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400">Read</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedCampaign.read}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Scheduled At</p>
              <p className="text-gray-900 dark:text-gray-100">{selectedCampaign.scheduledAt || 'Not scheduled'}</p>
            </div>
            {selectedCampaign.sentAt && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sent At</p>
                <p className="text-gray-900 dark:text-gray-100">{selectedCampaign.sentAt}</p>
              </div>
            )}
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Demo Mode: Campaign execution is simulated. No actual messages are sent.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
