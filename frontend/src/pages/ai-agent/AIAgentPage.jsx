import { useMemo, useState } from 'react'
import { Button, Card, Badge, Icon, Input, Drawer } from '../../components/index.js'
import {
  getAgents,
  saveAgents,
  getAgentTests,
  saveAgentTests,
  recordAgentTest,
  clearAgentTests,
  simulateAgentReply,
} from '../../services/aiAgentService.js'

const EMPTY_FORM = {
  name: '',
  description: '',
  instructions: '',
  tone: 'Professional',
  welcomeMessage: '',
  fallback: '',
  businessHours: 'Mon-Fri 09:00-18:00',
  available: true,
  responseDelay: 700,
  tools: '',
  handoffThreshold: 0.7,
}

const CATEGORIES = ['Product', 'Pricing', 'Policy', 'FAQ', 'Shipping', 'Other']

export default function AIAgentPage() {
  const [agents, setAgents] = useState(() => getAgents())
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showPlayground, setShowPlayground] = useState(false)
  const [playgroundMessage, setPlaygroundMessage] = useState('')
  const [playgroundHistory, setPlaygroundHistory] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [knowledgeDraft, setKnowledgeDraft] = useState([])
  const [formError, setFormError] = useState('')
  const [editingAgent, setEditingAgent] = useState(null)
  const [tests, setTests] = useState(() => getAgentTests())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [notice, setNotice] = useState('')

  const persist = (next) => {
    setAgents(next)
    saveAgents(next)
  }

  const agentTests = useMemo(
    () => tests.filter((t) => t.agentId === selectedAgent?.id),
    [tests, selectedAgent]
  )

  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return agents.filter((agent) => {
      const matchesStatus = statusFilter === 'All' || agent.status === statusFilter
      const matchesQuery =
        !query ||
        agent.name.toLowerCase().includes(query) ||
        (agent.description || '').toLowerCase().includes(query)
      return matchesStatus && matchesQuery
    })
  }, [agents, search, statusFilter])

  const openCreate = () => {
    setEditingAgent(null)
    setForm(EMPTY_FORM)
    setKnowledgeDraft([])
    setFormError('')
    setShowDrawer(true)
  }

  const editAgent = (agent) => {
    setEditingAgent(agent)
    setForm({
      name: agent.name,
      description: agent.description,
      instructions: agent.instructions || '',
      tone: agent.tone || 'Professional',
      welcomeMessage: agent.welcomeMessage || '',
      fallback: agent.fallback || '',
      businessHours: agent.businessHours || 'Mon-Fri 09:00-18:00',
      available: agent.available !== false,
      responseDelay: agent.responseDelay ?? 700,
      tools: (agent.tools || []).join(', '),
      handoffThreshold: agent.handoffThreshold ?? 0.7,
    })
    setKnowledgeDraft((agent.knowledge || []).map((k) => ({ ...k })))
    setFormError('')
    setShowDrawer(true)
  }

  const addKnowledgeEntry = () => {
    setKnowledgeDraft((prev) => [
      ...prev,
      { id: `k${prev.length + 1}-${prev.length}`, title: '', category: 'FAQ', text: '' },
    ])
  }

  const updateKnowledgeEntry = (id, patch) => {
    setKnowledgeDraft((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)))
  }

  const removeKnowledgeEntry = (id) => {
    setKnowledgeDraft((prev) => prev.filter((entry) => entry.id !== id))
  }

  const saveAgent = () => {
    if (!form.name.trim()) {
      setFormError('Agent name is required')
      return
    }
    const cleaned = knowledgeDraft
      .map((entry) => ({ ...entry, title: entry.title.trim(), text: entry.text.trim() }))
      .filter((entry) => entry.title || entry.text)

    if (cleaned.length !== knowledgeDraft.length) {
      setFormError('Every knowledge entry needs a title and content')
      return
    }
    const duplicate = cleaned.find(
      (entry, index) => cleaned.findIndex((e) => e.title.toLowerCase() === entry.title.toLowerCase()) !== index
    )
    if (duplicate) {
      setFormError(`Duplicate knowledge entry title: "${duplicate.title}"`)
      return
    }

    const agentData = {
      name: form.name.trim(),
      description: form.description.trim(),
      instructions: form.instructions.trim(),
      tone: form.tone,
      welcomeMessage: form.welcomeMessage.trim(),
      fallback: form.fallback.trim(),
      businessHours: form.businessHours.trim(),
      available: form.available,
      responseDelay: Number(form.responseDelay) || 700,
      knowledge: cleaned,
      tools: form.tools
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      handoffThreshold: Number(form.handoffThreshold),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (editingAgent) {
      persist(agents.map((a) => (a.id === editingAgent.id ? { ...a, ...agentData } : a)))
      setNotice(`Agent "${agentData.name}" updated`)
    } else {
      const id = agents.reduce((max, a) => Math.max(max, Number(a.id) || 0), 0) + 1
      persist([...agents, { ...agentData, id, status: 'Draft' }])
      setNotice(`Agent "${agentData.name}" created as draft`)
    }

    setShowDrawer(false)
    setEditingAgent(null)
    setForm(EMPTY_FORM)
    setKnowledgeDraft([])
  }

  const setStatus = (id, status) => {
    persist(agents.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString().slice(0, 10) } : a)))
  }

  const duplicateAgent = (agent) => {
    const id = agents.reduce((max, a) => Math.max(max, Number(a.id) || 0), 0) + 1
    const copy = {
      ...agent,
      id,
      name: `${agent.name} (copy)`,
      status: 'Draft',
      knowledge: (agent.knowledge || []).map((k, i) => ({ ...k, id: `${k.id}-c${i}` })),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    persist([...agents, copy])
    setNotice(`Duplicated "${agent.name}"`)
  }

  const deleteAgent = (id) => {
    if (!confirm('Delete this AI agent?')) return
    persist(agents.filter((a) => a.id !== id))
    const remaining = getAgentTests().filter((t) => t.agentId !== id)
    saveAgentTests(remaining)
    setTests(remaining)
    setNotice('Agent deleted')
  }

  const openPlayground = (agent) => {
    setSelectedAgent(agent)
    setPlaygroundHistory(
      agent.welcomeMessage
        ? [{ role: 'assistant', text: agent.welcomeMessage, time: new Date().toLocaleTimeString(), matched: [] }]
        : []
    )
    setPlaygroundMessage('')
    setShowPlayground(true)
  }

  const sendPlaygroundMessage = () => {
    const message = playgroundMessage.trim()
    if (!message || !selectedAgent) return

    const time = new Date().toLocaleTimeString()
    setPlaygroundHistory((prev) => [...prev, { role: 'user', text: message, time, matched: [] }])
    setPlaygroundMessage('')

    const result = simulateAgentReply(selectedAgent, message)
    setTimeout(() => {
      setPlaygroundHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: result.text,
          time: new Date().toLocaleTimeString(),
          matched: result.matched.map((m) => m.title),
          handoff: result.handoff,
        },
      ])
      const next = recordAgentTest({
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        message,
        response: result.text,
        matched: result.matched.map((m) => m.title),
        handoff: result.handoff,
        reason: result.reason,
      })
      setTests(next)
    }, selectedAgent.responseDelay ?? 700)
  }

  const clearHistory = () => {
    if (!selectedAgent) return
    const next = clearAgentTests(selectedAgent.id)
    setTests(next)
    setPlaygroundHistory([])
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">AI Agent</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure AI-powered agents for automated conversations</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Icon name="Plus" size={16} />
          Create Agent
        </Button>
      </div>

      {notice && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
          <span>{notice}</span>
          <button className="text-xs underline" onClick={() => setNotice('')}>
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          label="Search agents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name or description"
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          {['All', 'Active', 'Draft', 'Paused'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">No agents match the current filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{agent.description}</p>
                </div>
                <Badge variant={agent.status === 'Active' ? 'success' : agent.status === 'Paused' ? 'warning' : 'info'}>
                  {agent.status}
                </Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="MessageSquare" size={14} />
                  <span>Tone: {agent.tone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="Book" size={14} />
                  <span>{(agent.knowledge || []).length} knowledge entries</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="Clock" size={14} />
                  <span>{agent.businessHours || 'No business hours set'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => editAgent(agent)}>
                  <Icon name="Edit" size={14} />
                  Edit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openPlayground(agent)}>
                  <Icon name="Play" size={14} />
                  Test
                </Button>
                {agent.status === 'Active' ? (
                  <Button variant="secondary" size="sm" onClick={() => setStatus(agent.id, 'Paused')}>
                    <Icon name="Pause" size={14} />
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setStatus(agent.id, 'Active')}>
                    <Icon name="Play" size={14} />
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => duplicateAgent(agent)}>
                  <Icon name="Copy" size={14} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteAgent(agent.id)}>
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false)
          setEditingAgent(null)
        }}
        title={editingAgent ? 'Edit AI Agent' : 'Create AI Agent'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDrawer(false)
                setEditingAgent(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={saveAgent}>
              {editingAgent ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Agent Name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              setFormError('')
            }}
            error={formError}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Instructions</label>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Define how the AI should behave..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Response Tone</label>
            <select
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
            </select>
          </div>
          <Input
            label="Welcome Message"
            value={form.welcomeMessage}
            onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
            placeholder="Message sent when the conversation starts"
          />
          <Input
            label="Fallback Response"
            value={form.fallback}
            onChange={(e) => setForm({ ...form, fallback: e.target.value })}
            placeholder="Used when no knowledge entry matches"
          />
          <Input
            label="Business Hours"
            value={form.businessHours}
            onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
            placeholder="Mon-Fri 09:00-18:00"
          />
          <div className="flex items-center gap-2">
            <input
              id="agent-available"
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
            />
            <label htmlFor="agent-available" className="text-sm text-gray-700 dark:text-gray-300">
              Agent accepts conversations
            </label>
          </div>
          <Input
            label="Response Delay (ms)"
            type="number"
            min="0"
            max="5000"
            step="100"
            value={form.responseDelay}
            onChange={(e) => setForm({ ...form, responseDelay: e.target.value })}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Knowledge Base ({knowledgeDraft.length})
              </label>
              <Button variant="secondary" size="sm" onClick={addKnowledgeEntry}>
                <Icon name="Plus" size={14} />
                Add entry
              </Button>
            </div>
            {knowledgeDraft.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No knowledge entries yet.</p>
            ) : (
              <div className="space-y-3">
                {knowledgeDraft.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        value={entry.title}
                        onChange={(e) => updateKnowledgeEntry(entry.id, { title: e.target.value })}
                        placeholder="Title"
                        className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                      />
                      <select
                        value={entry.category}
                        onChange={(e) => updateKnowledgeEntry(entry.id, { category: e.target.value })}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <Button variant="danger" size="sm" onClick={() => removeKnowledgeEntry(entry.id)}>
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                    <textarea
                      value={entry.text}
                      onChange={(e) => updateKnowledgeEntry(entry.id, { text: e.target.value })}
                      rows={2}
                      placeholder="Knowledge content used to answer questions"
                      className="mt-2 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Available Tools (comma-separated)"
            value={form.tools}
            onChange={(e) => setForm({ ...form, tools: e.target.value })}
            placeholder="Search, Handoff, Database"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Human Handoff Threshold (0-1)
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={form.handoffThreshold}
              onChange={(e) => setForm({ ...form, handoffThreshold: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              When the confidence of a knowledge match is below this value the agent escalates to a human.
            </p>
          </div>
        </div>
      </Drawer>

      <Drawer
        isOpen={showPlayground}
        onClose={() => {
          setShowPlayground(false)
          setSelectedAgent(null)
        }}
        title={`Test Playground: ${selectedAgent?.name}`}
        footer={
          <div className="flex w-full gap-2">
            <Button variant="secondary" className="flex-1" onClick={clearHistory}>
              Clear history
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowPlayground(false)
                setSelectedAgent(null)
              }}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <Icon name="Info" size={16} className="inline mr-1" />
              Simulation: replies are matched locally against this agent&apos;s knowledge base. No AI model is running.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {playgroundHistory.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Start a conversation to test the agent</p>
            )}
            {playgroundHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    msg.role === 'user' ? 'bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-100' : 'bg-white dark:bg-gray-700'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.matched && msg.matched.length > 0 && (
                    <p className="text-xs mt-1 opacity-70">Matched: {msg.matched.join(', ')}</p>
                  )}
                  {msg.handoff && (
                    <p className="text-xs mt-1 opacity-70">Escalated to human agent</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={playgroundMessage}
              onChange={(e) => setPlaygroundMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && sendPlaygroundMessage()}
            />
            <Button variant="primary" size="sm" onClick={sendPlaygroundMessage}>
              Send
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Test history ({agentTests.length})
              </h4>
            </div>
            {agentTests.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No tests recorded for this agent yet.</p>
            ) : (
              <div className="space-y-2">
                {agentTests
                  .slice()
                  .reverse()
                  .map((test) => (
                    <div key={test.id} className="rounded-md border border-gray-200 p-2 text-sm dark:border-gray-700">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{test.message}</p>
                      <p className="text-gray-600 dark:text-gray-400">{test.response}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(test.createdAt).toLocaleString()} · {test.reason}
                        {test.matched?.length ? ` · matched: ${test.matched.join(', ')}` : ''}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  )
}
