import { useState } from 'react'
import {
  GitBranch,
  CheckCircle2,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  X,
  FileText,
  Image,
  Video,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Layers,
  ShoppingBag,
  Package,
  Headphones,
} from 'lucide-react'
import { BLAST_KPIS, FLOWS_DATA } from '../../data/mockBlastData.js'

export default function FlowsPage() {
  const [flows, setFlows] = useState(FLOWS_DATA)
  const [flowTitle, setFlowTitle] = useState('Product Inquiry Flow')
  const [selectedScreen, setSelectedScreen] = useState('welcome')
  const [zoom, setZoom] = useState(100)
  const [feedback, setFeedback] = useState(null)

  // Node settings form
  const [screenSettings, setScreenSettings] = useState({
    title: 'Welcome to DemoStore!',
    description: 'How can we help you today?',
    buttons: ['View Products', 'Track Order', 'Talk to Support'],
    nextStep: 'Product Catalog',
  })

  // Simulated mobile active view in WhatsApp Flows
  const [simScreen, setSimScreen] = useState('welcome')

  const handlePublish = () => {
    setFeedback('WhatsApp Flow "' + flowTitle + '" published to Meta successfully!')
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            WhatsApp Flows
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create and manage interactive WhatsApp Flows for forms, catalog, payments and customer journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            Flow Templates
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Flow
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
            <span className="text-xs font-medium text-slate-500">Total Flows</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.flows.totalFlows.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.flows.totalFlows.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.flows.totalFlows.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Flows</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.flows.activeFlows.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.flows.activeFlows.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.flows.activeFlows.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Views</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.flows.totalViews.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.flows.totalViews.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.flows.totalViews.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.flows.completionRate.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.flows.completionRate.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.flows.completionRate.period}</p>
        </div>
      </div>

      {/* Visual Flow Builder */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Builder Toolbar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={flowTitle}
              onChange={(e) => setFlowTitle(e.target.value)}
              className="bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#00A884] font-bold text-sm text-slate-900 dark:text-white px-1"
            />
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-1">
              Draft
            </span>
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

            <button
              onClick={handlePublish}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-lg font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Publish
            </button>
          </div>
        </div>

        {/* 4-Column Layout: Add Component, Canvas, Node Settings, WhatsApp Preview */}
        <div className="grid grid-cols-12 min-h-[520px]">
          {/* Col 1: Add Component Palette (2 cols) */}
          <div className="col-span-2 border-r border-slate-200 dark:border-slate-800 p-3 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Layout
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {['Text', 'Image', 'Video', 'Header', 'Footer', 'Divider'].map((item) => (
                  <div
                    key={item}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#00A884] cursor-grab text-center font-medium shadow-2xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Input
              </span>
              <div className="space-y-1 text-[11px]">
                {['Text Input', 'Email Input', 'Date Picker', 'Radio Buttons', 'Dropdown', 'Checkbox'].map((item) => (
                  <div
                    key={item}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-grab font-medium shadow-2xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">
                Actions
              </span>
              <div className="space-y-1 text-[11px]">
                {['Button', 'Navigation', 'Open URL', 'Call Phone', 'Catalog', 'End Flow'].map((item) => (
                  <div
                    key={item}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-grab font-medium shadow-2xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Canvas Diagram (5 cols) */}
          <div className="col-span-5 bg-[#F8FAFB] dark:bg-slate-950/40 p-4 overflow-auto flex flex-col items-center space-y-4">
            {/* Welcome Screen Card (Active) */}
            <div
              onClick={() => {
                setSelectedScreen('welcome')
                setSimScreen('welcome')
              }}
              className={`w-64 p-3 bg-white dark:bg-slate-900 rounded-xl border-2 transition cursor-pointer shadow-xs text-xs ${
                selectedScreen === 'welcome'
                  ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-[#00A884]" />
                <span className="font-bold text-slate-900 dark:text-white">Welcome Screen</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Welcome to {'{{business_name}}'}! How can we help you today?
              </p>
              <div className="flex flex-wrap gap-1">
                {['View Products', 'Track Order', 'Talk to Support'].map((b) => (
                  <span
                    key={b}
                    className="px-1.5 py-0.5 bg-emerald-50 text-[#00A884] text-[9px] font-bold rounded"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />

            {/* 3 Branches */}
            <div className="grid grid-cols-3 gap-2.5 w-full">
              {/* Product Catalog */}
              <div
                onClick={() => {
                  setSelectedScreen('catalog')
                  setSimScreen('catalog')
                }}
                className={`p-2.5 bg-white dark:bg-slate-900 rounded-xl border transition cursor-pointer shadow-xs text-xs ${
                  selectedScreen === 'catalog'
                    ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                    Product Catalog
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Browse our latest products</p>
                <button className="mt-2 text-[10px] text-blue-600 font-semibold underline">
                  View Details
                </button>
              </div>

              {/* Track Order */}
              <div
                onClick={() => {
                  setSelectedScreen('track')
                  setSimScreen('track')
                }}
                className={`p-2.5 bg-white dark:bg-slate-900 rounded-xl border transition cursor-pointer shadow-xs text-xs ${
                  selectedScreen === 'track'
                    ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Package className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                    Track Order
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Enter order number</p>
                <button className="mt-2 text-[10px] text-amber-600 font-semibold underline">
                  Check Status
                </button>
              </div>

              {/* Support */}
              <div
                onClick={() => {
                  setSelectedScreen('support')
                  setSimScreen('support')
                }}
                className={`p-2.5 bg-white dark:bg-slate-900 rounded-xl border transition cursor-pointer shadow-xs text-xs ${
                  selectedScreen === 'support'
                    ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Headphones className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                    Support
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Technical / Refund</p>
                <button className="mt-2 text-[10px] text-rose-600 font-semibold underline">
                  Talk to Agent
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Node Settings (2.5 cols) */}
          <div className="col-span-2 border-l border-slate-200 dark:border-slate-800 p-3 space-y-3 bg-white dark:bg-slate-900 text-xs">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Node Settings</h4>
              <p className="text-[10px] text-slate-400">Screen Type: Welcome Screen</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Title
              </label>
              <input
                type="text"
                value={screenSettings.title}
                onChange={(e) =>
                  setScreenSettings((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={screenSettings.description}
                onChange={(e) =>
                  setScreenSettings((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Button Options
                </span>
                <button className="text-[10px] text-[#00A884] font-semibold hover:underline">
                  + Add
                </button>
              </div>
              <div className="space-y-1">
                {screenSettings.buttons.map((b, i) => (
                  <div
                    key={i}
                    className="p-1 px-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] flex items-center justify-between"
                  >
                    <span>{b}</span>
                    <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Next Step
              </label>
              <select className="w-full p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800">
                <option>Product Catalog</option>
                <option>Track Order</option>
                <option>Support</option>
              </select>
            </div>

            <button className="w-full py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold border border-rose-200 text-xs">
              Delete Node
            </button>
          </div>

          {/* Col 4: WhatsApp Flows Phone Preview (3 cols) */}
          <div className="col-span-3 border-l border-slate-200 dark:border-slate-800 p-3 bg-[#EFEAE2] dark:bg-slate-950 flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 mb-2">
              Preview (WhatsApp Flow)
            </span>

            {/* Mobile Device Mockup */}
            <div className="flex-1 rounded-2xl border-4 border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden flex flex-col">
              {/* Top bar */}
              <div className="bg-[#008069] text-white p-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  D
                </div>
                <div>
                  <h5 className="text-xs font-bold leading-none">Your Business</h5>
                  <span className="text-[9px] text-emerald-200">Business Account</span>
                </div>
              </div>

              {/* Native WhatsApp Flow interactive container */}
              <div className="flex-1 p-3 flex flex-col justify-between text-xs space-y-3">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    DemoStore Catalog
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {simScreen === 'welcome' && screenSettings.title}
                    {simScreen === 'catalog' && 'Product Catalog'}
                    {simScreen === 'track' && 'Track Your Order'}
                    {simScreen === 'support' && 'Customer Support'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {simScreen === 'welcome' && screenSettings.description}
                    {simScreen === 'catalog' && 'Explore popular footwear, watches & apparel.'}
                    {simScreen === 'track' && 'Enter your tracking number below.'}
                    {simScreen === 'support' && 'How can our support team help you today?'}
                  </p>
                </div>

                {/* Form interactive elements */}
                <div className="space-y-2">
                  {simScreen === 'welcome' ? (
                    <>
                      <button
                        onClick={() => setSimScreen('catalog')}
                        className="w-full py-2 bg-[#00A884] text-white font-semibold rounded-xl text-xs shadow-xs hover:bg-[#008f6f]"
                      >
                        🛍️ View Products
                      </button>
                      <button
                        onClick={() => setSimScreen('track')}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200"
                      >
                        📦 Track Order
                      </button>
                      <button
                        onClick={() => setSimScreen('support')}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200"
                      >
                        🎧 Talk to Support
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSimScreen('welcome')}
                      className="w-full py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Back to Start
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Flows Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs">
            {['All Flows', 'Published', 'Drafts', 'Archived'].map((tab) => (
              <button
                key={tab}
                className="px-3 py-1 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 first:bg-[#00A884]/10 first:text-[#00A884]"
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search flows..."
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
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
                <th className="py-2.5 px-3 font-semibold">Flow Name</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Views</th>
                <th className="py-2.5 px-3 font-semibold">Completions</th>
                <th className="py-2.5 px-3 font-semibold">Completion Rate</th>
                <th className="py-2.5 px-3 font-semibold">Last Updated</th>
                <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {flows.map((f, idx) => (
                <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <input type="checkbox" className="rounded accent-[#00A884]" />
                  </td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {f.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{f.type}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        f.status === 'Published'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          f.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {f.views}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-200">{f.completions}</td>
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <span className="font-semibold text-emerald-600">{f.rate}</span>
                      <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: f.rate }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{f.lastUpdated}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-[#00A884] rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:text-slate-600 rounded">
                        <Eye className="w-3.5 h-3.5" />
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