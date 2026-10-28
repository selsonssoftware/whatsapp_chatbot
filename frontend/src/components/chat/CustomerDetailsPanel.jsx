import { Mail, Phone, StickyNote, User } from 'lucide-react'
import Badge from '../Badge.jsx'
import Avatar from './Avatar.jsx'
import SupporterAssignmentSelect from './SupporterAssignmentSelect.jsx'

function formatActivityTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm text-gray-900 dark:text-gray-100 break-words">{value}</p>
      </div>
    </div>
  )
}

/**
 * Right hand column of the inbox: customer details, assignment, status and
 * recent activity.
 */
export default function CustomerDetailsPanel({
  conversation,
  customer,
  supporter,
  supporters = [],
  onAssign,
  onStatusChange,
  activity = [],
}) {
  if (!conversation) {
    return (
      <aside className="inbox-details">
        <p className="text-sm text-gray-500 dark:text-gray-400">Select a conversation to see customer details.</p>
      </aside>
    )
  }

  return (
    <aside className="inbox-details">
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={customer?.name} size="lg" />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{customer?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{customer?.company || 'Customer'}</p>
        </div>
      </div>

      <div className="space-y-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <DetailRow icon={Phone} label="WhatsApp number" value={customer?.phone} />
        <DetailRow icon={Mail} label="Email" value={customer?.email} />
        <DetailRow icon={User} label="Location" value={customer?.location} />
      </div>

      <div className="space-y-3">
        <SupporterAssignmentSelect
          id="details-supporter"
          value={conversation.supporterId || ''}
          supporters={supporters}
          onChange={onAssign}
        />

        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conversation status</span>
          <div className="flex items-center gap-2 flex-wrap">
            {['open', 'pending', 'closed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                aria-pressed={conversation.status === status}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  conversation.status === status
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {status[0].toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {supporter && (
          <div className="flex items-center gap-2">
            <Avatar name={supporter.name} size="xs" presence={supporter.presence} />
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{supporter.name}</p>
              <p className="text-xs text-gray-500">{supporter.role} · {supporter.presence === 'online' ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        )}

        {customer?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {customer.tags.map((tag) => (
              <Badge key={tag} variant="info">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {customer?.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <StickyNote size={15} />
            Notes
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.notes}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent activity</p>
        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">No activity yet.</p>
        ) : (
          <ul className="space-y-2">
            {activity.map((message) => (
              <li key={message.id} className="text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {message.direction === 'outgoing' ? 'You' : customer?.name?.split(' ')[0] || 'Customer'}:
                  </span>{' '}
                  {message.text.length > 60 ? `${message.text.slice(0, 60)}…` : message.text}
                </p>
                <p className="text-xs text-gray-500">{formatActivityTime(message.at)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
