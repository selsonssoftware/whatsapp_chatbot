import { useState } from 'react'
import { Button, Card, Badge, Icon, Input, Drawer } from '../../components/index.js'

const DEMO_AGENTS = [
  {
    id: 1,
    name: 'Support Assistant',
    description: 'Handles customer support queries',
    status: 'Active',
    instructions: 'You are a helpful customer support assistant. Be polite, clear, and concise.',
    tone: 'Professional',
    knowledge: ['Product information', 'Pricing details', 'Return policy'],
    tools: ['Search knowledge base', 'Handoff to human'],
    handoffThreshold: 0.7,
    updatedAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Sales Bot',
    description: 'Assists with product recommendations',
    status: 'Draft',
    instructions: 'You are a sales assistant. Help customers find the right products.',
    tone: 'Friendly',
    knowledge: ['Product catalog', 'Discount offers'],
    tools: ['Product search', 'Send recommendations'],
    handoffThreshold: 0.5,
    updatedAt: '2026-01-12',
  },
]

export default function AIAgentPage() {
  const [agents, setAgents] = useState(DEMO_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showPlayground, setShowPlayground] = useState(false)
  const [playgroundMessage, setPlaygroundMessage] = useState('')
  const [playgroundHistory, setPlaygroundHistory] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    instructions: '',
    tone: 'Professional',
    knowledge: '',
    tools: '',
    handoffThreshold: 0.7,
  })
  const [editingAgent, setEditingAgent] = useState(null)

  const createAgent = () => {
    if (!form.name.trim()) {
      alert('Agent name is required')
      return
    }
    const newAgent = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      status: 'Draft',
      instructions: form.instructions,
      tone: form.tone,
      knowledge: form.knowledge.split(',').map((k) => k.trim()).filter(Boolean),
      tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
      handoffThreshold: Number(form.handoffThreshold),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setAgents((prev) => [...prev, newAgent])
    setForm({ name: '', description: '', instructions: '', tone: 'Professional', knowledge: '', tools: '', handoffThreshold: 0.7 })
  }

  const editAgent = (agent) => {
    setEditingAgent(agent)
    setForm({
      name: agent.name,
      description: agent.description,
      instructions: agent.instructions,
      tone: agent.tone,
      knowledge: (agent.knowledge || []).join(', '),
      tools: (agent.tools || []).join(', '),
      handoffThreshold: agent.handoffThreshold,
    })
    setShowDrawer(true)
  }

  const saveAgent = () => {
    if (!form.name.trim()) {
      alert('Agent name is required')
      return
    }
    const agentData = {
      ...form,
      knowledge: form.knowledge.split(',').map((k) => k.trim()).filter(Boolean),
      tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
      handoffThreshold: Number(form.handoffThreshold),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (editingAgent) {
      setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? { ...a, ...agentData } : a)))
    } else {
      setAgents((prev) => [...prev, { ...agentData, id: Date.now(), status: 'Draft' }])
    }

    setShowDrawer(false)
    setEditingAgent(null)
    setForm({ name: '', description: '', instructions: '', tone: 'Professional', knowledge: '', tools: '', handoffThreshold: 0.7 })
  }

  const activateAgent = (id) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Active' } : a)))
  }

  const pauseAgent = (id) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Paused' } : a)))
  }

  const deleteAgent = (id) => {
    if (!confirm('Delete this AI agent?')) return
    setAgents((prev) => prev.filter((a) => a.id !== id))
  }

  const openPlayground = (agent) => {
    setSelectedAgent(agent)
    setPlaygroundHistory([])
    setPlaygroundMessage('')
    setShowPlayground(true)
  }

  const sendPlaygroundMessage = () => {
    if (!playgroundMessage.trim()) return

    const userMessage = { role: 'user', text: playgroundMessage, time: new Date().toLocaleTimeString() }
    setPlaygroundHistory((prev) => [...prev, userMessage])

    setTimeout(() => {
      const responses = [
        'I understand your question. Let me help you with that.',
        'Based on my knowledge base, here\'s what I found...',
        'I can assist you with that. Here are some options.',
        'That\'s a great question! Let me provide some information.',
      ]
      const aiResponse = {
        role: 'assistant',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString(),
      }
      setPlaygroundHistory((prev) => [...prev, aiResponse])
    }, 1000)

    setPlaygroundMessage('')
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">AI Agent</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure AI-powered agents for automated conversations</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingAgent(null); setForm({ name: '', description: '', instructions: '', tone: 'Professional', knowledge: '', tools: '', handoffThreshold: 0.7 }); setShowDrawer(true) }}>
          <Icon name="Plus" size={16} />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{agent.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{agent.description}</p>
              </div>
              <Badge variant={agent.status === 'Active' ? 'success' : agent.status === 'Paused' ? 'warning' : 'info'}>{agent.status}</Badge>
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
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => editAgent(agent)}>
                <Icon name="Edit" size={14} />
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openPlayground(agent)}>
                <Icon name="Play" size={14} />
                Test
              </Button>
              {agent.status === 'Active' ? (
                <Button variant="secondary" size="sm" onClick={() => pauseAgent(agent.id)}>
                  <Icon name="Pause" size={14} />
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => activateAgent(agent.id)}>
                  <Icon name="Play" size={14} />
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => deleteAgent(agent.id)}>
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Drawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setEditingAgent(null) }}
        title={editingAgent ? 'Edit AI Agent' : 'Create AI Agent'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowDrawer(false); setEditingAgent(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveAgent}>
              {editingAgent ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Agent Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
          <Input label="Knowledge Base (comma-separated)" value={form.knowledge} onChange={(e) => setForm({ ...form, knowledge: e.target.value })} placeholder="Product info, Pricing, FAQ" />
          <Input label="Available Tools (comma-separated)" value={form.tools} onChange={(e) => setForm({ ...form, tools: e.target.value })} placeholder="Search, Handoff, Database" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Human Handoff Threshold (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={form.handoffThreshold}
              onChange={(e) => setForm({ ...form, handoffThreshold: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Drawer>

      <Drawer
        isOpen={showPlayground}
        onClose={() => { setShowPlayground(false); setSelectedAgent(null) }}
        title={`Test Playground: ${selectedAgent?.name}`}
        footer={
          <Button variant="secondary" onClick={() => { setShowPlayground(false); setSelectedAgent(null) }}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <Icon name="Info" size={16} className="inline mr-1" />
              Demo Mode: AI responses are simulated. No actual AI model is running.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3 min-h-[300px] max-h-[400px] overflow-y-auto">
            {playgroundHistory.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Start a conversation to test the agent</p>
            )}
            {playgroundHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-700'}`}>
                  <p className="text-sm">{msg.text}</p>
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
        </div>
      </Drawer>
    </div>
  )
}
