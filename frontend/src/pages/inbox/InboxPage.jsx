import { useState } from 'react'
import { DEMO_CONVERSATIONS, DEMO_CONTACTS } from '../../data/demoData.js'
import { Badge, Button, Tabs, Icon, Drawer } from '../../components/index.js'

export default function InboxPage() {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState(conversations[0]?.id)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [text, setText] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [mobileView, setMobileView] = useState('list')
  const [notes, setNotes] = useState('')

  const selected = conversations.find((c) => c.id === selectedId)
  const contact = DEMO_CONTACTS.find((c) => c.id === selected?.contactId)

  const filtered = conversations.filter((c) => {
    const matchesFilter =
      filter === 'unread' ? c.unread > 0 : filter === 'unassigned' ? !c.assignedTo : filter === 'resolved' ? c.status === 'resolved' : true
    const matchesSearch = (c.lastMessage || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const send = () => {
    if (!text.trim()) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              messages: [...c.messages, { id: Date.now(), type: 'outgoing', text, time: new Date().toLocaleTimeString() }],
              lastMessage: text,
              lastTime: new Date().toLocaleTimeString(),
            }
          : c
      )
    )
    setText('')
  }

  const resolve = () => {
    setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, status: 'resolved' } : c)))
  }

  const reopen = () => {
    setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, status: 'open' } : c)))
  }

  const assignAgent = (agent) => {
    setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, assignedTo: agent } : c)))
    setShowAssignModal(false)
  }

  const addNote = () => {
    if (!notes.trim()) return
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, notes: [...(c.notes || []), { text: notes, time: new Date().toISOString() }] } : c))
    )
    setNotes('')
  }

  const updateContact = (field, value) => {
    const contactIndex = DEMO_CONTACTS.findIndex((c) => c.id === contact?.id)
    if (contactIndex >= 0) {
      DEMO_CONTACTS[contactIndex] = { ...DEMO_CONTACTS[contactIndex], [field]: value }
    }
  }

  const agents = ['Alex Agent', 'Sam Support', 'Morgan Manager']

  return (
    <div className="inbox">
      <div className={`inbox-list ${mobileView === 'list' ? 'show' : ''}`}>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          />
        </div>
        <Tabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'unassigned', label: 'Unassigned' },
            { id: 'resolved', label: 'Resolved' },
          ]}
          activeTab={filter}
          onChange={setFilter}
        />
        <div className="overflow-y-auto flex-1">
          {filtered.map((c) => {
            const convContact = DEMO_CONTACTS.find((contact) => contact.id === c.contactId)
            return (
              <div
                key={c.id}
                className={`conv-item ${selectedId === c.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedId(c.id)
                  setMobileView('view')
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {convContact?.firstName} {convContact?.lastName}
                      </span>
                      {c.unread > 0 && <Badge variant="info">{c.unread}</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{c.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{c.lastTime}</span>
                      <Badge variant={c.status === 'resolved' ? 'success' : c.priority === 'high' ? 'error' : 'info'} className="text-xs">
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`inbox-view ${mobileView === 'view' ? 'show' : ''}`}>
        {selected ? (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="icon-btn md:hidden" onClick={() => setMobileView('list')}>
                  <Icon name="ChevronDown" size={18} />
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {contact?.firstName} {contact?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowDetails(true)}>
                  <Icon name="Info" size={16} />
                  Details
                </Button>
                {selected.status === 'open' ? (
                  <Button variant="secondary" size="sm" onClick={resolve}>
                    Resolve
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={reopen}>
                    Reopen
                  </Button>
                )}
              </div>
            </div>

            <div className="messages">
              {selected.messages.map((m) => (
                <div key={m.id} className={m.type}>
                  <p>{m.text}</p>
                  <small className="text-xs text-gray-500">{m.time}</small>
                </div>
              ))}
            </div>

            <div className="composer">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && send()}
              />
              <Button variant="primary" onClick={send}>
                <Icon name="Send" size={16} />
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a conversation</div>
        )}
      </div>

      <Drawer
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Contact Details"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button variant="primary">Send Message</Button>
          </>
        }
      >
        {contact && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={`${contact.firstName} ${contact.lastName}`}
                onChange={(e) => {
                  const [first, ...last] = e.target.value.split(' ')
                  updateContact('firstName', first)
                  updateContact('lastName', last.join(' '))
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {contact.tags?.map((tag) => (
                  <Badge key={tag} variant="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
              <select
                value={selected?.assignedTo || ''}
                onChange={(e) => assignAgent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <Badge variant={selected?.status === 'resolved' ? 'success' : 'info'}>{selected?.status}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <Badge variant={selected?.priority === 'high' ? 'error' : 'info'}>{selected?.priority}</Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <Button variant="secondary" size="sm" className="mt-2" onClick={addNote}>
                Add Note
              </Button>
            </div>
            {selected?.notes && selected.notes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes History</label>
                <div className="space-y-2">
                  {selected.notes.map((note, index) => (
                    <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <p>{note.text}</p>
                      <small className="text-gray-500">{new Date(note.time).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
