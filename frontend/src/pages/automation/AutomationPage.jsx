import { useState } from 'react'
import {
  getAutomations,
  saveAutomations,
  validateWorkflow,
  simulateWorkflowRun,
} from '../../services/automationService.js'
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
  const [validationErrors, setValidationErrors] = useState([])
  const [runResult, setRunResult] = useState(null)
  const [notice, setNotice] = useState('')

  const persist = (next) => {
    setItems(next)
    saveAutomations(next)
  }

  const create = () => {
    const wf = {
      id: items.reduce((max, w) => Math.max(max, Number(w.id) || 0), 0) + 1,
      name: 'New Workflow',
      description: '',
      status: 'Draft',
      enabled: false,
      trigger: '',
      triggerType: 'Event',
      triggerKeyword: '',
      triggerTime: '',
      nodes: [],
      edges: [],
      executions: 0,
      lastRunAt: '',
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    persist([...items, wf])
    openEditor(wf)
  }

  const openEditor = (wf) => {
    setEditing(wf)
    setNodes(
      (wf.nodes || []).map((n, index) => ({
        ...n,
        runs: n.runs || 0,
        x: Number.isFinite(n.x) ? n.x : 40 + (index % 3) * 180,
        y: Number.isFinite(n.y) ? n.y : 40 + Math.floor(index / 3) * 120,
      }))
    )
    setEdges(wf.edges || [])
    setSelectedNode(null)
    setValidationErrors([])
    setRunResult(null)
    setNotice('')
    const maxIndex = (wf.nodes || []).reduce((max, n) => {
      const parsed = parseInt(String(n.id).replace(/^n/, ''), 10)
      return Number.isNaN(parsed) ? max : Math.max(max, parsed)
    }, 0)
    setNodeCounter(maxIndex)
  }

  const addNode = (type) => {
    const n = {
      id: 'n' + (nodeCounter + 1),
      type,
      config: type === 'Trigger' ? { triggerType: 'Event', event: 'new_contact' } : {},
      runs: 0,
      x: 40 + (nodes.length % 3) * 180,
      y: 40 + Math.floor(nodes.length / 3) * 120,
    }
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
    const node = nodes.find((n) => n.id === id)
    if (node?.type === 'Trigger') {
      const triggerType = key === 'triggerType' ? value : node.config.triggerType
      const label =
        triggerType === 'Keyword'
          ? `keyword:${node.config.keyword || ''}`
          : triggerType === 'Schedule'
            ? `schedule:${node.config.time || ''}`
            : node.config.event || 'event'
      setEditing((prev) => (prev ? { ...prev, trigger: label } : prev))
    }
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
    const errors = validateWorkflow(nodes, edges)
    setValidationErrors(errors)
    return errors
  }

  const save = (statusOverride) => {
    const errors = validate()
    if (statusOverride === 'Active' && errors.length) {
      setNotice('Workflow cannot be activated until validation errors are fixed')
      return
    }
    const updated = {
      ...editing,
      name: editing.name,
      description: editing.description,
      trigger: editing.trigger,
      nodes: nodes.map((n) => ({ ...n, runs: n.runs || 0 })),
      edges,
      status: statusOverride || editing.status,
      enabled: statusOverride === 'Active' ? true : statusOverride === 'Paused' ? false : editing.enabled,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    persist(items.map((w) => (w.id === editing.id ? updated : w)))
    setEditing(updated)
    setNotice(statusOverride ? `Workflow ${statusOverride.toLowerCase()}d` : 'Draft saved')
  }

  const activate = () => {
    save('Active')
  }

  const pause = (id) => {
    persist(
      items.map((w) =>
        w.id === id ? { ...w, status: 'Paused', enabled: false, updatedAt: new Date().toISOString().slice(0, 10) } : w
      )
    )
    setNotice('Workflow paused')
  }

  const toggleEnabled = (wf) => {
    const nextEnabled = !wf.enabled
    persist(
      items.map((w) =>
        w.id === wf.id
          ? {
              ...w,
              enabled: nextEnabled,
              status: nextEnabled ? 'Active' : 'Paused',
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : w
      )
    )
    setNotice(`${wf.name} ${nextEnabled ? 'enabled' : 'disabled'}`)
  }

  const testRun = () => {
    const errors = validate()
    if (errors.length) {
      setRunResult(null)
      return
    }
    const result = simulateWorkflowRun(nodes, edges)
    const runNodeIds = new Set(result.path)
    const updatedNodes = nodes.map((n) => ({ ...n, runs: (n.runs || 0) + (runNodeIds.has(n.id) ? 1 : 0) }))
    setNodes(updatedNodes)

    const lastRunAt = new Date().toISOString().slice(0, 10)
    const updated = {
      ...editing,
      nodes: updatedNodes,
      edges,
      executions: (editing.executions || 0) + 1,
      lastRunAt,
      updatedAt: lastRunAt,
    }
    persist(items.map((w) => (w.id === editing.id ? updated : w)))
    setEditing(updated)
    setRunResult(result)
    setNotice('Test run simulated locally — no messages were sent')
  }

  const duplicate = (wf) => {
    const idMap = new Map()
    const copiedNodes = (wf.nodes || []).map((n) => {
      const newId = `${n.id}c${idMap.size}`
      idMap.set(n.id, newId)
      return { ...n, id: newId, runs: 0 }
    })
    const copy = {
      ...wf,
      id: items.reduce((max, w) => Math.max(max, Number(w.id) || 0), 0) + 1,
      name: wf.name + ' (Copy)',
      status: 'Draft',
      enabled: false,
      executions: 0,
      lastRunAt: '',
      nodes: copiedNodes,
      edges: (wf.edges || []).map((e) => ({
        from: idMap.get(e.from) || e.from,
        to: idMap.get(e.to) || e.to,
      })),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    persist([...items, copy])
    setNotice(`Duplicated "${wf.name}"`)
  }

  const deleteWorkflow = (id) => {
    if (!confirm('Delete this workflow?')) return
    persist(items.filter((w) => w.id !== id))
    setNotice('Workflow deleted')
  }

  const filtered = items.filter(
    (w) => (statusFilter === 'all' || w.status.toLowerCase() === statusFilter) && w.name.toLowerCase().includes(search.toLowerCase())
  )

  const nodeTypeInfo = NODE_TYPES.find((nt) => nt.type === selectedNode?.type)

  const canvasWidth = Math.max(620, ...nodes.map((n) => (Number.isFinite(n.x) ? n.x : 40) + 190))
  const canvasHeight = Math.max(500, ...nodes.map((n) => (Number.isFinite(n.y) ? n.y : 40) + 110))

  if (editing) {
    return (
      <div className="page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Workflow Editor</h1>
            <p className="text-gray-600 dark:text-gray-400">Build automation workflows by adding and connecting nodes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={testRun}>
              <Icon name="Play" size={16} />
              Test Run
            </Button>
            <Button variant="secondary" onClick={() => save()}>
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

        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workflow Name</label>
              <input
                value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant={editing.status === 'Active' ? 'success' : editing.status === 'Paused' ? 'warning' : 'info'}>
                  {editing.status}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Executions: {editing.executions || 0}
                </span>
                {editing.lastRunAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">Last run: {editing.lastRunAt}</span>
                )}
              </div>
            </div>
          </div>

          {notice && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Info" size={14} className="inline mr-1" />
              {notice}
            </p>
          )}

          {validationErrors.length > 0 && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Fix before activating</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-red-600 dark:text-red-400">
                {validationErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {runResult && (
            <div className="mt-3 rounded-md border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Simulated execution path</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {runResult.path
                  .map((id) => {
                    const node = nodes.find((n) => n.id === id)
                    return node ? `${node.type} (${node.id})` : id
                  })
                  .join(' → ')}
              </p>
              {runResult.unvisited.length > 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Not reached: {runResult.unvisited.join(', ')}
                </p>
              )}
            </div>
          )}
        </Card>

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
              <svg className="absolute left-0 top-0 pointer-events-none" style={{ width: canvasWidth, height: canvasHeight }}>
                {edges.map((edge, index) => {
                  const fromNode = nodes.find((n) => n.id === edge.from)
                  const toNode = nodes.find((n) => n.id === edge.to)
                  if (!fromNode || !toNode) return null
                  const fromX = Number.isFinite(fromNode.x) ? fromNode.x : 0
                  const fromY = Number.isFinite(fromNode.y) ? fromNode.y : 0
                  const toX = Number.isFinite(toNode.x) ? toNode.x : 0
                  const toY = Number.isFinite(toNode.y) ? toNode.y : 0
                  return (
                    <line
                      key={index}
                      x1={fromX + 75}
                      y1={fromY + 25}
                      x2={toX}
                      y2={toY + 25}
                      stroke="#00C667"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#00C667" />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Runs</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedNode.runs || 0}</p>
                </div>

                {selectedNode.type === 'Trigger' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger Type</label>
                      <select
                        value={selectedNode.config.triggerType || 'Event'}
                        onChange={(e) => updateConfig(selectedNode.id, 'triggerType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        <option value="Event">Event</option>
                        <option value="Keyword">Keyword</option>
                        <option value="Schedule">Schedule</option>
                      </select>
                    </div>
                    {(selectedNode.config.triggerType || 'Event') === 'Keyword' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keyword</label>
                        <input
                          type="text"
                          value={selectedNode.config.keyword || ''}
                          onChange={(e) => updateConfig(selectedNode.id, 'keyword', e.target.value)}
                          placeholder="e.g., order, help"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                    )}
                    {(selectedNode.config.triggerType || 'Event') === 'Schedule' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule Time</label>
                        <input
                          type="time"
                          value={selectedNode.config.time || ''}
                          onChange={(e) => updateConfig(selectedNode.id, 'time', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                    )}
                    {(selectedNode.config.triggerType || 'Event') === 'Event' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event</label>
                        <select
                          value={selectedNode.config.event || 'new_contact'}
                          onChange={(e) => updateConfig(selectedNode.id, 'event', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                        >
                          <option value="new_contact">New contact</option>
                          <option value="message_received">Message received</option>
                          <option value="tag_added">Tag added</option>
                          <option value="campaign_replied">Campaign reply</option>
                        </select>
                      </div>
                    )}
                  </>
                )}

                {selectedNode.type === 'AI Agent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Agent</label>
                    <input
                      type="text"
                      value={selectedNode.config.agent || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'agent', e.target.value)}
                      placeholder="Agent name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Add to Group' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group</label>
                    <input
                      type="text"
                      value={selectedNode.config.group || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'group', e.target.value)}
                      placeholder="Group name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Webhook' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook URL</label>
                    <input
                      type="text"
                      value={selectedNode.config.url || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'url', e.target.value)}
                      placeholder="https://example.com/hook"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

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

      {notice && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
          <span>{notice}</span>
          <button className="text-xs underline" onClick={() => setNotice('')}>
            Dismiss
          </button>
        </div>
      )}

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Enabled</th>
                <th>Trigger</th>
                <th>Nodes</th>
                <th>Executions</th>
                <th>Last Run</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id}>
                  <td className="font-medium">
                    {w.name}
                    {w.description && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400">{w.description}</span>
                    )}
                  </td>
                  <td>
                    <Badge variant={w.status === 'Active' ? 'success' : w.status === 'Paused' ? 'warning' : 'info'}>
                      {w.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleEnabled(w)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        w.enabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={w.enabled ? 'Disable workflow' : 'Enable workflow'}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          w.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td>{w.trigger || '-'}</td>
                  <td>{(w.nodes || []).length}</td>
                  <td>{w.executions || 0}</td>
                  <td>{w.lastRunAt || '-'}</td>
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
