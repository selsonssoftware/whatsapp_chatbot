import Icon from './Icon.jsx'

const TONE_STYLES = {
  info: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300',
  success: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
  error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
}

const TONE_ICONS = {
  info: 'Info',
  success: 'Check',
  warning: 'AlertCircle',
  error: 'AlertCircle',
}

/**
 * Inline page-level feedback banner. Replaces blocking native `alert()` calls
 * so results are announced to assistive technology and stay on the page.
 */
export default function Notice({ type = 'info', title, children, onDismiss, className = '' }) {
  if (!children && !title) return null

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded-md border px-4 py-3 text-sm ${
        TONE_STYLES[type] || TONE_STYLES.info
      } ${className}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span className="flex items-start gap-2">
        <Icon name={TONE_ICONS[type] || 'Info'} size={16} className="mt-0.5 shrink-0" />
        <span>
          {title && <strong className="font-semibold">{title} </strong>}
          {children}
        </span>
      </span>
      {onDismiss && (
        <button type="button" className="shrink-0 text-xs underline" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  )
}
