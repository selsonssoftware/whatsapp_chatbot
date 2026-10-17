import { useState } from 'react'
import { Button, Card, Badge, Tabs, SearchBar, Drawer, Icon, Input } from '../../components/index.js'

const DEMO_LEADS = [
  { id: 1, name: 'John Smith', company: 'Acme Corp', value: 5000, stage: 'new', source: 'Website', assignedTo: 'Alex Agent', contactId: 1, createdAt: '2026-01-10', notes: '', activities: [] },
  { id: 2, name: 'Sarah Johnson', company: 'Beta Inc', value: 12000, stage: 'qualified', source: 'Referral', assignedTo: 'Sam Support', contactId: 2, createdAt: '2026-01-12', notes: '', activities: [] },
  { id: 3, name: 'Mike Brown', company: 'Gamma LLC', value: 8000, stage: 'proposal', source: 'LinkedIn', assignedTo: 'Alex Agent', contactId: null, createdAt: '2026-01-14', notes: '', activities: [] },
  { id: 4, name: 'Emily Davis', company: 'Delta Co', value: 15000, stage: 'negotiation', source: 'Cold Call', assignedTo: 'Morgan Manager', contactId: null, createdAt: '2026-01-15', notes: '', activities: [] },
  { id: 5, name: 'Chris Wilson', company: 'Epsilon Ltd', value: 25000, stage: 'closed', source: 'Trade Show', assignedTo: 'Alex Agent', contactId: null, createdAt: '2026-01-08', notes: '', activities: [] },
]

const STAGES = ['new', 'qualified', 'proposal', 'negotiation', 'closed']

export default function LeadsPage() {
  const [leads, setLeads] = useState(DEMO_LEADS)
  const [view, setView] = useState('kanban')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', value: '', stage: 'new', source: '', assignedTo: '' })
  const [editingLead, setEditingLead] = useState(null)

  const filteredLeads = leads.filter((l) => (l.name + ' ' + l.company).toLowerCase().includes(search.toLowerCase()))

  const stageLeads = (stage) => filteredLeads.filter((l) => l.stage === stage)

  const moveLead = (leadId, newStage) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)))
  }

  const openLead = (lead) => {
    setSelectedLead(lead)
    setShowDrawer(true)
  }

  const editLead = (lead) => {
    setEditingLead(lead)
    setForm({
      name: lead.name,
      company: lead.company,
      value: lead.value,
      stage: lead.stage,
      source: lead.source,
      assignedTo: lead.assignedTo,
    })
    setShowForm(true)
  }

  const saveLead = () => {
    if (!form.name || !form.company) {
      alert('Name and company are required')
      return
    }
    const leadData = {
      ...form,
      value: Number(form.value),
      contactId: null,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: '',
      activities: [],
    }

    if (editingLead) {
      setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? { ...l, ...leadData } : l)))
    } else {
      setLeads((prev) => [...prev, { ...leadData, id: Date.now() }])
    }

    setShowForm(false)
    setEditingLead(null)
    setForm({ name: '', company: '', value: '', stage: 'new', source: '', assignedTo: '' })
  }

  const deleteLead = (id) => {
    if (!confirm('Delete this lead?')) return
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setShowDrawer(false)
  }

  const updateLeadNotes = (notes) => {
    setLeads((prev) => prev.map((l) => (l.id === selectedLead?.id ? { ...l, notes } : l)))
    setSelectedLead((prev) => (prev ? { ...prev, notes } : null))
  }

  const stageColors = {
    new: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
    qualified: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    proposal: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
    negotiation: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400',
    closed: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400',
  }

  const stageLabels = {
    new: 'New',
    qualified: 'Qualified',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed: 'Closed Won',
  }

  const totalValue = leads.reduce((sum, l) => sum + l.value, 0)
  const closedValue = leads.filter((l) => l.stage === 'closed').reduce((sum, l) => sum + l.value, 0)
  const conversionRate = leads.length > 0 ? ((leads.filter((l) => l.stage === 'closed').length / leads.length) * 100).toFixed(1) : 0

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Leads & Pipeline</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your sales pipeline</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingLead(null); setForm({ name: '', company: '', value: '', stage: 'new', source: '', assignedTo: '' }); setShowForm(true) }}>
          <Icon name="Plus" size={16} />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{leads.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pipeline Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalValue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Closed Value</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${closedValue.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{conversionRate}%</p>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs
          tabs={[
            { id: 'kanban', label: 'Kanban' },
            { id: 'table', label: 'Table' },
          ]}
          activeTab={view}
          onChange={setView}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Search leads..." />
      </div>

      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {STAGES.map((stage) => (
            <div key={stage} className="min-w-[250px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stageLabels[stage]}</h3>
                <Badge variant="info">{stageLeads(stage).length}</Badge>
              </div>
              <div className="space-y-3">
                {stageLeads(stage).map((lead) => (
                  <Card key={lead.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openLead(lead)}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</h4>
                      <Badge variant="info" className="text-xs">${lead.value.toLocaleString()}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{lead.company}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{lead.source}</span>
                      <span>{lead.assignedTo}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'table' && (
        <Card>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Source</th>
                  <th>Assigned To</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium">{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>${lead.value.toLocaleString()}</td>
                    <td>
                      <Badge className={stageColors[lead.stage]}>{stageLabels[lead.stage]}</Badge>
                    </td>
                    <td>{lead.source}</td>
                    <td>{lead.assignedTo}</td>
                    <td>{lead.createdAt}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="icon-btn" onClick={() => openLead(lead)} aria-label="View">
                          <Icon name="Eye" size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => editLead(lead)} aria-label="Edit">
                          <Icon name="Edit" size={16} />
                        </button>
                        <button className="icon-btn text-red-600" onClick={() => deleteLead(lead.id)} aria-label="Delete">
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
      )}

      <Drawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setSelectedLead(null) }}
        title={selectedLead?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDrawer(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={() => selectedLead && deleteLead(selectedLead.id)}>
              Delete
            </Button>
            <Button variant="primary" onClick={() => { setShowDrawer(false); selectedLead && editLead(selectedLead) }}>
              Edit
            </Button>
          </>
        }
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedLead.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
                <p className="text-gray-900 dark:text-gray-100">${selectedLead.value.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
                <Badge className={stageColors[selectedLead.stage]}>{stageLabels[selectedLead.stage]}</Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedLead.source}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
              <p className="text-gray-900 dark:text-gray-100">{selectedLead.assignedTo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Move Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => moveLead(selectedLead.id, stage)}
                    className={`px-3 py-1 rounded text-sm ${selectedLead.stage === stage ? stageColors[stage] : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {stageLabels[stage]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
              <textarea
                value={selectedLead.notes || ''}
                onChange={(e) => updateLeadNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Add notes about this lead..."
              />
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingLead(null) }}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingLead(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveLead}>
              {editingLead ? 'Update' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stageLabels[stage]}
                </option>
              ))}
            </select>
          </div>
          <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <Input label="Assigned To" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
        </div>
      </Drawer>
    </div>
  )
}
