import Badge from '../Badge.jsx'

const STATUS_STYLES = {
  open: { variant: 'info', label: 'Open' },
  pending: { variant: 'warning', label: 'Pending' },
  closed: { variant: 'success', label: 'Closed' },
}

/**
 * Coloured badge for a conversation status.
 */
export default function ConversationStatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || { variant: 'info', label: status || 'Unknown' }
  return (
    <Badge variant={style.variant} className={className}>
      {style.label}
    </Badge>
  )
}
