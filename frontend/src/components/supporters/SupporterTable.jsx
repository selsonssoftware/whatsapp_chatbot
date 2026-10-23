import Badge from '../Badge.jsx'
import Button from '../Button.jsx'
import Icon from '../Icon.jsx'
import Avatar from '../chat/Avatar.jsx'
import { relativeTime } from '../../utils/text.js'

function presenceBadge(presence) {
  return presence === 'online' ? (
    <Badge variant="success">Online</Badge>
  ) : (
    <Badge variant="warning">Offline</Badge>
  )
}

/**
 * Supporter directory table.
 */
export default function SupporterTable({ supporters = [], statsBySupporter = {}, onViewDetails, onViewChats, onEdit, onRemove }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Assigned Chats</th>
            <th>Unread Chats</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supporters.map((supporter) => {
            const stats = statsBySupporter[supporter.id] || { assigned: 0, unread: 0 }
            return (
              <tr key={supporter.id}>
                <td>
                  <Avatar name={supporter.name} size="sm" presence={supporter.presence} />
                </td>
                <td>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{supporter.name}</p>
                  <p className="text-xs text-gray-500">{supporter.role}</p>
                </td>
                <td>{supporter.email}</td>
                <td>{supporter.phone || '—'}</td>
                <td>{presenceBadge(supporter.presence)}</td>
                <td>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{stats.assigned}</span>
                </td>
                <td>
                  <span
                    className={`font-medium ${
                      stats.unread > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {stats.unread}
                  </span>
                </td>
                <td className="whitespace-nowrap">{relativeTime(supporter.lastActive) || '—'}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => onViewDetails(supporter)}>
                      View Details
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => onViewChats(supporter)}>
                      View Chats
                    </Button>
                    <button className="icon-btn" onClick={() => onEdit(supporter)} aria-label={`Edit ${supporter.name}`}>
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      className="icon-btn text-red-600"
                      onClick={() => onRemove(supporter)}
                      aria-label={`Remove ${supporter.name}`}
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
