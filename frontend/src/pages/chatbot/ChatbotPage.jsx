import { useState } from 'react'
import { getChatbots, saveChatbots, validateChatbotFlow } from '../../services/chatbotService.js'
import { Button, Card, Badge, Icon, SearchBar } from '../../components/index.js'

const NODE_TYPES = [
  { type: 'Start', icon: 'Play', color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' },
  { type: 'Send Message', icon: 'Send', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' },
  { type: 'Ask Question', icon: 'HelpCircle', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400' },
  { type: 'Quick Replies', icon: 'MessageSquare', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' },
  { type: 'Condition', icon: 'GitBranch', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400' },
  { type: 'Action', icon: 'Zap', color: 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400' },
  { type: 'End', icon: 'XCircle', color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' },
]

export default function ChatbotPage() {
  const [bots, setBots] = useState(() => getChatbots())
  const [editing, setEditing] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [previewMessage, setPreviewMessage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [validation, setValidation] = useState([])
  const [previewLog, setPreviewLog] = useState([])

  const persist = (next) => {
    setBots(next)
    saveChatbots(next)
  }

  const createBot = () => {
    const newBot = {
      id: bots.reduce((max, b) => Math.max(max, b.id), 0) + 1,
      name: 'New Chatbot',
      status: 'Draft',
      description: '',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString().slice(0, 10),
    }
    persist([...bots, newBot])
    openEditor(newBot)
  }

  const openEditor = (bot) => {
    setEditing(bot)
    setNodes(bot.nodes || [])
    setEdges(bot.edges || [])
    setSelectedNode(null)
  }

  const addNode = (type) => {
    const n = { id: 'n' + (nodes.length + 1) + '-' + type.toLowerCase().replace(/\s+/g, ''), type, config: {}, x: 100 + nodes.length * 50, y: 100 + (nodes.length % 3) * 100 }
    setNodes((prev) => [...prev, n])
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

  const saveBot = () => {
    const next = bots.map((b) => (b.id === editing.id ? { ...b, ...editing, nodes, edges } : b))
    persist(next)
    setEditing(null)
  }

  const activateBot = (id) => {
    const bot = bots.find((b) => b.id === id)
    if (!bot) return
    const errors = validateChatbotFlow(bot.nodes || [], bot.edges || [])
    if (errors.length) {
      setValidation(errors)
      return
    }
    setValidation([])
    persist(bots.map((b) => (b.id === id ? { ...b, status: 'Active' } : b)))
  }

  const pauseBot = (id) => {
    persist(bots.map((b) => (b.id === id ? { ...b, status: 'Paused' } : b)))
  }

  const deleteBot = (id) => {
    if (!confirm('Delete this chatbot?')) return
    persist(bots.filter((b) => b.id !== id))
  }

  const duplicateBot = (bot) => {
    const copy = { ...bot, id: bot.id + 1000, name: bot.name + ' (Copy)', status: 'Draft', createdAt: new Date().toISOString().slice(0, 10) }
    persist([...bots, copy])
  }

  const sendPreviewMessage = () => {
    if (!previewMessage.trim()) return
    const botResponses = [
      'Thanks for your message! How can I help you today?',
      'I understand. Let me check that for you.',
      'Sure! Here are some options that might help.',
    ]
    const response = botResponses[previewLog.length % botResponses.length]
    setPreviewLog((prev) => [...prev, { from: 'user', text: previewMessage }, { from: 'bot', text: response }])
    setPreviewMessage('')
  }

  const nodeTypeInfo = NODE_TYPES.find((nt) => nt.type === selectedNode?.type)

  const filteredBots = bots.filter(
    (b) =>
      (b.name + ' ' + (b.description || '')).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'all' || b.status === statusFilter)
  )

  if (editing) {
    return (
      <div className="page">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Chatbot Builder: {editing.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Design conversational flows for your chatbot</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPreviewOpen(!previewOpen)}>
              <Icon name={previewOpen ? 'EyeOff' : 'Eye'} size={16} />
              {previewOpen ? 'Hide' : 'Show'} Preview
            </Button>
            <Button variant="secondary" onClick={saveBot}>
              <Icon name="Save" size={16} />
              Save
            </Button>
            <Button variant="primary" onClick={() => { saveBot(); activateBot(editing.id) }}>
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

          <Card title="Flow Canvas" className="lg:col-span-2">
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

                {selectedNode.type === 'Ask Question' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                    <textarea
                      value={selectedNode.config.question || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'question', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Quick Replies' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Options (comma-separated)</label>
                    <input
                      type="text"
                      value={selectedNode.config.options || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'options', e.target.value)}
                      placeholder="Yes, No, Maybe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )}

                {selectedNode.type === 'Condition' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                    <input
                      type="text"
                      value={selectedNode.config.condition || ''}
                      onChange={(e) => updateConfig(selectedNode.id, 'condition', e.target.value)}
                      placeholder="e.g., equals 'yes'"
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
                            onClick={() => (isConnected ? setEdges((prev) => prev.filter((e) => !(e.from === selectedNode.id && e.to === n.id))) : connect(selectedNode.id, n.id))}
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

        {previewOpen && (
          <Card title="Live Chat Preview" className="mt-6">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3 min-h-[300px]">
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hello! I'm your assistant. How can I help?</p>
                  </div>
                </div>
                {previewLog.map((entry, index) => (
                  <div key={index} className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={
                        entry.from === 'user'
                          ? 'bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-100 rounded-lg p-3 max-w-[80%]'
                          : 'bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%]'
                      }
                    >
                      <p className="text-sm">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={previewMessage}
                  onChange={(e) => setPreviewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendPreviewMessage()}
                />
                <Button variant="primary" size="sm" onClick={sendPreviewMessage}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Chatbot Builder</h1>
          <p className="text-gray-600 dark:text-gray-400">Create conversational AI chatbots for automated customer support</p>
        </div>
        <Button variant="primary" onClick={createBot}>
          <Icon name="Plus" size={16} />
          Create Chatbot
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search chatbots..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter chatbots by status"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Paused">Paused</option>
        </select>
      </div>

      {validation.length > 0 && (
        <div className="mb-4 px-4 py-3 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-1">Fix these issues before activating:</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {validation.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <Card key={bot.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{bot.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{bot.description}</p>
              </div>
              <Badge variant={bot.status === 'Active' ? 'success' : bot.status === 'Paused' ? 'warning' : 'info'}>{bot.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{(bot.nodes || []).length} nodes</span>
              <span>{bot.createdAt}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEditor(bot)}>
                <Icon name="Edit" size={14} />
                Edit
              </Button>
              {bot.status === 'Active' ? (
                <Button variant="secondary" size="sm" onClick={() => pauseBot(bot.id)}>
                  <Icon name="Pause" size={14} />
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => activateBot(bot.id)}>
                  <Icon name="Play" size={14} />
                </Button>
              )}
              <Button variant="secondary" size="sm" onClick={() => duplicateBot(bot)}>
                <Icon name="Copy" size={14} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => deleteBot(bot.id)}>
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
