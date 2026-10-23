import { useState } from 'react'
import {
  Workflow,
  CheckCircle2,
  Zap,
  Play,
  Pause,
  Save,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitBranch,
  Clock,
  Tag,
  Users,
  Code,
  XCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Smile,
  X,
} from 'lucide-react'
import { BLAST_KPIS, AUTOMATIONS_DATA } from '../../data/mockBlastData.js'

export default function AutomationPage() {
  const [automations, setAutomations] = useState(AUTOMATIONS_DATA)
  const [flowTitle, setFlowTitle] = useState('Welcome & Onboarding Flow')
  const [isActive, setIsActive] = useState(true)
  const [selectedNode, setSelectedNode] = useState('sendMsg1')
  const [zoom, setZoom] = useState(100)
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState(null)

  // Node settings state
  const [nodeSettings, setNodeSettings] = useState({
    type: 'Text Message',
    content: 'Welcome back {{name}}!\nHow can I help you today?',
    quickReplies: true,
    replies: ['View Products', 'Talk to Agent', 'Check Order Status', 'Other'],
    nextStep: 'Wait for Reply',
  })

  const handleTestFlow = () => {
    setFeedback('Test flow triggered successfully for test contact!')
    setTimeout(() => setFeedback(null), 3500)
  }

  const handlePublish = () => {
    setFeedback('Workflow "' + flowTitle + '" published and activated!')
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Automation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create automated workflows to engage, follow up and convert your customers on WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Template Library
          </button>
          <button
            onClick={() => handlePublish()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Automation
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
            <span className="text-xs font-medium text-slate-500">Total Automations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Workflow className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.automation.total.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.automation.total.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.automation.total.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Automations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.automation.active.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.automation.active.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.automation.active.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Executions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.automation.executions.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.automation.executions.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.automation.executions.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Success Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.automation.successRate.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.automation.successRate.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.automation.successRate.period}</p>
        </div>
      </div>

      {/* Visual Workflow Canvas Builder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Canvas Toolbar Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
              <input
                type="text"
                value={flowTitle}
                onChange={(e) => setFlowTitle(e.target.value)}
                className="bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#00A884] font-bold text-slate-900 dark:text-white px-1"
              />
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              <button
                onClick={() => setIsActive((v) => !v)}
                className={`w-9 h-5 rounded-full transition relative ${
                  isActive ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition ${
                    isActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {isActive ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestFlow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 shadow-2xs"
            >
              <Play className="w-3 h-3 text-[#00A884]" />
              Test Flow
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 shadow-2xs">
              <Save className="w-3 h-3 text-slate-600 dark:text-slate-300" />
              Save
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Publish
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 text-xs">
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

        {/* 3-Section Canvas: Palette (Left), Diagram (Center), Inspector (Right) */}
        <div className="grid grid-cols-12 min-h-[520px]">
          {/* Left: Add Node Palette (2 cols) */}
          <div className="col-span-2 border-r border-slate-200 dark:border-slate-800 p-3 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Messages
              </span>
              <div className="space-y-1">
                {['Send Message', 'Send Template', 'Send Media', 'Interactive Message'].map((m) => (
                  <div
                    key={m}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00A884] cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#00A884]" />
                    <span className="text-[11px] font-medium truncate">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Logic
              </span>
              <div className="space-y-1">
                {['Condition', 'Wait / Delay', 'A/B Split', 'Tag Contact', 'Update Field'].map((l) => (
                  <div
                    key={l}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-medium truncate">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Actions
              </span>
              <div className="space-y-1">
                {['Assign to Agent', 'Add to Group', 'Webhook', 'End Flow'].map((a) => (
                  <div
                    key={a}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-grab flex items-center gap-2 shadow-2xs"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-medium truncate">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Interactive Workflow Canvas (7 cols) */}
          <div className="col-span-7 bg-[#F8FAFB] dark:bg-slate-950/40 p-6 relative overflow-auto flex flex-col items-center">
            {/* SVG Connecting Paths */}
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Trigger Node */}
              <div className="w-64 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500 shadow-xs text-xs relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                    <Play className="w-3 h-3 fill-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">Trigger</span>
                </div>
                <p className="text-[11px] text-slate-500">When a new message is received</p>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              {/* Connecting line */}
              <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />

              {/* Condition Node */}
              <div className="w-64 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-300 dark:border-amber-700 shadow-xs text-xs relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                    <GitBranch className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">Condition</span>
                </div>
                <p className="text-[11px] text-slate-500">Is contact in database?</p>
              </div>

              {/* Split Branches */}
              <div className="w-full max-w-xl flex justify-between gap-6 pt-2">
                {/* Branch YES (Left) */}
                <div className="flex-1 flex flex-col items-center space-y-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    Yes
                  </span>

                  {/* Send Message Node (Selected) */}
                  <div
                    onClick={() => setSelectedNode('sendMsg1')}
                    className={`w-56 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 transition cursor-pointer shadow-xs text-xs ${
                      selectedNode === 'sendMsg1'
                        ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-[#00A884]" />
                      <span className="font-bold text-slate-900 dark:text-white">Send Message</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Welcome back {'{{name}}'}! How can I help you today?
                    </p>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-300 dark:bg-slate-700" />

                  {/* Delay Node */}
                  <div className="w-56 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      <span className="font-bold text-slate-900 dark:text-white">Wait 1 minute</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Wait for customer reply</p>
                  </div>
                </div>

                {/* Branch NO (Right) */}
                <div className="flex-1 flex flex-col items-center space-y-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                    No
                  </span>

                  {/* Send Welcome Message */}
                  <div className="w-56 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-[#00A884]" />
                      <span className="font-bold text-slate-900 dark:text-white">Send Message</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Hi there! Welcome to BlastWhatsApp! Please share your name.
                    </p>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-300 dark:bg-slate-700" />

                  {/* Add to Group Node */}
                  <div className="w-56 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-bold text-slate-900 dark:text-white">Add to Group</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Add to 'New Leads' group</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Node Settings Panel (3 cols) */}
          <div className="col-span-3 border-l border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-white dark:bg-slate-900 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00A884]" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Send Message</h4>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Message Type
              </label>
              <select
                value={nodeSettings.type}
                onChange={(e) => setNodeSettings((p) => ({ ...p, type: e.target.value }))}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>Text Message</option>
                <option>Template Message</option>
                <option>Interactive Button</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Message Content *
              </label>
              <textarea
                rows={4}
                value={nodeSettings.content}
                onChange={(e) => setNodeSettings((p) => ({ ...p, content: e.target.value }))}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <button className="text-[#00A884] hover:underline font-medium">
                  Add Variable ▾
                </button>
                <span>{nodeSettings.content.length}/4096</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Enable Quick Replies
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setNodeSettings((p) => ({ ...p, quickReplies: !p.quickReplies }))
                  }
                  className={`w-8 h-4.5 rounded-full transition relative ${
                    nodeSettings.quickReplies ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition ${
                      nodeSettings.quickReplies ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {nodeSettings.quickReplies && (
                <div className="space-y-1.5">
                  {nodeSettings.replies.map((reply, i) => (
                    <div
                      key={i}
                      className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                    >
                      <span>{reply}</span>
                      <button className="text-slate-400 hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button className="text-[11px] text-[#00A884] font-semibold hover:underline">
                    + Add Option
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Next Step
              </label>
              <select
                value={nodeSettings.nextStep}
                onChange={(e) => setNodeSettings((p) => ({ ...p, nextStep: e.target.value }))}
                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <option>Wait for Reply</option>
                <option>Send Follow-up</option>
                <option>Assign to Agent</option>
                <option>End Flow</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl font-semibold border border-rose-200 dark:border-rose-900/40">
                <Trash2 className="w-3.5 h-3.5" />
                Delete Node
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Automations List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {['All Automations', 'Active', 'Paused', 'Drafts'].map((tab) => (
              <button
                key={tab}
                className="px-3 py-1 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 first:bg-[#00A884]/10 first:text-[#00A884]"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search automations..."
                className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
              <option>All Status</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input type="checkbox" className="rounded accent-[#00A884]" />
                </th>
                <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                <th className="py-2.5 px-3 font-semibold">Automation Name</th>
                <th className="py-2.5 px-3 font-semibold">Trigger</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Executions</th>
                <th className="py-2.5 px-3 font-semibold">Success Rate</th>
                <th className="py-2.5 px-3 font-semibold">Last Updated</th>
                <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {automations.map((a, idx) => (
                <tr key={a.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded accent-[#00A884]" />
                  </td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {a.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{a.trigger}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        a.status === 'Active'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          a.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {a.executions}
                  </td>
                  <td className="py-3 px-3 text-emerald-600 font-semibold">{a.successRate}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{a.lastUpdated}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-[#00A884] rounded">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:text-slate-600 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
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
