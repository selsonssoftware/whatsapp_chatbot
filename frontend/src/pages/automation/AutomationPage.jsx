import { useState } from 'react'
import { getAutomations, saveAutomations } from '../../services/automationService.js'
import { Button, Card, Badge, SearchBar, Icon } from '../../components/index.js'

const NODE_TYPES = [
  { type: 'Trigger', icon: 'Play', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' },
  { type: 'Send Message', icon: 'Send', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' },
  { type: 'Send Template', icon: 'FileText', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400' },
  { type: 'Condition', icon: 'GitBranch', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' },
  { type: 'Delay', icon: 'Clock', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' },
  { type: 'Add Tag', icon: 'Tag', color: 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400' },
  { type: 'Assign Agent', icon: 'Users', color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400' },
  { type: 'Add to Group', icon: 'Users', color: 'bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400' },
  { type: 'AI Agent', icon: 'Sparkles', color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400' },
  { type: 'Webhook', icon: 'Code', color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' },
  { type: 'End', icon: 'XCircle', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' },
]

export default function AutomationPage() {
  const [items, setItems] = useState(() => getAutomations())
  const [editing, setEditing] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [nodeCounter, setNodeCounter] = useState(0)

  const create = () => {
    const wf = {
      id: items.length + 1,
      name: 'New Workflow',
      description: '',
      status: 'Draft',
      trigger: '',
      nodes: [],
      edges: [],
      executions: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    const next = [...items, wf]
    setItems(next)
    saveAutomations(next)
    openEditor(wf)
  }

  const openEditor = (wf) => {
    setEditing(wf)
    setNodes(wf.nodes || [])
    setEdges(wf.edges || [])
    setSelectedNode(null)
  }

  const addNode = (type) => {
    const n = { id: 'n' + (nodeCounter + 1), type, config: {}, x: 100 + nodes.length * 50, y: 100 + (nodes.length % 3) * 100 }
    setNodes((prev) => [...prev, n])
    setNodeCounter((prev) => prev + 1)
  }

  const removeNode = (id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id))
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id))
    if (selectedNode?.id === id) setSelectedNode(null)
  }

  const updateConfig = (id, key, value) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, config: { ...n.config, [key]: value } } : n)))
  }

  const connect = (from, to) => {
    if (from === to) return
    if (edges.some((e) => e.from === from && e.to === to)) return
    setEdges((prev) => [...prev, { from, to }])
  }

  const removeEdge = (from, to) => {
    setEdges((prev) => prev.filter((e) => !(e.from === from && e.to === to)))
  }

  const validate = () => {
    const errors = []
    if (!nodes.some((n) => n.type === 'Trigger')) errors.push('Missing trigger node')
    if (!nodes.some((n) => n.type === 'End')) errors.push('Missing end node')
    nodes.forEach((n) => {
      if (n.type === 'Condition' && !edges.some((e) => e.from === n.id)) errors.push(`Condition node ${n.id} missing branches`)
    })
    return errors
  }

  const save = () => {
    const next = items.map((w) => (w.id === editing.id ? { ...editing, nodes, edges, updatedAt: new Date().toISOString().slice(0, 10) } : w))
    setItems(next)
    saveAutomations(next)
    setEditing(null)
  }

  const activate = () => {
    const errs = validate()
    if (errs.length) {
      alert('Validation errors:\n' + errs.join('\n'))
      return
    }
    const next = items.map((w) => (w.id === editing.id ? { ...editing, nodes, edges, status: 'Active', updatedAt: new Date().toISOString().slice(0, 10) } : w))
    setItems(next)
    saveAutomations(next)
    setEditing(null)
  }

  const pause = (id) => {
    const next = items.map((w) => (w.id === id ? { ...w, status: 'Paused' } : w))
    setItems(next)
    saveAutomations(next)
  }

  const testRun = () => {
    const errs = validate()
    if (errs.length) {
      alert('Validation errors:\n' + errs.join('\n'))
      return
    }
    const visited = nodes.map((n) => `${n.id} (${n.type})`)
    alert('Test run simulated.\nExecution path:\n' + visited.join('\n'))
  }

  const duplicate = (wf) => {
    const copy = {
      ...wf,
      id: Date.now(),
      name: wf.name + ' (Copy)',
      status: 'Draft',
      executions: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    const next = [...items, copy]
    setItems(next)
    saveAutomations(next)
  }

  const deleteWorkflow = (id) => {
    if (!confirm('Delete this workflow?')) return
    const next = items.filter((w) => w.id !== id)
    setItems(next)
    saveAutomations(next)
  }

  const filtered = items.filter(
    (w) => (statusFilter === 'all' || w.status.toLowerCase() === statusFilter) && w.name.toLowerCase().includes(search.toLowerCase())
  )

  const nodeTypeInfo = NODE_TYPES.find((nt) => nt.type === selectedNode?.type)

  if (editing) {
    return (
      <div className="page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Workflow Editor: {editing.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Build automation workflows by adding and connecting nodes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={testRun}>
              <Icon name="Play" size={16} />
              Test Run
            </Button>
            <Button variant="secondary" onClick={save}>
              <Icon name="Save" size={16} />
              Save Draft
            </Button>
            <Button variant="primary" onClick={activate}>
              <Icon name="Play" size={16} />
              Activate
            </Button>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card title="Node Palette" className="lg:col-span-1">
            <div className="space-y-2">
              {NODE_TYPES.map((nt) => (
                <button
                  key={nt.type}
                  onClick={() => addNode(nt.type)}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${nt.color}`}
                >
                  <Icon name={nt.icon} size={18} />
                  <span className="text-sm font-medium">{nt.type}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Workflow Canvas" className="lg:col-span-2">
            <div className="relative min-h-[500px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-auto">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {edges.map((edge, index) => {
                  const fromNode = nodes.find((n) => n.id === edge.from)
                  const toNode = nodes.find((n) => n.id === edge.to)
                  if (!fromNode || !toNode) return null
                  return (
                    <line
                      key={index}
                      x1={fromNode.x + 75}
                      y1={fromNode.y + 25}
                      x2={toNode.x}
                      y2={toNode.y + 25}
                      stroke="#25D366"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#25D366" />
                  </marker>
                </defs>
              </svg>
              {nodes.map((n) => {
                const nt = NODE_TYPES.find((t) => t.type === n.type)
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`absolute p-3 rounded-lg border-2 cursor-pointer transition-shadow ${nt.color} ${selectedNode?.id === n.id ? 'border-brand-500 shadow-lg' : 'border-transparent'}`}
                    style={{ left: n.x, top: n.y, width: '150px' }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon name={nt.icon} size={16} />
                      <span className="text-xs font-medium truncate">{n.type}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNode(n.id) }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card title="Node Configuration" className="lg:col-span-1">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Node Type</label>
                  <Badge className={nodeTypeInfo?.color}>{selectedNode.type}</Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Node ID</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedNode.id}</p>
                </div>

                {selectedNode.type === 'Send Message' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea
                      value={selectedNode.config.message || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'message', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Send Template' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template ID</label>
                    <input
                      type="text"
                      value={selectedNode.config.templateId || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'templateId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Delay' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={selectedNode.config.duration || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Condition' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field</label>
                    <input
                      type="text"
                      value={selectedNode.config.field || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'field', e.target.value)}
                      placeholder="e.g., tag, status"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Add Tag' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag</label>
                    <input
                      type="text"
                      value={selectedNode.config.tag || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'tag', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Assign Agent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent</label>
                    <input
                      type="text"
                      value={selectedNode.config.agent || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'agent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connect To</label>
                  <div className="space-y-2">
                    {nodes
                      .filter((n) => n.id !== selectedNode.id)
                      .map((n) => {
                        const isConnected = edges.some((e) => e.from === selectedNode.id && e.to === n.id)
                        return (
                          <button
                            key={n.id}
                            onClick={() => (isConnected ? removeEdge(selectedNode.id, n.id) : connect(selectedNode.id, n.id))}
                            className={`w-full flex items-center justify-between p-2 rounded border ${
                              isConnected ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <span className="text-sm">{n.type}</span>
                            {isConnected ? <Icon name="X" size={14} /> : <Icon name="Plus" size={14} />}
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">Select a node to configure</p>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Automation</h1>
          <p className="text-gray-600 dark:text-gray-400">Create automated workflows for your messaging operations</p>
        </div>
        <Button variant="primary" onClick={create}>
          <Icon name="Plus" size={16} />
          Create Workflow
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search workflows..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Trigger</th>
                <th>Nodes</th>
                <th>Executions</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id}>
                  <td className="font-medium">{w.name}</td>
                  <td>
                    <Badge variant={w.status === 'Active' ? 'success' : w.status === 'Paused' ? 'warning' : 'info'}>{w.status}</Badge>
                  </td>
                  <td>{w.trigger || '-'}</td>
                  <td>{(w.nodes || []).length}</td>
                  <td>{w.executions}</td>
                  <td>{w.updatedAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => openEditor(w)} aria-label="Edit">
                        <Icon name="Edit" size={16} />
                      </button>
                      {w.status === 'Active' && (
                        <button className="icon-btn text-yellow-600" onClick={() => pause(w.id)} aria-label="Pause">
                          <Icon name="Pause" size={16} />
                        </button>
                      )}
                      <button className="icon-btn" onClick={() => duplicate(w)} aria-label="Duplicate">
                        <Icon name="Copy" size={16} />
                      </button>
                      <button className="icon-btn text-red-600" onClick={() => deleteWorkflow(w.id)} aria-label="Delete">
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
    </div>
  )
}
