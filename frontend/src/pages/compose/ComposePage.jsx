import { useState } from 'react'
import {
  Users,
  Search,
  FileText,
  Image,
  Video,
  File,
  Mic,
  MapPin,
  UserCheck,
  LayoutTemplate,
  Bold,
  Italic,
  Strikethrough,
  Smile,
  Plus,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'

const RECIPIENTS_LIST = [
  { id: 1, name: 'Sarah Johnson', phone: '+1 234 567 890', tags: ['Customer', 'VIP'], lastActive: '2m ago', active: true },
  { id: 2, name: 'Michael Chen', phone: '+1 987 654 321', tags: ['Lead', 'Interested'], lastActive: '12m ago', active: true },
  { id: 3, name: 'Emma Wilson', phone: '+44 7700 900123', tags: ['Customer', 'Online'], lastActive: '1h ago', active: false },
  { id: 4, name: 'Daniel Kim', phone: '+1 415 555 2678', tags: ['Lead', 'New'], lastActive: '3h ago', active: false },
  { id: 5, name: 'Priya Sharma', phone: '+91 98765 43210', tags: ['Customer', 'Repeat'], lastActive: '5h ago', active: false },
  { id: 6, name: 'Carlos Mendez', phone: '+52 555 123 4567', tags: ['Lead', 'Interested'], lastActive: '1d ago', active: false },
  { id: 7, name: 'Aisha Khan', phone: '+971 50 123 4567', tags: ['Customer', 'VIP'], lastActive: '1d ago', active: false },
  { id: 8, name: 'Lucas Oliveira', phone: '+55 11 98765 4321', tags: ['Lead', 'New'], lastActive: '2d ago', active: false },
]

export default function ComposePage() {
  const [recipientTab, setRecipientTab] = useState('contacts')
  const [selectedIds, setSelectedIds] = useState([1, 2])
  const [search, setSearch] = useState('')
  const [messageType, setMessageType] = useState('text')
  const [campaignName, setCampaignName] = useState('Special Offer Campaign')
  const [sendingMode, setSendingMode] = useState('now')
  const [scheduledDate, setScheduledDate] = useState('2024-05-10T14:30')
  const [messageText, setMessageText] = useState(
    `Hi {{1}},\n\nWe have a special offer for you! 🎉\n\nGet 20% Discount on your next purchase.\n\nUse code: WELCOME20\n\nShop now: https://yourstore.com\n\nThank you!\nTeam BlastWhatsApp`
  )
  const [toggles, setToggles] = useState({
    linkPreview: true,
    personalize: true,
    unsubscribe: false,
    trackStatus: true,
  })
  const [sentSuccess, setSentSuccess] = useState(false)

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAll = () => setSelectedIds(RECIPIENTS_LIST.map((r) => r.id))
  const clearSelection = () => setSelectedIds([])

  const previewName =
    RECIPIENTS_LIST.find((r) => r.id === selectedIds[0])?.name || 'Sarah Johnson'

  const formattedPreviewText = messageText.replace(/\{\{1\}\}/g, previewName.split(' ')[0])

  const handleSend = () => {
    setSentSuccess(true)
    setTimeout(() => setSentSuccess(false), 4000)
  }

  return (
    <div className="flex flex-col min-h-0 space-y-4 text-slate-800 dark:text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compose Message
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send personalized WhatsApp messages to your contacts or groups.
          </p>
        </div>

        {sentSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm border border-emerald-300 dark:border-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Message sent successfully to {selectedIds.length} recipients!
          </div>
        )}
      </div>

      {/* 4-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Step 1: Select Recipients */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col h-[680px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[#00A884] text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Select Recipients</h3>
          </div>

          {/* Subtabs */}
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3 text-xs font-medium">
            {['Contacts', 'Groups', 'Import (CSV)', 'Segments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRecipientTab(tab.toLowerCase())}
                className={`px-2.5 py-1 rounded-md transition ${
                  recipientTab === tab.toLowerCase()
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#00A884] font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts, name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-3 gap-1.5 mb-3 text-[11px]">
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 text-slate-600 dark:text-slate-300">
              <option>All Tags</option>
              <option>VIP</option>
              <option>Customer</option>
            </select>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 text-slate-600 dark:text-slate-300">
              <option>All Groups</option>
              <option>Retail</option>
              <option>Wholesale</option>
            </select>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 text-slate-600 dark:text-slate-300">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Actions & counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {selectedIds.length} selected
            </span>
            <div className="flex items-center gap-2">
              <button onClick={selectAll} className="text-[#00A884] hover:underline">
                Select All
              </button>
              <span>·</span>
              <button onClick={clearSelection} className="text-slate-400 hover:underline">
                Clear
              </button>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800/50">
            {RECIPIENTS_LIST.filter(
              (r) =>
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.phone.includes(search)
            ).map((contact) => {
              const isChecked = selectedIds.includes(contact.id)
              return (
                <div
                  key={contact.id}
                  onClick={() => toggleSelect(contact.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 rounded text-[#00A884] focus:ring-[#00A884] accent-[#00A884]"
                  />
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-slate-700 dark:text-slate-200">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{contact.lastActive}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{contact.phone}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {contact.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer pagination */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Show 10 per page ▾</span>
            <span>1-8 of 248</span>
          </div>
        </div>

        {/* Step 2: Message Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col h-[680px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00A884] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Message Content</h3>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#00A884] hover:underline font-medium">
              <LayoutTemplate className="w-3.5 h-3.5" />
              Use Template
            </button>
          </div>

          {/* Message Type grid */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Message Type
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
              {[
                { id: 'text', label: 'Text', icon: FileText },
                { id: 'image', label: 'Image', icon: Image },
                { id: 'video', label: 'Video', icon: Video },
                { id: 'document', label: 'Document', icon: File },
                { id: 'audio', label: 'Audio', icon: Mic },
                { id: 'location', label: 'Location', icon: MapPin },
                { id: 'contact', label: 'Contact', icon: UserCheck },
                { id: 'template', label: 'Template', icon: LayoutTemplate },
              ].map(({ id, label, icon: IconComponent }) => (
                <button
                  key={id}
                  onClick={() => setMessageType(id)}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition ${
                    messageType === id
                      ? 'border-[#00A884] bg-emerald-50/50 text-[#00A884] dark:bg-emerald-950/30 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-[11px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Formatting bar */}
          <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800 py-1.5 mb-2 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hover:text-slate-800 font-medium flex items-center gap-1"
                onClick={() => setMessageText((prev) => prev + ' {{1}} ')}
              >
                <span>{`{ }`}</span> Variables ▾
              </button>
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                <button
                  type="button"
                  className="p-1 hover:text-slate-800"
                  onClick={() => setMessageText((p) => p + ' *bold* ')}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-slate-800"
                  onClick={() => setMessageText((p) => p + ' _italic_ ')}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-slate-800"
                  onClick={() => setMessageText((p) => p + ' ~strike~ ')}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:text-slate-800"
                  onClick={() => setMessageText((p) => p + ' 🎉 ')}
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">{messageText.length}/4096</span>
          </div>

          {/* Textarea */}
          <textarea
            rows={12}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 w-full text-xs p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-[#00A884]/20 focus:border-[#00A884] leading-relaxed resize-none font-mono"
          />

          <button
            type="button"
            className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-[#00A884] text-[#00A884] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Button
          </button>
        </div>

        {/* Step 3: Preview Message (Smartphone Mockup) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col h-[680px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00A884] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Preview Message</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Preview as:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{previewName}</span>
            </div>
          </div>

          {/* Phone Frame */}
          <div className="flex-1 flex flex-col rounded-3xl border-4 border-slate-800 dark:border-slate-700 bg-[#EFEAE2] dark:bg-slate-950 overflow-hidden shadow-inner relative">
            {/* Phone Top Speaker */}
            <div className="bg-slate-800 dark:bg-slate-900 py-1 flex justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* WhatsApp Phone Header */}
            <div className="bg-[#008069] text-white px-3 py-2 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                {previewName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold truncate leading-tight">{previewName}</h4>
                <p className="text-[10px] text-emerald-200">online</p>
              </div>
            </div>

            {/* Chat Body Wallpaper */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col justify-start">
              {/* WhatsApp Message Bubble */}
              <div className="bg-white dark:bg-slate-900 rounded-xl rounded-tl-none p-3 shadow-xs max-w-[90%] border border-slate-200/50 dark:border-slate-800">
                <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {formattedPreviewText}
                </p>
                <div className="flex justify-end items-center gap-1 mt-1.5 text-[9px] text-slate-400">
                  <span>10:24 AM</span>
                  <span className="text-[#00A884]">✓✓</span>
                </div>
              </div>

              {/* Action Buttons Mock */}
              <div className="mt-2 space-y-1 max-w-[90%]">
                <button className="w-full py-1.5 text-xs bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 rounded-lg shadow-2xs font-semibold border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1">
                  <ExternalLink className="w-3 h-3" /> Visit Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Campaign Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col h-[680px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-[#00A884] text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Campaign Settings</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Campaign Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            {/* Sending Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Sending Mode
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={sendingMode === 'now'}
                    onChange={() => setSendingMode('now')}
                    className="accent-[#00A884]"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Send Now</span>
                    <p className="text-[10px] text-slate-400">Send message immediately</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    checked={sendingMode === 'schedule'}
                    onChange={() => setSendingMode('schedule')}
                    className="accent-[#00A884]"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Schedule for Later
                    </span>
                    <p className="text-[10px] text-slate-400">Choose date and time</p>
                  </div>
                </label>

                {sendingMode === 'schedule' && (
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full mt-1 text-xs p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                )}
              </div>
            </div>

            {/* Advanced Options toggles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Advanced Options
              </label>
              <div className="space-y-2.5 text-xs">
                {[
                  { key: 'linkPreview', label: 'Enable Link Preview' },
                  { key: 'personalize', label: 'Personalize with Variables' },
                  { key: 'unsubscribe', label: 'Auto Unsubscribe Link' },
                  { key: 'trackStatus', label: 'Track Delivery & Read Status' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setToggles((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className={`w-9 h-5 rounded-full transition relative ${
                        toggles[key] ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition ${
                          toggles[key] ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Header Image upload box */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Header Image (Optional)
              </label>
              <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                <Image className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Click or drag image here</p>
                <p className="text-[9px] text-slate-400">Max size: 5MB (JPG, PNG)</p>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 text-[11px] border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400">Selected Recipients:</span>{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedIds.length} contacts
            </span>{' '}
            <button className="text-[#00A884] hover:underline font-medium ml-1">
              View List
            </button>
          </div>
        </div>

        <div className="text-xs text-center">
          <span className="text-slate-400">Estimated Cost:</span>{' '}
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {selectedIds.length} credits
          </span>{' '}
          <span className="text-[11px] text-slate-400">(1 credit per message)</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Save as Template
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-md transition"
          >
            <Send className="w-3.5 h-3.5" />
            Send Message Now
          </button>
        </div>
      </div>
    </div>
  )
}
