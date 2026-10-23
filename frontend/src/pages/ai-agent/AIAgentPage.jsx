import { useState } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Users,
  Star,
  Settings,
  BookOpen,
  Plus,
  Send,
  Edit2,
  Trash2,
  MessageSquare,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  List,
  Wrench,
  Smartphone,
  Check,
} from 'lucide-react'
import { BLAST_KPIS, AI_AGENTS_DATA } from '../../data/mockBlastData.js'

export default function AIAgentPage() {
  const [agents, setAgents] = useState(AI_AGENTS_DATA)
  const [selectedAgentId, setSelectedAgentId] = useState(1)
  const [activeTab, setActiveTab] = useState('agents')
  const [configTab, setConfigTab] = useState('general')
  const [tone, setTone] = useState('Friendly')
  const [feedback, setFeedback] = useState(null)

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0]

  // Simulator state
  const [testMessages, setTestMessages] = useState([
    { id: 1, sender: 'user', text: 'Hi, I want to check my order status', time: '10:30 AM' },
    {
      id: 2,
      sender: 'agent',
      text: 'Hello! 👋\nSure, I can help you with that.\nPlease share your order number.',
      time: '10:30 AM',
    },
    { id: 3, sender: 'user', text: 'ORD12345', time: '10:31 AM' },
    {
      id: 4,
      sender: 'agent',
      text: 'Thanks! Here is your order status:\n\n📦 Order #: ORD12345\n🚚 Status: Out for Delivery\n📅 Expected: May 10, 2024\n\nYou can track your order here:',
      button: 'Track Order',
      time: '10:31 AM',
    },
  ])
  const [testInput, setTestInput] = useState('')

  const handleTestSend = (e) => {
    e?.preventDefault()
    if (!testInput.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: testInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'agent',
      text: `I understand you're asking about "${testInput}". Our customer support team is available 24/7 to help resolve your request!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setTestMessages((prev) => [...prev, userMsg, aiMsg])
    setTestInput('')
  }

  const handleSave = () => {
    setFeedback('AI Agent settings updated successfully!')
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Agent
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-[#00A884]/15 text-[#00A884] rounded-full border border-[#00A884]/30">
              Beta
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create AI-powered WhatsApp agents that understand, respond and take actions for your business.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            AI Settings
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Knowledge Base
          </button>
          <button
            onClick={() => handleSave()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Create AI Agent
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Conversations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.aiAgent.totalConversations.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.aiAgent.totalConversations.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.aiAgent.totalConversations.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.aiAgent.resolutionRate.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.aiAgent.resolutionRate.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.aiAgent.resolutionRate.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Human Handover</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.aiAgent.humanHandover.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.aiAgent.humanHandover.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.aiAgent.humanHandover.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Customer Satisfaction</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.aiAgent.satisfaction.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.aiAgent.satisfaction.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.aiAgent.satisfaction.period}</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['Agents', 'Knowledge Base', 'Tools & Actions', 'Guardrails', 'Analytics', 'Logs'].map((tab) => {
          const key = tab.toLowerCase().split(' ')[0]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                activeTab === key
                  ? 'bg-[#00A884]/10 text-[#00A884]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* 3-Section Workspace */}
      <div className="grid grid-cols-12 gap-4 items-start">
        {/* Left: Agents List (3 cols) */}
        <div className="col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-2xs space-y-2">
          {agents.map((ag) => (
            <div
              key={ag.id}
              onClick={() => setSelectedAgentId(ag.id)}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                ag.id === selectedAgentId
                  ? 'border-[#00A884] bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-[#00A884] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {ag.name}
                  </h4>
                </div>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    ag.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ag.status === 'Paused'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ag.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{ag.desc}</p>
            </div>
          ))}

          <button className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 text-[#00A884] hover:bg-emerald-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Create New Agent
          </button>
        </div>

        {/* Center: Configuration Panels (5 cols) */}
        <div className="col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-4">
          {/* Header of center panel */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedAgent.name}
                </h3>
                <Edit2 className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
              <p className="text-[11px] text-slate-500">
                Answer customer questions, provide support and take actions automatically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-600">Active</span>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-[#00A884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                + Save
              </button>
            </div>
          </div>

          {/* Configuration subtabs */}
          <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs">
            {['General', 'Instructions', 'Knowledge', 'Actions', 'Handover', 'Advanced'].map((t) => (
              <button
                key={t}
                onClick={() => setConfigTab(t.toLowerCase())}
                className={`font-semibold pb-1 transition ${
                  configTab === t.toLowerCase()
                    ? 'text-[#00A884] border-b-2 border-[#00A884]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Agent Name *
              </label>
              <input
                type="text"
                defaultValue={selectedAgent.name}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Agent Personality
              </label>
              <textarea
                rows={2}
                defaultValue="You are a helpful, friendly and professional customer support assistant for our business. Keep responses short, clear and friendly."
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Description *
              </label>
              <textarea
                rows={2}
                defaultValue="Handles customer queries, provides product information, tracks orders and resolves common issues."
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                AI Model
              </label>
              <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <option>GPT-4o (Recommended)</option>
                <option>Claude 3.5 Sonnet</option>
                <option>Gemini 1.5 Pro</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Advanced reasoning and better WhatsApp response quality.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Response Tone
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Friendly', 'Professional', 'Casual', 'Formal', 'Empathetic', 'Concise'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      tone === t
                        ? 'bg-[#00A884] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Language
                </label>
                <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Tamil</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Business Hours
                </label>
                <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <option>24/7 (Always Active)</option>
                  <option>Office Hours (9AM - 6PM)</option>
                  <option>Custom Schedule</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Test AI Agent Phone Simulator (4 cols) */}
        <div className="col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col h-[650px]">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-[#00A884]" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Test AI Agent</h3>
          </div>

          {/* Smartphone container */}
          <div className="flex-1 flex flex-col rounded-3xl border-4 border-slate-800 dark:border-slate-700 bg-[#EFEAE2] dark:bg-slate-950 overflow-hidden shadow-inner">
            {/* Header */}
            <div className="bg-[#008069] text-white p-3 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Customer Support AI</h4>
                <span className="text-[10px] text-emerald-200">Online</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {testMessages.map((m) => {
                const isUser = m.sender === 'user'
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-xl p-2.5 text-xs shadow-2xs whitespace-pre-line leading-relaxed ${
                        isUser
                          ? 'bg-[#E7F8F0] dark:bg-emerald-950/80 text-slate-900 dark:text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none'
                      }`}
                    >
                      {m.text}
                      {m.button && (
                        <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button className="w-full py-1 text-center font-bold text-sky-600 dark:text-sky-400 text-[11px] flex items-center justify-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {m.button}
                          </button>
                        </div>
                      )}
                      <div className="flex justify-end text-[9px] text-slate-400 mt-1">{m.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleTestSend}
              className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Tools & Customer Intents Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Actions (Tools) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Quick Actions (Tools)</h3>
              <p className="text-[11px] text-slate-400">Allow AI to perform actions in your CRM.</p>
            </div>
            <button className="text-xs font-semibold text-[#00A884] hover:underline">+ Add Action</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { title: 'Check Order Status', cat: 'Order Management', icon: '📦' },
              { title: 'Get Product Info', cat: 'Catalog', icon: '🛍️' },
              { title: 'Create Support Ticket', cat: 'Support', icon: '🎫' },
              { title: 'Update Contact Info', cat: 'CRM', icon: '👥' },
              { title: 'Book Appointment', cat: 'Bookings', icon: '📅' },
              { title: 'Handover to Agent', cat: 'Live Chat', icon: '🧑‍💻' },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2.5 text-xs"
              >
                <span className="text-lg">{tool.icon}</span>
                <div className="min-w-0">
                  <h5 className="font-semibold text-slate-900 dark:text-white truncate">{tool.title}</h5>
                  <span className="text-[10px] text-slate-400">{tool.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customer Intents */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Customer Intents</h3>
            <button className="text-xs font-semibold text-[#00A884] hover:underline">View All &gt;</button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { intent: 'Order Status', pct: 32, color: 'bg-emerald-500' },
              { intent: 'Product Information', pct: 24, color: 'bg-emerald-500' },
              { intent: 'Returns & Refunds', pct: 16, color: 'bg-emerald-500' },
              { intent: 'Pricing & Offers', pct: 12, color: 'bg-emerald-500' },
              { intent: 'Talk to Human', pct: 8, color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item.intent}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
