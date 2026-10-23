import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react'
import { Button, Icon, Notice } from '../../components/index.js'
import SummaryCards from '../../components/chat/SummaryCards.jsx'
import ChatWorkspace from '../../components/chat/ChatWorkspace.jsx'
import { DEMO_CUSTOMERS } from '../../data/chatDemoData.js'
import { decorateConversations, getDemoConversations } from '../../services/chatDemoService.js'
import { getSupporters, normalizeSupporter } from '../../services/supporterService.js'

/**
 * Admin manager view: every conversation handled by the support bench.
 */
export default function ManagerInboxPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [notice] = useState(null)

  const supporters = useMemo(() => getSupporters().map(normalizeSupporter), [])
  const conversations = useMemo(
    () => decorateConversations(getDemoConversations(), DEMO_CUSTOMERS, supporters),
    [supporters]
  )

  const stats = useMemo(() => {
    const unread = conversations.reduce((total, conversation) => total + (conversation.unread || 0), 0)
    return [
      { label: 'Conversations', value: conversations.length, icon: MessageSquare },
      { label: 'Open', value: conversations.filter((c) => c.status === 'open').length, icon: AlertCircle, tone: 'brand' },
      { label: 'Pending', value: conversations.filter((c) => c.status === 'pending').length, icon: Clock, tone: 'warning' },
      { label: 'Unread', value: unread, icon: CheckCircle2, tone: 'danger' },
    ]
  }, [conversations])

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Manager Inbox</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor every conversation handled by the support bench · demo data only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/supporters')}>
            <Icon name="Users" size={16} />
            Supporters
          </Button>
          <Button variant="secondary" onClick={() => navigate('/supporter/inbox')}>
            <Icon name="MessageSquare" size={16} />
            Supporter Inbox
          </Button>
        </div>
      </div>

      {notice && (
        <Notice type={notice.type} onDismiss={() => {}}>
          {notice.message}
        </Notice>
      )}

      <SummaryCards cards={stats} />

      {searchParams.get('supporter') && (
        <Notice type="info" onDismiss={() => {}}>
          Filtered to one supporter. Use the “Assigned supporter” dropdown in the conversation list to change it.
        </Notice>
      )}

      <ChatWorkspace scope="manager" />
    </div>
  )
}
