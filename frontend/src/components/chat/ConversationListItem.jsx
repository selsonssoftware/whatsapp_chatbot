import Avatar from './Avatar.jsx'
import ConversationStatusBadge from './ConversationStatusBadge.jsx'
import { relativeTime } from '../../utils/text.js'

/**
 * One row of the conversation list.
 */
export default function ConversationListItem({ conversation, selected, onSelect, lastMessage }) {
  const customer = conversation.customer
  const supporter = conversation.supporter
  const preview = lastMessage?.text || 'No messages yet'

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`conv-item w-full text-left ${selected ? 'active' : ''}`}
      aria-current={selected ? 'true' : undefined}
    >
      <div className="flex items-start gap-3">
        <Avatar name={customer?.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {customer?.name || 'Unknown customer'}
            </span>
            <span className="text-xs text-gray-500 shrink-0">{relativeTime(conversation.lastMessageAt)}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{preview}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <ConversationStatusBadge status={conversation.status} className="text-xs" />
            {conversation.unread > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[11px] font-semibold flex items-center justify-center">
                {conversation.unread}
              </span>
            )}
            <span className="text-xs text-gray-500 truncate">
              {supporter ? supporter.name : 'Unassigned'}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
