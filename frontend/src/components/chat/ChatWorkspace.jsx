import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import { Drawer, EmptyState, Icon, Notice, SearchBar, Tabs } from '../index.js'
import Avatar from './Avatar.jsx'
import ChatMessageBubble from './ChatMessageBubble.jsx'
import ConversationListItem from './ConversationListItem.jsx'
import CustomerDetailsPanel from './CustomerDetailsPanel.jsx'
import MessageComposer from './MessageComposer.jsx'
import SupporterAssignmentSelect from './SupporterAssignmentSelect.jsx'
import { useConfirm } from '../../hooks/useConfirm.js'
import { DEMO_CUSTOMERS } from '../../data/chatDemoData.js'
import {
  appendMessage,
  assignConversation,
  decorateConversations,
  filterConversations,
  getDemoConversations,
  getDemoMessages,
  getLastMessage,
  getRecentActivity,
  getThread,
  markConversationRead,
  saveDemoConversations,
  saveDemoMessages,
  setSelectedSupporterId,
  updateConversationStatus,
} from '../../services/chatDemoService.js'
import { getSupporters, normalizeSupporter } from '../../services/supporterService.js'

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'open', label: 'Open' },
  { id: 'pending', label: 'Pending' },
  { id: 'closed', label: 'Closed' },
]

/**
 * Three column chat monitoring workspace shared by the manager inbox and the
 * supporter inbox.
 *
 * `scope` decides the visibility rules:
 * - `manager` sees every conversation and can filter by supporter
 * - `supporter` only sees the conversations of the selected demo supporter
 */
export default function ChatWorkspace({
  scope = 'manager',
  supporterId: supporterIdProp,
  onSupporterChange,
  emptyMessage = 'No conversations match the current filters.',
}) {
  const confirmAction = useConfirm()
  const [searchParams] = useSearchParams()
  const [supporters] = useState(() => getSupporters().map(normalizeSupporter))
  const [conversations, setConversations] = useState(() =>
    decorateConversations(getDemoConversations(), DEMO_CUSTOMERS, getSupporters().map(normalizeSupporter))
  )
  const [messages, setMessages] = useState(() => getDemoMessages())
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [supporterFilter, setSupporterFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const [mobileView, setMobileView] = useState('list')
  const [showDetails, setShowDetails] = useState(false)
  const [notice, setNotice] = useState(null)

  // The manager filter follows a supporter picked in the query string; the
  // supporter inbox follows the demo supporter picked in the page header.
  const querySupporter = scope === 'manager' ? searchParams.get('supporter') : null
  const [syncedQuery, setSyncedQuery] = useState(querySupporter)
  if (querySupporter !== syncedQuery) {
    setSyncedQuery(querySupporter)
    setSupporterFilter(querySupporter || 'all')
  }

  const effectiveSupporterId = scope === 'supporter' ? supporterIdProp || 'all' : supporterFilter

  const visibleConversations = useMemo(
    () =>
      filterConversations(conversations, {
        search,
        status: statusFilter,
        supporterId: effectiveSupporterId,
      }),
    [conversations, effectiveSupporterId, search, statusFilter]
  )

  const selected = conversations.find((conversation) => conversation.id === selectedId) || null
  const selectedSupporter = supporters.find((supporter) => supporter.id === selected?.supporterId) || null
  const thread = useMemo(() => getThread(messages, selectedId), [messages, selectedId])
  const activity = useMemo(() => getRecentActivity(messages, selectedId), [messages, selectedId])

  const persistConversations = useCallback((next) => {
    setConversations(next)
    saveDemoConversations(next)
  }, [])

  const handleSelect = useCallback(
    (id) => {
      setSelectedId(id)
      setMobileView('chat')
      persistConversations(markConversationRead(conversations, id))
    },
    [conversations, persistConversations]
  )

  const handleSend = useCallback(() => {
    const body = draft.trim()
    if (!body || !selectedId) return

    const nextMessages = appendMessage(messages, selectedId, body)
    setMessages(nextMessages)
    saveDemoMessages(nextMessages)
    setDraft('')

    persistConversations(
      conversations.map((conversation) =>
        conversation.id === selectedId
          ? { ...conversation, lastMessageAt: new Date().toISOString(), unread: 0 }
          : conversation
      )
    )
  }, [conversations, draft, messages, persistConversations, selectedId])

  const handleAssign = useCallback(
    async (nextSupporterId) => {
      if (!selectedId) return
      if (!nextSupporterId) {
        const confirmed = await confirmAction({
          title: 'Unassign conversation',
          message: 'Remove the current supporter from this conversation?',
          confirmLabel: 'Unassign',
        })
        if (!confirmed) return
      }
      persistConversations(assignConversation(conversations, selectedId, nextSupporterId))
      setNotice({
        type: 'success',
        message: nextSupporterId ? 'Conversation reassigned.' : 'Conversation left unassigned.',
      })
    },
    [confirmAction, conversations, persistConversations, selectedId]
  )

  const handleStatusChange = useCallback(
    async (status) => {
      if (!selectedId) return
      if (status === 'closed' && selected?.status !== 'closed') {
        const confirmed = await confirmAction({
          title: 'Close conversation',
          message: 'Close this conversation? It stays in the list as closed.',
          confirmLabel: 'Close conversation',
        })
        if (!confirmed) return
      }
      persistConversations(updateConversationStatus(conversations, selectedId, status))
      setNotice({ type: 'success', message: `Conversation marked as ${status}.` })
    },
    [confirmAction, conversations, persistConversations, selected, selectedId]
  )

  const handleSupporterFilterChange = (nextId) => {
    setSupporterFilter(nextId)
    setSelectedId(null)
    if (scope === 'supporter') {
      setSelectedSupporterId(nextId)
      onSupporterChange?.(nextId)
    }
  }
  const selectedCustomer = selected?.customer || null

  return (
    <div className="inbox-three">
      <section className={`inbox-list ${mobileView === 'list' ? 'show' : ''}`} aria-label="Conversations">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone number..." />

          <Tabs tabs={FILTER_TABS} activeTab={statusFilter} onChange={setStatusFilter} ariaLabel="Conversation filters" />

          {scope === 'manager' ? (
            <SupporterAssignmentSelect
              id="conversation-supporter-filter"
              label="Assigned supporter"
              value={supporterFilter}
              supporters={supporters}
              onChange={handleSupporterFilterChange}
              allowUnassigned={false}
            />
          ) : null}
        </div>

        <div className="overflow-y-auto">
          {visibleConversations.length === 0 ? (
            <div className="p-4">
              <EmptyState size="sm" icon="MessageSquare" title="No conversations" description={emptyMessage} />
            </div>
          ) : (
            visibleConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                selected={conversation.id === selectedId}
                onSelect={handleSelect}
                lastMessage={getLastMessage(messages, conversation.id)}
              />
            ))
          )}
        </div>
      </section>

      <section className={`inbox-view ${mobileView === 'chat' ? 'show' : ''}`} aria-label="Conversation">
        {selected ? (
          <>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <button
                className="icon-btn lg:hidden"
                onClick={() => setMobileView('list')}
                aria-label="Back to conversations"
              >
                <Icon name="ChevronDown" size={18} />
              </button>
              <Avatar name={selectedCustomer?.name} size="md" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {selectedCustomer?.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {selectedCustomer?.phone}
                  {selectedSupporter ? ` · ${selectedSupporter.name}` : ' · Unassigned'}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <select
                  value={selected.supporterId || ''}
                  onChange={(event) => handleAssign(event.target.value || null)}
                  aria-label="Assign supporter"
                  className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Unassigned</option>
                  {supporters.map((supporter) => (
                    <option key={supporter.id} value={supporter.id}>
                      {supporter.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selected.status}
                  onChange={(event) => handleStatusChange(event.target.value)}
                  aria-label="Conversation status"
                  className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button
                className="icon-btn xl:hidden"
                onClick={() => setShowDetails(true)}
                aria-label="Customer details"
              >
                <Info size={18} />
              </button>
            </div>

            <div className="messages">
              {notice && (
                <Notice type={notice.type} onDismiss={() => setNotice(null)}>
                  {notice.message}
                </Notice>
              )}
              <Notice type="info" className="mb-1">
                Sample conversation data for the prototype — nothing is delivered to WhatsApp.
              </Notice>
              {thread.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}
            </div>

            <MessageComposer value={draft} onChange={setDraft} onSend={handleSend} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon="MessageSquare"
              title="Select a conversation"
              description="Pick a conversation from the list to read the thread and reply."
            />
          </div>
        )}
      </section>

      <div className="inbox-details-col">
        <CustomerDetailsPanel
          conversation={selected}
          customer={selectedCustomer}
          supporter={selectedSupporter}
          supporters={supporters}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
          activity={activity}
        />
      </div>

      <Drawer isOpen={showDetails} onClose={() => setShowDetails(false)} title="Customer details">
        <CustomerDetailsPanel
          conversation={selected}
          customer={selectedCustomer}
          supporter={selectedSupporter}
          supporters={supporters}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
          activity={activity}
        />
      </Drawer>
    </div>
  )
}
