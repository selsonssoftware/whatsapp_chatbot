import { useState } from 'react'
import {
  Bot,
  CheckCircle2,
  MessageSquare,
  Users,
  Play,
  Save,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ZoomIn,
  ZoomOut,
  Send,
  HelpCircle,
  Clock,
  Tag,
  GitBranch,
  Copy,
  MoreVertical,
  X,
  FileText,
  Image,
  Video,
  File,
  Mic,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { BLAST_KPIS, CHATBOTS_DATA } from '../../data/mockBlastData.js'

export default function ChatbotPage() {
  const [bots, setBots] = useState(CHATBOTS_DATA)
  const [botName, setBotName] = useState('Customer Support Bot')
  const [rightTab, setRightTab] = useState('settings')
  const [zoom, setZoom] = useState(100)
  const [feedback, setFeedback] = useState(null)

  // Block settings
  const [blockName, setBlockName] = useState('Welcome Message')
  const [blockType, setBlockType] = useState('Text Message')
  const [blockContent, setBlockContent] = useState('Hi {{name}}!\nHow can we help you today?')
  const [quickReplies, setQuickReplies] = useState([
    'Product Info',
    'Order Status',
    'Support',
    'Talk to Agent',
  ])

  // Smartphone simulator messages
  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi John!\nHow can we help you today?',
      buttons: ['Product Info', 'Order Status', 'Support', 'Talk to Agent'],
    },
  ])
  const [simInput, setSimInput] = useState('')

  const handleSimButtonClick = (btnText) => {
    // Add user response
    const userMsg = { id: Date.now(), sender: 'user', text: btnText }
    let botReply = ''
    let newButtons = null

    if (btnText === 'Product Info') {
      botReply = 'Here are our popular products:\n👟 Sports Shoe ($49.99)\n⌚ Smart Watch ($89.99)\nWould you like to view our full catalog?'
      newButtons = ['View Catalog', 'Back to Menu']
    } else if (btnText === 'Order Status') {
      botReply = 'Please enter your 5-digit Order ID (e.g. #12345):'
    } else if (btnText === 'Support') {
      botReply = 'Please briefly describe your issue and our team will assist you.'
    } else if (btnText === 'Talk to Agent') {
      botReply = 'Connecting you to a live support agent right now. Please wait a moment... 🧑‍💻'
    } else if (btnText === 'Back to Menu') {
      botReply = 'How else can we help you today?'
      newButtons = ['Product Info', 'Order Status', 'Support', 'Talk to Agent']
    } else {
      botReply = `Thanks for selecting "${btnText}". Processing your request...`
    }

    const botMsg = { id: Date.now() + 1, sender: 'bot', text: botReply, buttons: newButtons }
    setChatLog((prev) => [...prev, userMsg, botMsg])
  }

  const handleSimSend = (e) => {
    e?.preventDefault()
    if (!simInput.trim()) return

    const userMsg = { id: Date.now(), sender: 'user', text: simInput }
    const botMsg = {
      id: Date.now() + 1,
      sender: 'bot',
      text: `Order #${simInput.replace(/[^0-9]/g, '') || '12345'} is currently Out for Delivery and expected today by 4:00 PM! 🚚`,
      buttons: ['Track Live', 'Back to Menu'],
    }
    setChatLog((prev) => [...prev, userMsg, botMsg])
    setSimInput('')
  }

  const handlePublish = () => {
    setFeedback('Chatbot "' + botName + '" published successfully!')
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chatbot Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create intelligent WhatsApp chatbots with no code. Automate customer conversations, answer FAQs and drive conversions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRightTab('preview')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs transition"
          >
            <Play className="w-3.5 h-3.5 text-[#00A884]" />
            Test Bot
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs transition">
            <Save className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            Save
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Total Bots</span>
            <Bot className="w-4 h-4 text-[#00A884]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.chatbot.total.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.chatbot.total.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.chatbot.total.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Active Bots</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.chatbot.active.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.chatbot.active.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.chatbot.active.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Conversations</span>
            <MessageSquare className="w-4 h-4 text-[#00A884]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.chatbot.conversations.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.chatbot.conversations.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.chatbot.conversations.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.chatbot.resolutionRate.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.chatbot.resolutionRate.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.chatbot.resolutionRate.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">Fallback to Agent</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.chatbot.fallbackRate.value}
            </h3>
            <span className="text-xs font-semibold text-amber-500">
              {BLAST_KPIS.chatbot.fallbackRate.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.chatbot.fallbackRate.period}</p>
        </div>
      </div>

      {/* Main Flow Canvas Builder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#00A884] font-bold text-sm text-slate-900 dark:text-white px-1"
            />
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Zoom Controls */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-500">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-Section: Palette (Left), Diagram Canvas (Center), Inspector & Preview (Right) */}
        <div className="grid grid-cols-12 min-h-[520px]">
          {/* Left Block Palette (2 cols) */}
          <div className="col-span-2 border-r border-slate-200 dark:border-slate-800 p-3 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Messages
              </span>
              <div className="space-y-1">
                {['Text Message', 'Image', 'Video', 'Document', 'Audio', 'Location', 'Media + Text', 'Template Message'].map((m) => (
                  <div
                    key={m}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00A884] cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <MessageSquare className="w-3 h-3 text-[#00A884]" />
                    <span className="text-[11px] truncate">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Flow Logic
              </span>
              <div className="space-y-1">
                {['Buttons (Quick Reply)', 'List Message', 'Condition', 'Ask Question', 'Set Variable', 'Wait / Delay', 'Go to Step', 'End Flow'].map((l) => (
                  <div
                    key={l}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <GitBranch className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] truncate">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Actions
              </span>
              <div className="space-y-1">
                {['Add to Group', 'Tag Contact', 'Update Field', 'Assign to Agent', 'Trigger Automation', 'API Webhook'].map((a) => (
                  <div
                    key={a}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <Users className="w-3 h-3 text-blue-500" />
                    <span className="text-[11px] truncate">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Flowchart Canvas (6 cols) */}
          <div className="col-span-6 bg-[#F8FAFB] dark:bg-slate-950/40 p-4 overflow-auto flex flex-col items-center space-y-4">
            {/* Start Node */}
            <div className="w-60 p-2.5 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500 shadow-xs text-xs text-center">
              <span className="font-bold text-slate-900 dark:text-white block">Start</span>
              <span className="text-[10px] text-slate-400">When a user sends a message</span>
            </div>

            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />

            {/* Welcome Message Node */}
            <div className="w-64 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-[#00A884] shadow-xs text-xs">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-[#00A884]" />
                <span className="font-bold text-slate-900 dark:text-white">Welcome Message</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Hi {'{{name}}'}!<br />How can we help you today?
              </p>
            </div>

            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />

            {/* Button Options Node */}
            <div className="w-64 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-sky-400 shadow-xs text-xs">
              <span className="font-bold text-sky-600 block mb-1.5">Button Options</span>
              <div className="space-y-1">
                {['Product Info', 'Order Status', 'Support', 'Talk to Agent'].map((opt) => (
                  <div
                    key={opt}
                    className="p-1 px-2 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-[10px] font-medium"
                  >
                    • {opt}
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Child Branches */}
            <div className="grid grid-cols-4 gap-2 w-full pt-1">
              {/* Product Info Branch */}
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-500">Product Info</span>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block">Send Message</span>
                  <span className="text-slate-400">Here are our products...</span>
                </div>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block text-emerald-600">Show Catalog</span>
                </div>
              </div>

              {/* Order Status Branch */}
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-500">Order Status</span>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block">Ask Question</span>
                  <span className="text-slate-400">Enter order number...</span>
                </div>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block text-blue-600">Check Order</span>
                </div>
              </div>

              {/* Support Branch */}
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-500">Support</span>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block">Send Message</span>
                  <span className="text-slate-400">Describe your issue...</span>
                </div>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block text-purple-600">Create Ticket</span>
                </div>
              </div>

              {/* Talk to Agent Branch */}
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-500">Talk to Agent</span>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block">Assign to Agent</span>
                  <span className="text-slate-400">Forward to live support</span>
                </div>
                <div className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] shadow-2xs">
                  <span className="font-semibold block text-amber-600">Send Message</span>
                  <span className="text-slate-400">Connecting you...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Settings vs Simulator (4 cols) */}
          <div className="col-span-4 border-l border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-white dark:bg-slate-900 flex flex-col text-xs">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setRightTab('settings')}
                  className={`font-semibold pb-1 border-b-2 transition ${
                    rightTab === 'settings'
                      ? 'border-[#00A884] text-[#00A884]'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  Block Settings
                </button>
                <button
                  onClick={() => setRightTab('variables')}
                  className={`font-semibold pb-1 border-b-2 transition ${
                    rightTab === 'variables'
                      ? 'border-[#00A884] text-[#00A884]'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  Variables
                </button>
              </div>

              <button
                onClick={() => setRightTab('preview')}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md font-semibold transition ${
                  rightTab === 'preview'
                    ? 'bg-[#00A884] text-white'
                    : 'bg-emerald-50 text-[#00A884] dark:bg-emerald-950/40'
                }`}
              >
                <Play className="w-3 h-3" />
                Preview (WhatsApp)
              </button>
            </div>

            {rightTab === 'settings' && (
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Block Name
                  </label>
                  <input
                    type="text"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Message Type
                  </label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <option>Text Message</option>
                    <option>Quick Reply Buttons</option>
                    <option>List Message</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Message Content *
                  </label>
                  <textarea
                    rows={4}
                    value={blockContent}
                    onChange={(e) => setBlockContent(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <button className="text-[#00A884] hover:underline">Add Variable ▾</button>
                    <span>{blockContent.length}/4096</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                    Enable Quick Replies
                  </span>
                  <div className="space-y-1.5">
                    {quickReplies.map((r, i) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">{r}</span>
                        <button
                          onClick={() => setQuickReplies(quickReplies.filter((_, idx) => idx !== i))}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setQuickReplies([...quickReplies, 'New Option'])}
                      className="text-[11px] text-[#00A884] font-semibold hover:underline"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex items-center gap-1 text-rose-600 hover:underline">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Block
                  </button>
                  <button className="px-4 py-2 bg-[#00A884] text-white font-semibold rounded-xl shadow-xs">
                    Save Block
                  </button>
                </div>
              </div>
            )}

            {rightTab === 'variables' && (
              <div className="space-y-2 flex-1 text-xs">
                <p className="text-slate-500">Available system & session variables:</p>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  <span className="text-[#00A884]">{`{{name}}`}</span>: Customer full name
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  <span className="text-[#00A884]">{`{{phone}}`}</span>: Customer phone number
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                  <span className="text-[#00A884]">{`{{last_order_id}}`}</span>: Most recent order ID
                </div>
              </div>
            )}

            {rightTab === 'preview' && (
              <div className="flex-1 flex flex-col rounded-2xl border-4 border-slate-800 bg-[#EFEAE2] dark:bg-slate-950 overflow-hidden shadow-inner">
                {/* Phone Header */}
                <div className="bg-[#008069] text-white p-2.5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold leading-none">Your Business</h5>
                    <span className="text-[10px] text-emerald-200">Online</span>
                  </div>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
                  {chatLog.map((m) => {
                    const isUser = m.sender === 'user'
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl p-2.5 text-xs shadow-2xs whitespace-pre-line leading-relaxed ${
                            isUser
                              ? 'bg-[#E7F8F0] dark:bg-emerald-950/80 text-slate-900 dark:text-white rounded-tr-none'
                              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-tl-none'
                          }`}
                        >
                          {m.text}
                          <div className="flex justify-end text-[9px] text-slate-400 mt-1">
                            10:30 AM
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        {m.buttons && (
                          <div className="mt-1 space-y-1 w-[85%]">
                            {m.buttons.map((btn, i) => (
                              <button
                                key={i}
                                onClick={() => handleSimButtonClick(btn)}
                                className="w-full py-1 text-[11px] bg-white dark:bg-slate-900 text-[#00A884] font-semibold rounded-lg shadow-2xs border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition text-center"
                              >
                                {btn}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Simulator Input */}
                <form
                  onSubmit={handleSimSend}
                  className="p-1.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-[#00A884] text-white rounded-lg shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bots List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs">
            {['All Bots', 'Active', 'Drafts', 'Paused'].map((tab) => (
              <button
                key={tab}
                className="px-3 py-1 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 first:bg-[#00A884]/10 first:text-[#00A884]"
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#00A884] text-white rounded-lg">
            <Plus className="w-3.5 h-3.5" /> Create New Bot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" className="rounded accent-[#00A884]" />
                </th>
                <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                <th className="py-2.5 px-3 font-semibold">Bot Name</th>
                <th className="py-2.5 px-3 font-semibold">Trigger</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Conversations</th>
                <th className="py-2.5 px-3 font-semibold">Resolution Rate</th>
                <th className="py-2.5 px-3 font-semibold">Fallback to Agent</th>
                <th className="py-2.5 px-3 font-semibold">Last Updated</th>
                <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bots.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded accent-[#00A884]" />
                  </td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {b.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{b.trigger}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {b.conversations}
                  </td>
                  <td className="py-3 px-3 text-emerald-600 font-semibold">{b.resolutionRate}</td>
                  <td className="py-3 px-3 text-amber-600 font-semibold">{b.fallbackRate}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{b.lastUpdated}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-[#00A884] rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:text-slate-600 rounded">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
