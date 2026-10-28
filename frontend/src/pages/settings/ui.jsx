import { useEffect, useId, useRef } from 'react'
import { Loader2, AlertTriangle, CheckCircle2, Info, X, RefreshCw, Inbox } from 'lucide-react'

/* ---------- helpers ---------- */

export function formatDate(value, withTime = true) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return withTime ? d.toLocaleString() : d.toLocaleDateString()
}

// Make sure the currently saved value is always selectable, even if it is not in our static list.
export function ensureOption(options, value) {
  if (value === undefined || value === null || value === '') return options
  return options.some((o) => String(o.value) === String(value))
    ? options
    : [...options, { value, label: String(value) }]
}

const fieldBorder = (err) =>
  err ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'

export const inputClass = (err) =>
  `w-full p-2 text-xs border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A884]/40 disabled:opacity-60 disabled:cursor-not-allowed ${fieldBorder(err)}`

/* ---------- layout ---------- */

export function Card({ title, description, actions, children, className = '' }) {
  return (
    <section
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 text-xs ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h3>
            {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}

/* ---------- form controls ---------- */

export function Field({ label, required, error, hint, htmlFor, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
      {error && (
        <p className="text-[10px] text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ label, required, error, hint, value, onChange, type = 'text', className = '', ...rest }) {
  const id = useId()
  return (
    <Field label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`${inputClass(error)} ${className}`}
        {...rest}
      />
    </Field>
  )
}

export function TextArea({ label, required, error, hint, value, onChange, rows = 3, ...rest }) {
  const id = useId()
  return (
    <Field label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={inputClass(error)}
        {...rest}
      />
    </Field>
  )
}

export function SelectInput({ label, required, error, hint, value, onChange, options, placeholder, ...rest }) {
  const id = useId()
  return (
    <Field label={label} required={required} error={error} hint={hint} htmlFor={id}>
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={inputClass(error)}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function Toggle({ checked, onChange, disabled, label, description }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span id={id} className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        {description && <p className="text-[10px] text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-labelledby={id}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

/* ---------- buttons ---------- */

export function Button({ variant = 'primary', busy, disabled, children, className = '', ...rest }) {
  const styles = {
    primary: 'bg-[#00A884] hover:bg-[#008f6f] text-white',
    secondary:
      'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-[#00A884] hover:underline',
  }
  return (
    <button
      type="button"
      disabled={disabled || busy}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...rest}
    >
      {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}

export function SaveBar({ dirty, saving, onSave, onCancel, readOnly }) {
  if (readOnly) {
    return (
      <p className="text-[11px] text-slate-400 text-center py-2">
        You have read-only access to these settings.
      </p>
    )
  }
  return (
    <div className="sticky bottom-0 z-10 -mx-1 px-1 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
      <span className={`text-[11px] ${dirty ? 'text-amber-600' : 'text-slate-400'}`}>
        {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={!dirty || saving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!dirty} busy={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

/* ---------- status & feedback ---------- */

const BADGE = {
  connected: 'emerald',
  active: 'emerald',
  verified: 'emerald',
  success: 'emerald',
  pending: 'amber',
  invited: 'amber',
  disconnected: 'slate',
  inactive: 'slate',
  not_connected: 'slate',
  error: 'red',
  failed: 'red',
}
const BADGE_CLASS = {
  emerald: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  amber: 'text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  slate: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
  red: 'text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-400',
}
const DOT_CLASS = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', slate: 'bg-slate-400', red: 'bg-red-500' }

export function StatusBadge({ status }) {
  const key = String(status || 'disconnected').toLowerCase()
  const tone = BADGE[key] || 'slate'
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${BADGE_CLASS[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASS[tone]}`} />
      {key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  )
}

export function Banner({ kind = 'info', children, onRetry, onClose }) {
  const tone = {
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900',
    info: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900',
  }[kind]
  const Icon = { error: AlertTriangle, warning: AlertTriangle, success: CheckCircle2, info: Info }[kind]
  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${tone}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon className="w-4 h-4 shrink-0 mt-px" />
      <div className="flex-1 min-w-0">{children}</div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 font-semibold underline">
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-xs text-slate-400" role="status">
      <Loader2 className="w-4 h-4 animate-spin" /> {label}
    </div>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center text-center gap-1 py-8 text-slate-400">
      <Inbox className="w-6 h-6" />
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{title}</p>
      {description && <p className="text-[11px]">{description}</p>}
    </div>
  )
}

// Wraps a tab body: loading -> error(with retry) -> content
export function SectionState({ status, error, onRetry, children }) {
  if (status === 'loading') return <LoadingState />
  if (status === 'error')
    return (
      <Banner kind="error" onRetry={onRetry}>
        {error || 'Could not load settings.'}
      </Banner>
    )
  return children
}

/* ---------- dialogs ---------- */

export function Modal({ open, title, onClose, children, footer, busy, wide }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, busy, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onMouseDown={() => !busy && onClose()}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full ${wide ? 'max-w-lg' : 'max-w-md'} max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 outline-none`}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <h3 id={titleId} className="font-bold text-sm text-slate-900 dark:text-white">
            {title}
          </h3>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-4 pb-4">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, busy, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      busy={busy}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} busy={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div>{message}</div>
    </Modal>
  )
}
