import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, MessageSquare } from 'lucide-react'
import { Button, Icon, Notice } from '../../components/index.js'
import SummaryCards from '../../components/chat/SummaryCards.jsx'
import ChatWorkspace from '../../components/chat/ChatWorkspace.jsx'
import Avatar from '../../components/chat/Avatar.jsx'
import { DEMO_CUSTOMERS } from '../../data/chatDemoData.js'
import {
  decorateConversations,
  getDemoConversations,
  getSelectedSupporterId,
  setSelectedSupporterId,
} from '../../services/chatDemoService.js'
import { getSupporters, normalizeSupporter } from '../../services/supporterService.js'

/**
 * Supporter view: only the conversations of the selected demo supporter.
 */
export default function SupporterInboxPage() {
  const navigate = useNavigate()
  const supporters = useMemo(() => getSupporters().map(normalizeSupporter), [])
  const [supporterId, setSupporterId] = useState(
    () => getSelectedSupporterId() || supporters[0]?.id || 'all'
  )

  const conversations = useMemo(
    () =>
      decorateConversations(getDemoConversations(), DEMO_CUSTOMERS, supporters).filter((conversation) =>
        supporterId === 'all' ? true : conversation.supporterId === supporterId
      ),
    [supporterId, supporters]
  )

  const stats = useMemo(() => {
    const unread = conversations.reduce((total, conversation) => total + (conversation.unread || 0), 0)
    return [
      { label: 'My Conversations', value: conversations.length, icon: MessageSquare },
      { label: 'Open', value: conversations.filter((c) => c.status === 'open').length, icon: MessageSquare, tone: 'brand' },
      { label: 'Pending', value: conversations.filter((c) => c.status === 'pending').length, icon: MessageSquare, tone: 'warning' },
      { label: 'Unread', value: unread, icon: MessageSquare, tone: 'danger' },
    ]
  }, [conversations])

  const activeSupporter = supporters.find((supporter) => supporter.id === supporterId)

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Supporter Inbox</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Conversations assigned to one supporter · demo data only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/manager/inbox')}>
            <Icon name="Users" size={16} />
            Manager Inbox
          </Button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeSupporter && <Avatar name={activeSupporter.name} size="sm" presence={activeSupporter.presence} />}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Viewing as</p>
              <p className="text-xs text-gray-500">
                {activeSupporter ? `${activeSupporter.name} · ${activeSupporter.role}` : 'Every supporter'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="demo-supporter" className="text-sm text-gray-600 dark:text-gray-400">
              Demo supporter
            </label>
            <select
              id="demo-supporter"
              value={supporterId}
              onChange={(event) => {
                setSupporterId(event.target.value)
                setSelectedSupporterId(event.target.value)
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Every supporter</option>
              {supporters.map((supporter) => (
                <option key={supporter.id} value={supporter.id}>
                  {supporter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Notice type="warning" className="mb-4">
        <span className="inline-flex items-center gap-1.5">
          <FlaskConical size={14} />
          Development only: the supporter switcher simulates assignments. Real permissions arrive with the backend.
        </span>
      </Notice>

      <SummaryCards cards={stats} />

      <ChatWorkspace
        scope="supporter"
        supporterId={supporterId}
        onSupporterChange={setSupporterId}
        emptyMessage="This supporter has no conversations yet."
      />
    </div>
  )
}
