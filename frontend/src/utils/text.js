/**
 * Small text helpers shared by the chat monitoring components.
 */

export function initials(name = '') {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/**
 * Relative timestamp used in the conversation list.
 */
export function relativeTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000)
  if (diffMinutes < 1) return 'now'
  if (diffMinutes < 60) return `${diffMinutes}m`
  if (diffMinutes < 60 * 24) return `${Math.round(diffMinutes / 60)}h`
  if (diffMinutes < 60 * 24 * 7) return `${Math.round(diffMinutes / (60 * 24))}d`
  return date.toLocaleDateString()
}

/**
 * Clock time used inside the chat bubbles.
 */
export function clockTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
