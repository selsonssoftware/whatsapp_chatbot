import { useState } from 'react'
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Folder,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  MoreVertical,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react'
import { BLAST_KPIS, TEMPLATES_DATA } from '../../data/mockBlastData.js'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(TEMPLATES_DATA)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showDrawer, setShowDrawer] = useState(true)
  const [drawerTab, setDrawerTab] = useState('create')
  const [templateForm, setTemplateForm] = useState({
    name: 'welcome_message',
    category: 'Marketing',
    language: 'English',
    headerType: 'None',
    content: 'Hi {{1}},\n\nWelcome to our store! We are excited to have you with us.\n\nEnjoy 10% off your first order.',
    footer: 'Thank you, Team BlastWhatsApp',
    buttons: 'Quick Reply',
  })
  const [feedback, setFeedback] = useState(null)

  const handleSaveDraft = () => {
    setFeedback('Template saved as Draft!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleSubmit = () => {
    const newT = {
      id: Date.now(),
      name: templateForm.name,
      sample: templateForm.content.slice(0, 25) + '...',
      category: templateForm.category,
      language: templateForm.language,
      status: 'Pending',
      sent: '0',
      updatedAt: 'Just now',
    }
    setTemplates([newT, ...templates])
    setFeedback('Template submitted for WhatsApp approval!')
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Message Templates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, manage and use WhatsApp message templates for your campaigns, automation and customer communication.
          </p>
        </div>

        <button
          onClick={() => {
            setShowDrawer(true)
            setDrawerTab('create')
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
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
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Total Templates</span>
            <MessageSquare className="w-4 h-4 text-[#00A884]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.templates.total.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.templates.total.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.templates.total.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.templates.approved.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.templates.approved.change}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.templates.approved.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {BLAST_KPIS.templates.pending.value}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.templates.pending.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Rejected</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {BLAST_KPIS.templates.rejected.value}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.templates.rejected.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Categories</span>
            <Folder className="w-4 h-4 text-[#00A884]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {BLAST_KPIS.templates.categories.value}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">{BLAST_KPIS.templates.categories.period}</p>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Table Column */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs`}>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates by name, category or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Categories</option>
                <option>Marketing</option>
                <option>Transactional</option>
                <option>Utility</option>
                <option>Authentication</option>
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>All Languages</option>
                <option>English</option>
                <option>Spanish</option>
              </select>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded accent-[#00A884]" />
                  </th>
                  <th className="py-2.5 px-2 w-10 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Template Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Language</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Messages Sent</th>
                  <th className="py-2.5 px-3 font-semibold">Updated At</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {templates
                  .filter((t) => {
                    const matchesSearch =
                      t.name.toLowerCase().includes(search.toLowerCase()) ||
                      t.sample.toLowerCase().includes(search.toLowerCase())
                    const matchesStatus =
                      statusFilter === 'All Status' || t.status === statusFilter
                    return matchesSearch && matchesStatus
                  })
                  .map((t, idx) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-3">
                        <input type="checkbox" className="rounded accent-[#00A884]" />
                      </td>
                      <td className="py-3 px-2 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block font-mono">
                            {t.name}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
                            {t.sample}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.category === 'Marketing'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                              : t.category === 'Transactional'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                              : t.category === 'Authentication'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{t.language}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            t.status === 'Approved'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : t.status === 'Pending'
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'Approved'
                                ? 'bg-emerald-500'
                                : t.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                        {t.sent}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{t.updatedAt}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-400">
                          <button
                            onClick={() => {
                              setShowDrawer(true)
                              setDrawerTab('preview')
                            }}
                            className="p-1 hover:text-[#00A884] rounded"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-600 rounded">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-600 rounded">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span>Show 10 per page ▾</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded bg-[#00A884] text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                3
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                4
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                5
              </button>
              <span>...</span>
              <button className="px-1 text-xs">48</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Create Template / Preview */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDrawerTab('create')}
                  className={`text-xs font-bold px-3 py-1 rounded-md transition ${
                    drawerTab === 'create'
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#00A884]'
                      : 'text-slate-500'
                  }`}
                >
                  Create Template
                </button>
                <button
                  onClick={() => setDrawerTab('preview')}
                  className={`text-xs font-bold px-3 py-1 rounded-md transition ${
                    drawerTab === 'preview'
                      ? 'bg-slate-100 dark:bg-slate-800 text-[#00A884]'
                      : 'text-slate-500'
                  }`}
                >
                  Preview
                </button>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {drawerTab === 'create' ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. welcome_message"
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category *
                    </label>
                    <select
                      value={templateForm.category}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <option>Marketing</option>
                      <option>Transactional</option>
                      <option>Utility</option>
                      <option>Authentication</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Language *
                    </label>
                    <select
                      value={templateForm.language}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, language: e.target.value }))
                      }
                      className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Arabic</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Header (Optional)
                    </label>
                    <button className="text-[11px] text-[#00A884] hover:underline">
                      Add Variable
                    </button>
                  </div>
                  <select
                    value={templateForm.headerType}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, headerType: e.target.value }))
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <option>None</option>
                    <option>Text</option>
                    <option>Image</option>
                    <option>Video</option>
                    <option>Document</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Message Content *
                  </label>
                  <textarea
                    rows={4}
                    value={templateForm.content}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, content: e.target.value }))
                    }
                    placeholder="Type your message here... Use {{1}}, {{2}} for variables"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>Use {'{{1}}'}, {'{{2}}'} for variables</span>
                    <span>{templateForm.content.length}/1024</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Footer (Optional)
                  </label>
                  <input
                    type="text"
                    value={templateForm.footer}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, footer: e.target.value }))
                    }
                    placeholder="e.g. Thank you, Team BlastWhatsApp"
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Buttons (Optional)
                    </label>
                    <button className="text-[11px] text-[#00A884] hover:underline font-semibold">
                      + Add Button
                    </button>
                  </div>
                  <select
                    value={templateForm.buttons}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, buttons: e.target.value }))
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <option>No Buttons</option>
                    <option>Quick Reply</option>
                    <option>Call to Action (URL / Phone)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleSaveDraft}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1 px-4 py-2 bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl font-semibold shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit for Approval
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#EFEAE2] dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-xs border border-slate-200/50 dark:border-slate-800 text-xs">
                  <p className="whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-200">
                    {templateForm.content.replace('{{1}}', 'Sarah')}
                  </p>
                  {templateForm.footer && (
                    <p className="text-[10px] text-slate-400 mt-2 border-t pt-1 border-slate-100 dark:border-slate-800">
                      {templateForm.footer}
                    </p>
                  )}
                  <div className="flex justify-end text-[9px] text-slate-400 mt-1">10:30 AM</div>
                </div>

                {templateForm.buttons !== 'No Buttons' && (
                  <button className="w-full py-2 bg-white dark:bg-slate-900 text-[#00A884] font-semibold text-xs rounded-xl shadow-xs border border-slate-200 dark:border-slate-800">
                    Visit Website
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
